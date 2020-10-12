import { Request, Response } from 'express'
import { query } from '../db'

export const CreateTeam = async (req: Request, res: Response) => {
    const { name, teamType } = req.body

    const insertResult = await query('INSERT INTO teams(name, type) VALUES($1, $2)', [name, teamType.split('-')[2]])
}

export const GetTeamInfo = async (req: Request, res: Response) => {
    const { teamID } = req.params
    console.log(teamID)

    const teamInfo = await query('SELECT * FROM teams WHERE id = $1', [teamID])

    res.status(200).json({
        team: teamInfo.rows[0],
    })
}
