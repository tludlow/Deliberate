import { NextFunction, Request, response, Response } from 'express'
import jwt from 'jsonwebtoken'
import { request } from '@octokit/request'

export const AuthTokenMiddleware = (platform: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization

        //No header provided send 401 (unauthorized)
        if (!authHeader) {
            return res.sendStatus(401)
        } else {
            const authToken = authHeader.split(' ')[1]
            //Decrypt the token
            jwt.verify(authToken, 'J%uErl<*6odhgm)XA8%}=SFePD(&`1', async (error, decodedToken: any) => {
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
                // console.log(decodedToken)
                // console.log(authToken)
                //User is authenticated, add their token to the request locals so it can possibly be used later
                res.locals.user_id = decodedToken?.data.id
                res.locals.github_token = decodedToken?.data.github_token
                res.locals.github_id = decodedToken?.data.github_id
                if (platform === 'github' && !decodedToken?.data.github_token) {
                    //Check that the token is there
                    console.log(decodedToken?.data.githubToken)
                    res.sendStatus(401)
                    return
                }
                if (platform === 'github') {
                    //Check token is valid
                    const requestWithAuth = request.defaults({
                        headers: {
                            authorization: `token ${decodedToken?.data.github_token}`,
                        },
                    })

                    try {
                        const result = await requestWithAuth(`GET /user/repos`)
                        console.log(`github token status: ${result.status}`)
                        if (result.status === 200) {
                            next()
                            return
                        } else {
                            res.sendStatus(401)
                            return
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
                next()
            })
        }
    }
}
