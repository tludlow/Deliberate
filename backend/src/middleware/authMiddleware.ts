import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export const AuthTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    //No header provided send 401 (unauthorized)
    if (!authHeader) {
        return res.sendStatus(401)
    } else {
        const authToken = authHeader.split(' ')[1]
        //Decrypt the token
        jwt.verify(authToken, 'J%uErl<*6odhgm)XA8%}=SFePD(&`1', (error, decodedToken: any) => {
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

            // console.log('Decoded token: ')
            console.log(decodedToken)
            // console.log(authToken)
            //User is authenticated, add their token to the request locals so it can possibly be used later
            res.locals.user_id = decodedToken?.data.id
            res.locals.github_token = decodedToken?.data.githubToken
            next()
        })
    }
}
