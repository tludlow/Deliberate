import { Request, Response } from 'express'
import { query } from '../db'
import { createTokenAuth } from '@octokit/auth-token'
import { request } from '@octokit/request'

//c8dad9f7dc504d427550889bd8a0c825a751bf44
export const UserCalendar = async (req: Request, res: Response) => {
    // const auth = createTokenAuth('54c80d432331eb78265a3a945173fe9d1a31b36b')
    // const authentication = await auth()

    // const result = await request('GET /issues', {
    //     headers: {
    //         authorization: 'token 54c80d432331eb78265a3a945173fe9d1a31b36b',
    //     },
    // })
    // console.log(result)

    const requestWithAuth = request.defaults({
        headers: {
            authorization: 'token c8dad9f7dc504d427550889bd8a0c825a751bf44',
        },
    })
    const { data } = await requestWithAuth('GET /issues')
    console.log(data)

    // const octokit = new Octokit({ auth: `54c80d432331eb78265a3a945173fe9d1a31b36b` })

    // const response = await octokit.request('GET /issues')
    // console.log(response)

    res.status(200).send({ data })
}
