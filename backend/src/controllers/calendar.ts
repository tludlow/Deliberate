import { AxiosResponse } from 'axios'
import { checkTaskOverlaps } from './../lib/dates'
import { Request, Response } from 'express'
import { request } from '@octokit/request'
import dayjs, { Dayjs } from 'dayjs'
import { query } from '../db'

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

export const GetUserTasksForDay = async (req: Request, res: Response) => {
    const day = req.params.day
    const user = res.locals.user_id

    console.log(day)
    try {
        let daysTasks = await query(
            'SELECT tasks.id, title, description, start_time, end_time FROM tasks INNER JOIN user_calendars uc on tasks.calendar_id = uc.id INNER JOIN users u on uc.user_id = u.id WHERE day = $1 AND u.id = $2 ORDER BY start_time',
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
        if (check.rows[0].calendar_id !== user_id) {
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
                'SELECT tasks.id, title, description, start_time, end_time FROM tasks INNER JOIN user_calendars uc on tasks.calendar_id = uc.id INNER JOIN users u on uc.user_id = u.id WHERE day = $1 AND u.id = $2 ORDER BY start_time',
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
                'SELECT tasks.id, title, description, start_time, end_time FROM tasks INNER JOIN user_calendars uc on tasks.calendar_id = uc.id INNER JOIN users u on uc.user_id = u.id WHERE day = $1 AND u.id = $2 ORDER BY start_time',
                [getDay, user_id]
            )
            response.push({ day: getDay, start: 9, end: 18, tasks: daysTasks.rows })
        }
        res.status(200).send({ calendarData: response })
    } catch (error) {
        res.status(500).send({ error })
    }
}
