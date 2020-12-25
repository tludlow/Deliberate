import { Request, Response } from 'express'
import { query } from '../db'

export const Create = async (req: Request, res: Response) => {
    const { name } = req.body
    console.log(req.body)

    // //Check that the team doesnt already exist
    // let teamTakenCheck = await query('SELECT * FROM teams WHERE name = $1 LIMIT 1', [name])

    res.status(200).send({ message: 'wow well done you made it!' })
}
