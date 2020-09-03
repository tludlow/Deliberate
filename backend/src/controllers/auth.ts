import { Request, Response } from 'express'
import { query } from '../db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

/**
 * Ping route to check api is working
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
            data: { email: email },
        },
        'J%uErl<*6odhgm)XA8%}=SFePD(&`1'
    )

    //Access token, short lived (1 hour) and used to authenticate against the api
    const accessToken = jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            issuer: 'deliberate',
            subject: 'accesstoken',
            data: { email: email },
        },
        'J%uErl<*6odhgm)XA8%}=SFePD(&`1'
    )

    //Set the cookies for the user
    res.cookie('refresh_token', refreshToken, {
        expires: new Date(Date.now() / 1000 + 60 * 60 * 24 * 30 * 3),
        httpOnly: true,
    })
    res.cookie('access_token', refreshToken, {
        expires: new Date(Date.now() / 100 + 60 * 60),
        httpOnly: true,
    })

    //Send the information back to the user now that they are "logged in"
    res.status(200).json({
        email,
        name: checkResult.rows[0].first_name + ' ' + checkResult.rows[0].last_name,
        refreshToken,
        accessToken,
    })
}
