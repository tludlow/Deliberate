import { Request, Response } from 'express'
import axios, { AxiosResponse } from 'axios'

export const GithubSSO = (req: Request, res: Response) => {
    //Received the code from github for the user
    let { code } = req.query

    //Now need to make a post request with the application id and the client code provided to get user info
    axios
        .post(
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
        .then((res: AxiosResponse) => {
            console.log(res.data)

            //Generate some tokens and get the information about the user from the user api endpoint
            //https://api.github.com/user, "Bearer res.data.access_token"
        })
    res.redirect('http://localhost:3000/account/github')
}
