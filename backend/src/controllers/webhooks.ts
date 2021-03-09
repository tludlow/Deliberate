import { Request, Response } from 'express'
import { SetupRepoHooks } from '../lib/webhooks'
import { query } from '../db'

export const GithubIssueWebhook = async (req: Request, res: Response) => {
    //Get the current data as a request and then register a webhook for this
    const payload = JSON.parse(req.body.payload)
    const event_type = req.headers['x-github-event']

    if (payload.action === 'opened') {
        try {
            let assignedUsers: number[] = []
            payload.issue.assignees.forEach((user: any) => {
                assignedUsers.push(user.id)
            })
            let labels: string[] = []
            payload.issue.labels.forEach((label: any) => {
                labels.push(label.name)
            })
            let insertIssue = await query(
                'INSERT INTO issues (id, repo_id, title, description, assigned_users, milestone_id, labels) VALUES($1, $2, $3, $4, $5, $6, $7)',
                [
                    payload.issue.id,
                    payload.repository.id,
                    payload.issue.title,
                    payload.issue.body,
                    `{${assignedUsers.join(',')}}`,
                    payload.issue.milestone?.id,
                    `{${labels.join(',')}}`,
                ]
            )
            console.log(insertIssue)
            res.status(200).send({ data: req.body })
            return
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: error })
        }
    }
    if (payload.action === 'deleted') {
        try {
            let deleteIssue = await query('DELETE FROM issues WHERE id=$1', [payload.issue.id])
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: error })
        }
    }
    if (payload.action === 'assigned' || payload.action === 'unassigned') {
        let assignedUsers: number[] = []
        payload.issue.assignees.forEach((user: any) => {
            assignedUsers.push(user.id)
        })
        try {
            let changeAssignedUsers = await query('UPDATE issues SET assigned_users=$1 WHERE id=$2', [
                `{${assignedUsers.join(',')}}`,
                payload.issue.id,
            ])
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: error })
        }
    }
    if (payload.action === 'labeled' || payload.action === 'unlabeled') {
        let labels: string[] = []
        payload.issue.labels.forEach((label: any) => {
            labels.push(label.name)
        })
        try {
            let changeLabels = await query('UPDATE issues SET labels=$1 WHERE id=$2', [
                `{${labels.join(',')}}`,
                payload.issue.id,
            ])
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: error })
        }
    }
    if (payload.action === 'milestoned' || payload.action === 'demilestoned') {
        try {
            let changeIssueMilestone = await query('UPDATE issues SET milestone_id=$1 WHERE id=$2', [
                payload.issue.milestone?.id,
                payload.issue.id,
            ])
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: error })
        }
    }
    if (payload.action === 'reopened') {
        try {
            let reOpenIssue = await query('UPDATE issues SET state=$1 WHERE id=$2', ['open', payload.issue.id])
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: error })
        }
    }
    if (payload.action === 'closed') {
        try {
            let closedIssue = await query('UPDATE issues SET state=$1 WHERE id=$2', ['closed', payload.issue.id])
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: error })
        }
    }
    if (payload.action === 'edited') {
        try {
            let editedIssue = await query('UPDATE issues SET title=$1, description=$2) WHERE id=$3', [
                payload.issue.id,
                payload.issue.title,
                payload.issue.body,
            ])
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: error })
        }
    }
    // console.log(payload)
    // console.log('-----[issues webhook]------')
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
            res.status(200).send({ data: req.body })
            return
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'server error' })
        }
    }
    if (payload.action === 'created') {
        try {
            let createMilestone = await query(
                'INSERT INTO milestones (id, title, description, due_date, state, repo_id) VALUES ($1, $2, $3, $4, $5, $6)',
                [
                    payload.milestone.id,
                    payload.milestone.title,
                    payload.milestone.description,
                    payload.milestone.due_on,
                    payload.milestone.state,
                    payload.repository.id,
                ]
            )
            res.status(200).send({ data: req.body })
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
            res.status(200).send({ data: req.body })
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
            res.status(200).send({ data: req.body })
            return
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'server error' })
        }
    }
    if (payload.action === 'deleted') {
        try {
            let deleteMilestone = await query('DELETE FROM milestones WHERE id=$1', [payload.milestone.id])
            res.status(200).send({ data: req.body })
            return
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'server error' })
        }
    }

    // console.log('-----[milestone webhook]------')
    res.status(200).send({ data: req.body })
}

export const RegisterRepoWebhooks = async (req: Request, res: Response) => {
    const { owner, repo } = req.params
    const { github_token, user_id, github_id } = res.locals

    if (!github_token) {
        res.status(500).send({ message: 'No github token provided' })
        return
    }
    let repoID = await SetupRepoHooks(github_token, owner, repo)
    if (repoID != -1) {
        let isTrackedAlready = await query('SELECT count(*) as exists FROM tracked_repos WHERE repo_id=$1', [repoID])
        if (isTrackedAlready.rows[0].exists === '0') {
            let addToTrackedRepos = await query(
                'INSERT INTO tracked_repos (repo_id, name, owner, owner_id) VALUES ($1, $2, $3, $4)',
                [repoID, repo, owner, github_id]
            )
        }
        let isUserAdded = await query('SELECT count(*) as added FROM user_repos WHERE user_id=$1 AND repo_id=$2', [
            user_id,
            repoID,
        ])
        if (isUserAdded.rows[0].added === '0') {
            let addToTrackedRepos = await query('INSERT INTO user_repos (user_id, repo_id) VALUES ($1, $2)', [
                user_id,
                repoID,
            ])
        }
    } else {
        res.status(500).send({ message: 'Error setting up repo webhooks, delete all the webhooks and try again!' })
        return
    }

    res.status(200).send({ params: req.params, repo_id: repoID })
}
