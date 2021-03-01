import { Request, Response } from 'express'
import { query } from '../db'

export const GithubIssueWebhook = async (req: Request, res: Response) => {
    //Get the current data as a request and then register a webhook for this
    const payload = JSON.parse(req.body.payload)
    const event_type = req.headers['x-github-event']
    console.log(event_type)

    if (event_type == 'issues') {
        switch (payload.action) {
            case 'created':
        }
    }
    // console.log(payload)
    console.log('-----[issues webhook]------')
    res.status(200).send({ data: req.body })
}

export const GithubMilestoneWebhook = async (req: Request, res: Response) => {
    const payload = JSON.parse(req.body.payload)

    if (payload.action === 'opened') {
        try {
            let openedMilestone = await query('UPDATE milestones SET state=$1 WHERE id=$2', [
                'open',
                payload.milestone.id,
            ])
            res.status(200)
            return
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'server error' })
        }
    }
    if (payload.action === 'created') {
        try {
            let createMilestone = await query(
                'INSERT INTO milestones (id, title, description, due_date, state) VALUES ($1, $2, $3, $4, $5)',
                [
                    payload.milestone.id,
                    payload.milestone.title,
                    payload.milestone.description,
                    payload.milestone.due_on,
                    payload.milestone.state,
                ]
            )
            res.status(200)
            return
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'server error' })
        }
    }
    if (payload.action === 'edited') {
        try {
            let editedMilestone = await query(
                'UPDATE milestones SET title=$1, description=$2, due_date=$3, state=$4 WHERE id=$5',
                [
                    payload.milestone.title,
                    payload.milestone.description,
                    payload.milestone.due_on,
                    payload.milestone.state,
                    payload.milestone.id,
                ]
            )
            res.status(200)
            return
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'server error' })
        }
    }
    if (payload.action === 'closed') {
        try {
            let closeMilestone = await query('UPDATE milestones SET state=$1 WHERE id=$2', [
                'closed',
                payload.milestone.id,
            ])
            res.status(200)
            return
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'server error' })
        }
    }
    if (payload.action === 'deleted') {
        try {
            let deleteMilestone = await query('DELETE FROM milestones WHERE id=$1', [payload.milestone.id])
            res.status(200)
            return
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'server error' })
        }
    }

    console.log('-----[milestone webhook]------')
}
