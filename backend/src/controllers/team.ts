import { Request, Response } from 'express'
import { query } from '../db'

export const Create = async (req: Request, res: Response) => {
    const { name, teamType } = req.body

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
        let createNewTeam = await query('INSERT INTO teams(name) VALUES($1) RETURNING id', [name])

        //The user creating the team should be added to the team
        //Get the user id from the token in res.locals and add them to the team
        let insertUserToTeam = await query('INSERT INTO team_members(team_id, user_id) VALUES($1, $2)', [
            createNewTeam.rows[0].id,
            res.locals.user_id,
        ])
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Server error #2' })
    }

    res.status(200).send(req.body)
}

export const TeamInformation = async (req: Request, res: Response) => {
    let { team_id, team_permission } = res.locals

    try {
        let allTeamMembers = await query(
            'SELECT id, first_name, last_name, email, joined_at, permission FROM team_members JOIN users ON team_members.user_id = users.id WHERE team_members.team_id=$1 ORDER BY permission DESC',
            [team_id]
        )
        let teamInformation = await query('SELECT name, created_at FROM teams WHERE id=$1', [team_id])
        res.status(200).send({
            team_id,
            team_name: teamInformation.rows[0].name,
            created_at: teamInformation.rows[0].created_at,
            team_permission,
            members: allTeamMembers.rows,
        })
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export const ChangeTeamMemberPermission = async (req: Request, res: Response) => {
    const { new_permission, updating_id } = req.body
    const { user_id, team_id } = res.locals

    console.log(new_permission)
    try {
        let updatePermission = await query('UPDATE team_members SET permission=$1 WHERE team_id=$2 AND user_id=$3', [
            new_permission,
            team_id,
            updating_id,
        ])
        res.status(200)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: `Error changing user ${user_id} to role: ${new_permission}` })
    }
}
