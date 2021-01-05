import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export const AuthTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]

    //No token provided, send the user to the login page
    if (!token) {
        res.sendStatus(401)
        return
    }

    //Decrypt the token
    jwt.verify(token, 'J%uErl<*6odhgm)XA8%}=SFePD(&`1', (error, decodedToken: any) => {
        if (error) {
            switch (error.name) {
                case 'TokenExpiredError':
                    console.log('Token has expired')
                    res.sendStatus(401)
                    break
                case 'JsonWebTokenError':
                    console.log('Token is broken, probably our fault')
                    res.sendStatus(401)
                    break

                default:
                    res.sendStatus(401)
            }

            return
        }

        //User is authenticated, add their token to the request locals so it can possibly be used later
        res.locals.user_id = decodedToken?.data.id
    })

    //Passed the checks, go to the next middleware/route
    next()
}
