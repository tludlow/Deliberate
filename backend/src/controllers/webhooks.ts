import { Request, Response } from 'express'
import { query } from '../db'
import { createTokenAuth } from '@octokit/auth-token'
import { request } from '@octokit/request'

export const SetupRepoIssueData = async (req: Request, res: Response) => {
    //Get the current data as a request and then register a webhook for this
    res.status(200).send({ data: req.body })
}
