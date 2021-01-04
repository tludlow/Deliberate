import { Console } from 'console'
import { Request, Response } from 'express'
import { query } from '../db'

export const Create = async (req: Request, res: Response) => {
    const { name, teamType } = req.body
    console.log(req.body)

    // //Check that the team doesnt already exist
    try {
        let teamTakenCheck = await query('SELECT COUNT(*) FROM teams WHERE name=$1', [name])
        if (teamTakenCheck.rows[0].count > 0) {
            res.status(400).send({ message: 'A team with this name already exists' })
            return
        }
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Server error #1' })
        return
    }

    //Create the team
    try {
        let createNewTeam = await query('INSERT INTO teams(name) VALUES($1)', [name])
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Server error #2' })
    }

    res.status(200).send(req.body)
}
