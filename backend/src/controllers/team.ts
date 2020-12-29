import { Request, Response } from 'express'
import { query } from '../db'

export const Create = async (req: Request, res: Response) => {
    const { name } = req.body
    console.log(req.body)

    // //Check that the team doesnt already exist
    try {
        let teamTakenCheck = await query('SELECT COUNT(*) FROM teams WHERE name = $1 LIMIT 1', [name])

        if (teamTakenCheck.rowCount !== 0) {
            res.status(400).send({ message: 'A team with this name already exists' })
            return
        }
    } catch (error) {
        console.log('Error checking for team name already existings')
        console.error(error)
    }

    

    res.status(200).send(req.body)
}
