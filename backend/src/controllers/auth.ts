import { Request, Response } from 'express'
import { query } from '../db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

/**
 * Authentication route to log in a user
 * @route POST /auth/login
 */
export const Login = async (req: Request, res: Response) => {
    //Details provided by the user
    let { email, password } = req.body

    //See if a user with this email exists
    let checkResult = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email])
    if (checkResult.rowCount < 1) {
        //400 Response - the user doesnt exist
        res.status(400).json({
            message: 'A user with that email / password does not exist',
        })
        return
    }

    //Hash the password provided so we can compare it with the database version
    const match = await bcrypt.compare(password, checkResult.rows[0].password)
    if (!match) {
        //400 Response - The user email / password combination dont match
        res.status(400).json({
            message: 'Wrong email / password combination',
        })
        return
    }

    //Generate the user a set of access and refresh tokens because they have been authenticated
    //Refresh token, long lived (3 months) and used to generate new access tokens
    const refreshToken = jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 * 3,
            issuer: 'deliberate',
            subject: 'refreshtoken',
            data: {
                email: email,
                id: checkResult.rows[0].id,
                github_token: checkResult.rows[0].github_token,
                github_id: checkResult.rows[0].github_id,
            },
        },
        'J%uErl<*6odhgm)XA8%}=SFePD(&`1'
    )

    //Access token, short lived (1 hour) and used to authenticate against the api
    const accessToken = jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 72,
            issuer: 'deliberate',
            subject: 'accesstoken',
            data: {
                email: email,
                id: checkResult.rows[0].id,
                github_token: checkResult.rows[0].github_token,
                github_id: checkResult.rows[0].github_id,
            },
        },
        'J%uErl<*6odhgm)XA8%}=SFePD(&`1'
    )

    //Set the cookies for the user
    res.cookie('refresh_token', refreshToken, {
        expires: new Date(Date.now() / 1000 + 60 * 60 * 24 * 30 * 3),
        httpOnly: true,
    })
    res.cookie('access_token', accessToken, {
        expires: new Date(Date.now() / 100 + 60 * 60 * 72),
        httpOnly: true,
    })

    console.log(`Access token: ${accessToken}`)

    //Send the information back to the user now that they are "logged in"
    res.status(200).json({
        email,
        name: checkResult.rows[0].first_name + ' ' + checkResult.rows[0].last_name,
        refreshToken,
        accessToken,
    })
}

/**
 * Authentication route to sign up a user
 * @route POST /auth/signup
 */

export const Signup = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body
    //Check if the passwords provided match
    if (password !== confirmPassword) {
        res.status(500).json({
            message: 'Your passwords do not match',
        })
        return
    }

    //Check if the email provided is of a correct format for an email
    var re = /\S+@\S+\.\S+/
    if (!re.test(email)) {
        res.status(500).json({
            message: 'Your email is not valid',
        })
        return
    }

    //See if the email provided is unique in the system
    let uniqueEmailResponse = await query('SELECT COUNT(*) as isUnique FROM USERS WHERE EMAIL = $1', [email])

    if (uniqueEmailResponse.rows[0].isunique > 0) {
        //500 Response - This email already is in use
        res.status(500).json({
            message: 'This email is already registered to an account',
        })
        return
    }

    //Hash the password provided
    const hashedPassword = await bcrypt.hash(password, 10)

    //Store the user details
    let userInsertResponse = await query(
        'INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4)',
        [firstName, lastName, email, hashedPassword]
    )

    //Get the users id to be put into the token
    let getNewUserId = await query('SELECT id FROM users WHERE email=$1 LIMIT 1', [email])

    let newUserId = getNewUserId.rows[0].id
    let insertUserCalendar = await query('INSERT INTO user_calendars (id, user_id) VALUES($1, $2)', [
        newUserId,
        newUserId,
    ])

    //Generate the user a set of access and refresh tokens because they have been authenticated
    //Refresh token, long lived (3 months) and used to generate new access tokens
    const refreshToken = jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 * 3,
            issuer: 'deliberate',
            subject: 'refreshtoken',
            data: { email: email, id: newUserId, github_token: '', github_id: -1 },
        },
        'J%uErl<*6odhgm)XA8%}=SFePD(&`1'
    )

    //Access token, short lived (1 hour) and used to authenticate against the api
    const accessToken = jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
            issuer: 'deliberate',
            subject: 'accesstoken',
            data: { email, id: newUserId, github_token: '', github_id: -1 },
        },
        'J%uErl<*6odhgm)XA8%}=SFePD(&`1'
    )

    //Set the cookies for the user
    res.cookie('refresh_token', refreshToken, {
        expires: new Date(Date.now() / 1000 + 60 * 60 * 24 * 30 * 3),
        httpOnly: true,
        sameSite: true,
    })
    res.cookie('access_token', accessToken, {
        expires: new Date(Date.now() / 100 + 60 * 60 * 12),
        httpOnly: true,
        sameSite: true,
    })

    res.status(200).json({
        name: firstName + ' ' + lastName,
        email,
        refreshToken,
        accessToken,
    })
}
