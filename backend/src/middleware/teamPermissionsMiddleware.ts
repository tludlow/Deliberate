import { NextFunction, Request, Response } from 'express'
import { query } from '../db'

export const IsTeamMember = async (req: Request, res: Response, next: NextFunction) => {
    //Check if the the user (passed inside the res.locals) is has owner permissions of this team
    const { teamName } = req.params
    const { user_id } = res.locals

    try {
        let teamIdFromName = await query('SELECT id FROM teams WHERE name=$1', [teamName])
        let isTeamMember = await query('SELECT 1 FROM team_members WHERE team_id=$1 AND user_id=$2', [
            teamIdFromName.rows[0].id,
            user_id,
        ])

        if (isTeamMember.rowCount === 1) {
            //Is team member
            res.locals.team_id = teamIdFromName.rows[0].id
            next()
        } else {
            //Is not team member
            res.sendStatus(403)
        }
    } catch (error) {
        res.sendStatus(403)
    }
}
