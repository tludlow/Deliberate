import { Request, Response } from 'express'
import axios from 'axios'
import jwt from 'jsonwebtoken'

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
        console.log(user.data)

        //Generate tokens for this user and log them in!

        const refreshToken = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 * 3,
                issuer: 'deliberate',
                subject: 'refreshtoken-github',
                data: { name: user.data.name || user.data.login },
            },
            'J%uErl<*6odhgm)XA8%}=SFePD(&`1'
        )

        //Access token, short lived (1 hour) and used to authenticate against the api
        const accessToken = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
                issuer: 'deliberate',
                subject: 'accesstoken-github',
                data: { name: user.data.name || user.data.login },
            },
            'J%uErl<*6odhgm)XA8%}=SFePD(&`1'
        )

        //Set the cookies for the user
        res.cookie('refresh_token', refreshToken, {
            expires: new Date(Date.now() / 1000 + 60 * 60 * 24 * 30 * 3),
            httpOnly: true,
        })
        res.cookie('access_token', accessToken, {
            expires: new Date(Date.now() / 100 + 60 * 60),
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
