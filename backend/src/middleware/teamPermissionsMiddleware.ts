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
            res.status(403).send({ message: "You aren't a member of this team" })
        }
    } catch (error) {
        console.log(error)
        res.status(403).send({ message: 'Server error: checking team membership' })
    }
}

enum Permissions {
    REGULAR = 'regular',
    ADMIN = 'admin',
}
export type PermissionString = keyof typeof Permissions

export const HasPermission = (permissionLevel: PermissionString) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            let permissionLevelForUser = await query(
                'SELECT permission FROM team_members WHERE team_id=$1 AND user_id=$2',
                [res.locals.team_id, res.locals.user_id]
            )
            const { permission } = permissionLevelForUser.rows[0]

            if (permission === 'regular' && permissionLevel === 'ADMIN') {
                res.status(403).send({
                    message: `Your permission level ${permission} cannot do an action that requires: ${permissionLevel}`,
                })
                return
            }
            res.locals.team_permission = permission
            next()
        } catch (error) {
            console.log(error)
            res.sendStatus(500)
        }
    }
}
