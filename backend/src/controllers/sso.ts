import { Request, Response } from 'express'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { query } from '../db'

export const GithubSSO = async (req: Request, res: Response) => {
    //Received the code from github for the user
    let { code } = req.query

    //Get the auth token from github for the user
    let authToken: string = ''
    try {
        let authData = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            {
                headers: {
                    Accept: 'application/json',
                },
            }
        )

        console.log(authData.data)

        authToken = authData.data.access_token
    } catch (e) {
        console.log(e)
        res.redirect('http://localhost:3000/account/error?message=1')
        return
    }

    //There was no errorr but the token wasn't ready which may as well have been an error
    if (authToken === '' || typeof authToken === undefined) {
        res.redirect('http://localhost:3000/account/error?message=2')
        return
    }

    //Get the user data so we can save it and stuff!
    try {
        console.log('AUTH TOKEN IS: ' + authToken)
        let user = await axios.get('https://api.github.com/user', { headers: { Authorization: `Bearer ${authToken}` } })

        let checkIfUserAccountInSystem = await query('SELECT id FROM users WHERE github_id=$1', [user.data.id])
        if (checkIfUserAccountInSystem.rowCount == 0) {
            //Create this account
            let newUser = await query(
                'INSERT INTO users (first_name, last_name, email, password, github_token, github_id VALUES($1, $2, $3, $4, $5, $6)',
                [
                    user.data.name.split(' ')[0],
                    user.data.name.split(' ')[1],
                    user.data.email,
                    'github-sso',
                    authToken,
                    user.data.id,
                ]
            )
        } else {
            //log in and update the token we have in the system
            let newUser = await query('UPDATE users SET github_token=$1 WHERE github_id=$2', [authToken, user.data.id])
        }

        //Generate tokens for this user and log them in!

        const refreshToken = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 * 72,
                issuer: 'deliberate',
                subject: 'refreshtoken',
                data: { name: user.data.name || user.data.login, githubToken: authToken, githubID: user.data.id },
            },
            'J%uErl<*6odhgm)XA8%}=SFePD(&`1'
        )

        //Access token, short lived (1 hour) and used to authenticate against the api
        const accessToken = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 72,
                issuer: 'deliberate',
                subject: 'accesstoken',
                data: { name: user.data.name || user.data.login, githubToken: authToken, githubID: user.data.id },
            },
            'J%uErl<*6odhgm)XA8%}=SFePD(&`1'
        )

        //Set the cookies for the user
        res.cookie('refresh_token', refreshToken, {
            expires: new Date(Date.now() / 1000 + 60 * 60 * 24 * 30 * 72),
            httpOnly: true,
        })
        res.cookie('access_token', accessToken, {
            expires: new Date(Date.now() / 100 + 60 * 60 * 72),
            httpOnly: true,
        })

        res.redirect(
            `http://localhost:3000/account/github?name=${
                user.data.name || user.data.login
            }&refreshToken=${refreshToken}&accessToken=${accessToken}`
        )
    } catch (e) {
        console.log(e)
        res.redirect('http://localhost:3000/account/error?message=3')
        return
    }
}

export const GetGithubRepos = async (req: Request, res: Response) => {}

export const AccountConnectedToGithub = async (req: Request, res: Response) => {
    const { user_id } = res.locals
    try {
        let isConnected = await query('SELECT github_id FROM users WHERE id=$1', [user_id])
        if (isConnected.rows[0].github_id != null) {
            res.status(200).send({ connected: true })
        } else {
            res.status(200).send({ connected: false })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'An error occured checking if your account is connected to github' })
    }
}
