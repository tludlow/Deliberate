import { AxiosResponse } from 'axios'
import { checkTaskOverlaps } from './../lib/dates'
import { Request, Response } from 'express'
import { request } from '@octokit/request'
import dayjs, { Dayjs } from 'dayjs'
import { query } from '../db'
import { ScheduleUserCalendar, ScheduleTeamCalendar } from '../lib/scheduling'

export const UserCalendar = async (req: Request, res: Response) => {
    console.log(res.locals)
    const requestWithAuth = request.defaults({
        headers: {
            authorization: `token ${res.locals.github_token}`,
        },
    })
    const { data } = await requestWithAuth('GET /issues')

    // const octokit = new Octokit({ auth: `54c80d432331eb78265a3a945173fe9d1a31b36b` })

    // const response = await octokit.request('GET /issues')
    // console.log(response)

    res.status(200).send({ data })
}

export const UserCalendarInfo = async (req: Request, res: Response) => {
    const { user_id, github_token } = res.locals

    const requestWithAuth = request.defaults({
        headers: {
            authorization: `token ${github_token}`,
        },
    })

    interface MilestoneCompletePercent {
        milestone_id: number
        percentage: number
    }
    let percentMilestones: MilestoneCompletePercent[] = []
    let milestoneData: any[] = []
    try {
        let reposToFetch = await query(
            'SELECT owner, name FROM user_repos INNER JOIN tracked_repos tr ON tr.repo_id = user_repos.repo_id WHERE user_id=$1',
            [user_id]
        )

        for (let row of reposToFetch.rows) {
            const { data } = await requestWithAuth(`GET /repos/${row.owner}/${row.name}/milestones?sort=due_on`)
            if (data.length === 0) {
                continue
            }
            for (let milestone of data) {
                percentMilestones.push({
                    milestone_id: milestone.id,
                    percentage: 100 - (milestone.open_issues / (milestone.open_issues + milestone.closed_issues)) * 100,
                })
            }
        }

        let milestonesForUser = await query(
            'SELECT milestones.id, title, description, due_date, state FROM milestones INNER JOIN user_repos ur on milestones.repo_id = ur.repo_id INNER JOIN users u on ur.user_id = u.id WHERE user_id=$1 ORDER BY due_date',
            [user_id]
        )

        milestonesForUser.rows.forEach((milestone, i) => {
            let percentage = percentMilestones[i].percentage
            milestoneData.push({ percentage, ...milestone })
        })
    } catch (error) {
        res.status(500).send({ message: error })
    }
    res.status(200).send({ milestoneData })
}

export const AddTaskToCalendar = async (req: Request, res: Response) => {
    const { title, description, day, start_time, end_time } = req.body
    const { user_id } = res.locals

    //Check that the task is not overlapping with another
    //Get the tasks for the day
    try {
        let daysTasks = await query(
            'SELECT title, description, start_time, end_time FROM tasks INNER JOIN user_calendars uc on tasks.calendar_id = uc.id INNER JOIN users u on uc.user_id = u.id WHERE day = $1 AND u.id = $2 ORDER BY start_time',
            [day, user_id]
        )
        let appendedTasks: any = []
        daysTasks.rows.forEach((task) => {
            appendedTasks.push({
                title: task.title,
                description: task.description,
                day: dayjs(task.day),
                start_time: dayjs(`${day} ${task.start_time}`, 'YYYY-MM-DD HH:mm:ss'),
                end_time: dayjs(`${day} ${task.end_time}`, 'YYYY-MM-DD HH:mm:ss'),
            })
        })

        appendedTasks.push({
            title: title,
            description: description,
            day: dayjs(day),
            start_time: dayjs(`${day} ${start_time}`, 'YYYY-MM-DD HH:mm:ss'),
            end_time: dayjs(`${day} ${end_time}`, 'YYYY-MM-DD HH:mm:ss'),
        })

        if (checkTaskOverlaps(appendedTasks)) {
            res.status(400).send({ message: 'Task overlaps with another task within this calendar on this day' })
            return
        }

        let addTask = await query(
            'INSERT INTO tasks(title, description, day, start_time, end_time, calendar_id) VALUES($1, $2, $3, $4, $5, $6)',
            [title, description, day, start_time, end_time, user_id]
        )

        console.log(addTask)

        res.status(200).send({ day, start: 9, end: 18, tasks: appendedTasks })
    } catch (error) {
        console.log(error)
        res.status(500).send({ error })
    }
}

export const EditTask = async (req: Request, res: Response) => {
    const { id, title, description, day, start_time, end_time } = req.body
    const { user_id } = res.locals

    //Check that the task is not overlapping with another
    //Get the tasks for the day
    try {
        let check = await query('SELECT calendar_id FROM tasks WHERE id=$1', [id])
        if (check.rowCount > 0 && check.rows[0].calendar_id !== user_id) {
            res.status(400).send({ message: "You don't own this task" })
        }

        let daysTasks = await query(
            'SELECT tasks.id, title, description, start_time, end_time FROM tasks INNER JOIN user_calendars uc on tasks.calendar_id = uc.id INNER JOIN users u on uc.user_id = u.id WHERE day = $1 AND u.id = $2 AND tasks.id != $3 ORDER BY start_time',
            [day, user_id, id]
        )

        let appendedTasks: any = []
        daysTasks.rows.forEach((task) => {
            appendedTasks.push({
                id: task.id,
                title: task.title,
                description: task.description,
                day: dayjs(task.day),
                start_time: dayjs(`${day} ${task.start_time}`, 'YYYY-MM-DD HH:mm:ss'),
                end_time: dayjs(`${day} ${task.end_time}`, 'YYYY-MM-DD HH:mm:ss'),
            })
        })

        appendedTasks.push({
            id: id,
            title: title,
            description: description,
            day: dayjs(day),
            start_time: dayjs(`${day} ${start_time}`, 'YYYY-MM-DD HH:mm:ss'),
            end_time: dayjs(`${day} ${end_time}`, 'YYYY-MM-DD HH:mm:ss'),
        })

        if (checkTaskOverlaps(appendedTasks)) {
            res.status(400).send({ message: 'Task overlaps with another task within this calendar on this day' })
            return
        }
        let deleteTask = await query(
            'UPDATE tasks SET title=$1, description=$2, day=$3, start_time=$4, end_time=$5 WHERE id=$6',
            [title, description, day, start_time, end_time, id]
        )
        res.status(200).send({
            title,
            description,
            day,
            start_time,
            end_time,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Error occured deleting the task' })
    }
}

export const GetUserTasksForDay = async (req: Request, res: Response) => {
    const day = req.params.day
    const user = res.locals.user_id
    try {
        let daysTasks = await query(
            'SELECT tasks.id, tasks.title, tasks.description, start_time, end_time, type, milestone_id FROM tasks INNER JOIN user_calendars uc on tasks.calendar_id = uc.id INNER JOIN users u on uc.user_id = u.id LEFT JOIN issues iss ON tasks.issue_id = iss.id LEFT JOIN milestones m on iss.milestone_id = m.id WHERE day = $1 AND u.id = $2 ORDER BY start_time',
            [day, user]
        )
        res.status(200).send({ day, start: 9, end: 18, tasks: daysTasks.rows })
    } catch (error) {
        res.status(500).send({ error })
    }
}

export const DeleteTaskByID = async (req: Request, res: Response) => {
    //Check that the user is the owner of this task
    const { user_id } = res.locals
    const { task_id } = req.body

    console.log(req.body)

    try {
        let check = await query('SELECT calendar_id FROM tasks WHERE id=$1', [task_id])
        console.log(check.rows)
        if (check.rowCount > 0 && check.rows[0].calendar_id !== user_id) {
            res.status(400).send({ message: "You don't own this task" })
        }

        let deleteTask = await query('DELETE FROM tasks WHERE id=$1', [task_id])
        res.status(200).send({ ok: true })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Error occured deleting the task' })
    }
}

export const LoadFuture = async (req: Request, res: Response) => {
    const { user_id } = res.locals

    let day = dayjs(req.params.day)
    let futureDay = []
    day = day.add(1, 'day')
    for (let i = 0; i <= 14; i++) {
        futureDay.push(day.add(i, 'day').format('YYYY-MM-DD'))
    }

    let response = []

    try {
        for (let getDay of futureDay) {
            let daysTasks = await query(
                'SELECT tasks.id, tasks.title, tasks.description, start_time, end_time, type, milestone_id FROM tasks INNER JOIN user_calendars uc on tasks.calendar_id = uc.id INNER JOIN users u on uc.user_id = u.id LEFT JOIN issues iss ON tasks.issue_id = iss.id LEFT JOIN milestones m on iss.milestone_id = m.id WHERE day = $1 AND u.id = $2 ORDER BY start_time',
                [getDay, user_id]
            )
            response.push({ day: getDay, start: 9, end: 18, tasks: daysTasks.rows })
        }
        res.status(200).send({ calendarData: response })
    } catch (error) {
        res.status(500).send({ error })
    }
}

export const LoadPast = async (req: Request, res: Response) => {
    const { user_id } = res.locals

    let day = dayjs(req.params.day)
    let futureDay = []
    day = day.subtract(1, 'day')
    for (let i = 0; i <= 14; i++) {
        futureDay.push(day.subtract(i, 'day').format('YYYY-MM-DD'))
    }

    let response = []

    try {
        for (let getDay of futureDay) {
            let daysTasks = await query(
                'SELECT tasks.id, tasks.title, tasks.description, start_time, end_time, type, milestone_id FROM tasks INNER JOIN user_calendars uc on tasks.calendar_id = uc.id INNER JOIN users u on uc.user_id = u.id LEFT JOIN issues iss ON tasks.issue_id = iss.id LEFT JOIN milestones m on iss.milestone_id = m.id WHERE day = $1 AND u.id = $2 ORDER BY start_time',
                [getDay, user_id]
            )
            response.push({ day: getDay, start: 9, end: 18, tasks: daysTasks.rows })
        }
        res.status(200).send({ calendarData: response })
    } catch (error) {
        res.status(500).send({ error })
    }
}

export const ScheduleUserTasks = async (req: Request, res: Response) => {
    const { user_id } = res.locals
    try {
        let scheduledData = await ScheduleUserCalendar(user_id)
        res.status(200).send({ scheduledData })
    } catch (error) {
        res.status(500).send({ message: error })
    }
}

/**
 *  Team endpoints
 */

export const TeamLoadFuture = async (req: Request, res: Response) => {
    const { user_id } = res.locals
    const { team_id } = res.locals

    let day = dayjs(req.params.day)
    let futureDay = []
    day = day.add(1, 'day')
    for (let i = 0; i <= 14; i++) {
        futureDay.push(day.add(i, 'day').format('YYYY-MM-DD'))
    }

    let response = []

    try {
        for (let getDay of futureDay) {
            let daysTasks = await query(
                'SELECT team_tasks.id, team_tasks.title, team_tasks.description, start_time, end_time, type, milestone_id FROM team_tasks INNER JOIN team_calendars tc on team_tasks.calendar_id = tc.id INNER JOIN teams t on tc.team_id = t.id LEFT JOIN issues i on team_tasks.issue_id = i.id LEFT JOIN milestones m on i.milestone_id = m.id WHERE day=$1 AND t.id=$2 ORDER BY start_time',
                [getDay, team_id]
            )
            response.push({ day: getDay, start: 9, end: 18, tasks: daysTasks.rows })
        }
        res.status(200).send({ calendarData: response })
    } catch (error) {
        res.status(500).send({ error })
    }
}

export const TeamLoadPast = async (req: Request, res: Response) => {
    const { user_id } = res.locals
    const { team_id } = res.locals

    let day = dayjs(req.params.day)
    let futureDay = []
    day = day.subtract(1, 'day')
    for (let i = 0; i <= 14; i++) {
        futureDay.push(day.subtract(i, 'day').format('YYYY-MM-DD'))
    }

    let response = []

    try {
        for (let getDay of futureDay) {
            let daysTasks = await query(
                'SELECT team_tasks.id, team_tasks.title, team_tasks.description, start_time, end_time, type, milestone_id FROM team_tasks INNER JOIN team_calendars tc on team_tasks.calendar_id = tc.id INNER JOIN teams t on tc.team_id = t.id LEFT JOIN issues i on team_tasks.issue_id = i.id LEFT JOIN milestones m on i.milestone_id = m.id WHERE day=$1 AND t.id=$2 ORDER BY start_time',
                [getDay, team_id]
            )
            response.push({ day: getDay, start: 9, end: 18, tasks: daysTasks.rows })
        }
        res.status(200).send({ calendarData: response })
    } catch (error) {
        res.status(500).send({ error })
    }
}

export const GetTeamTasksForDay = async (req: Request, res: Response) => {
    const day = req.params.day
    const user = res.locals.user_id
    const { team_id } = res.locals
    try {
        let daysTasks = await query(
            'SELECT team_tasks.id, team_tasks.title, team_tasks.description, start_time, end_time, type, milestone_id FROM team_tasks INNER JOIN team_calendars tc on team_tasks.calendar_id = tc.id INNER JOIN teams t on tc.team_id = t.id LEFT JOIN issues i on team_tasks.issue_id = i.id LEFT JOIN milestones m on i.milestone_id = m.id WHERE day=$1 AND t.id=$2 ORDER BY start_time',
            [day, team_id]
        )
        res.status(200).send({ day, start: 9, end: 18, tasks: daysTasks.rows })
    } catch (error) {
        console.log(error)
        res.status(500).send({ error })
    }
}

export const AddTeamTaskToCalendar = async (req: Request, res: Response) => {
    const { title, description, day, start_time, end_time } = req.body
    const { user_id } = res.locals
    const { team_id } = res.locals

    //Check that the task is not overlapping with another
    //Get the tasks for the day
    try {
        let daysTasks = await query(
            'SELECT team_tasks.id, title, description, start_time, end_time, type FROM team_tasks INNER JOIN team_calendars tc on team_tasks.calendar_id = tc.id INNER JOIN teams t on tc.team_id = t.id WHERE day = $1 AND t.id = $2 ORDER BY start_time',
            [day, team_id]
        )
        let appendedTasks: any = []
        daysTasks.rows.forEach((task) => {
            appendedTasks.push({
                title: task.title,
                description: task.description,
                day: dayjs(task.day),
                start_time: dayjs(`${day} ${task.start_time}`, 'YYYY-MM-DD HH:mm:ss'),
                end_time: dayjs(`${day} ${task.end_time}`, 'YYYY-MM-DD HH:mm:ss'),
            })
        })

        appendedTasks.push({
            title: title,
            description: description,
            day: dayjs(day),
            start_time: dayjs(`${day} ${start_time}`, 'YYYY-MM-DD HH:mm:ss'),
            end_time: dayjs(`${day} ${end_time}`, 'YYYY-MM-DD HH:mm:ss'),
        })

        if (checkTaskOverlaps(appendedTasks)) {
            res.status(400).send({ message: 'Task overlaps with another task within this calendar on this day' })
            return
        }

        let addTask = await query(
            'INSERT INTO team_tasks(title, description, day, start_time, end_time, calendar_id) VALUES($1, $2, $3, $4, $5, $6)',
            [title, description, day, start_time, end_time, team_id]
        )

        console.log(addTask)

        res.status(200).send({ day, start: 9, end: 18, tasks: appendedTasks })
    } catch (error) {
        console.log(error)
        res.status(500).send({ error })
    }
}

export const ScheduleTeamTasks = async (req: Request, res: Response) => {
    const { team_id } = res.locals
    try {
        let scheduledData = await ScheduleTeamCalendar(team_id)
        res.status(200).send({ scheduledData })
    } catch (error) {
        res.status(500).send({ message: error })
    }
}

export const DeleteTeamTaskByID = async (req: Request, res: Response) => {
    //Check that the user is the owner of this task
    const { user_id, team_id } = res.locals
    const { task_id } = req.body

    console.log(req.body)

    try {
        let check = await query('SELECT calendar_id FROM team_tasks WHERE id=$1', [task_id])
        console.log(check.rows)
        if (check.rowCount > 0 && check.rows[0].calendar_id !== team_id) {
            res.status(400).send({ message: "You don't own this task" })
            return
        }

        let deleteTask = await query('DELETE FROM team_tasks WHERE id=$1', [task_id])
        res.status(200).send({ ok: true })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Error occured deleting the task' })
    }
}
export const EditTeamTask = async (req: Request, res: Response) => {
    const { id, title, description, day, start_time, end_time } = req.body
    const { user_id, team_id } = res.locals

    console.log(`${day}  -  ${team_id}   -  ${id}`)

    //Check that the task is not overlapping with another
    //Get the tasks for the day
    try {
        let check = await query('SELECT calendar_id FROM team_tasks WHERE id=$1', [id])
        if (check.rowCount > 0 && check.rows[0].calendar_id !== team_id) {
            res.status(400).send({ message: "You don't own this task" })
        }

        let daysTasks = await query(
            'SELECT team_tasks.id, title, description, start_time, end_time FROM team_tasks INNER JOIN team_calendars tc on team_tasks.calendar_id = tc.id INNER JOIN teams t on tc.team_id = t.id WHERE day = $1 AND t.id = $2 AND team_tasks.id != $3 ORDER BY start_time',
            [day, team_id, id]
        )

        let appendedTasks: any = []
        daysTasks.rows.forEach((task) => {
            appendedTasks.push({
                id: task.id,
                title: task.title,
                description: task.description,
                day: dayjs(task.day),
                start_time: dayjs(`${day} ${task.start_time}`, 'YYYY-MM-DD HH:mm:ss'),
                end_time: dayjs(`${day} ${task.end_time}`, 'YYYY-MM-DD HH:mm:ss'),
            })
        })

        appendedTasks.push({
            id: id,
            title: title,
            description: description,
            day: dayjs(day),
            start_time: dayjs(`${day} ${start_time}`, 'YYYY-MM-DD HH:mm:ss'),
            end_time: dayjs(`${day} ${end_time}`, 'YYYY-MM-DD HH:mm:ss'),
        })

        if (checkTaskOverlaps(appendedTasks)) {
            res.status(400).send({ message: 'Task overlaps with another task within this calendar on this day' })
            return
        }
        let deleteTask = await query(
            'UPDATE team_tasks SET title=$1, description=$2, day=$3, start_time=$4, end_time=$5 WHERE id=$6',
            [title, description, day, start_time, end_time, id]
        )
        res.status(200).send({
            title,
            description,
            day,
            start_time,
            end_time,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Error occured deleting the task' })
    }
}
