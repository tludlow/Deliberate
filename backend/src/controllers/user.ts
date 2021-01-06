import { Request, Response } from 'express'
import { query } from '../db'

export const Dashboard = async (req: Request, res: Response) => {
    const user_id = res.locals.user_id

    //get the teams the user is a part of
    try {
        //Select all teams which the user is a part off and the aggregate the team member counts
        let userTeams = await query(
            'SELECT name, COUNT(team_id) as member_count FROM teams JOIN team_members tm ON teams.id = tm.team_id WHERE id IN (SELECT id FROM teams JOIN team_members tm ON teams.id = tm.team_id WHERE tm.user_id=$1) GROUP BY id',
            [user_id]
        )
        res.status(200).send({ user_id, teams: userTeams.rows })
    } catch (error) {
        console.log(error)
        console.log('Server error #1')
        res.sendStatus(500)
    }
}
