import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export const AuthTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]

    //No token provided, send the user to the login page
    if (!token) {
        res.redirect('http://localhost:3000/account/sign-in')
        return
    }

    //Decrypt the token
    jwt.verify(token, 'J%uErl<*6odhgm)XA8%}=SFePD(&`1', (error, decodedToken) => {
        if (error) {
            switch (error.name) {
                case 'TokenExpiredError':
                    console.log('Token has expired')
                    break
                case 'JsonWebTokenError':
                    console.log('Token is broken, probably our fault')
                    break

                default:
                    res.redirect('http://localhost:3000/account/sign-in')
            }

            return
        }
    })

    //Passed the checks, go to the next middleware/route
    next()
}
