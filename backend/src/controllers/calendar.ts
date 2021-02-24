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
    checkTaskOverlaps([
        {
            id: 1,
            title: 'testing 1',
            description: 'hello this is a test 1',
            day: dayjs('2021-02-24'),
            startTime: dayjs('2021-02-24 13:00:00', 'YYYY-MM-DD HH:mm:ss'),
            endTime: dayjs('2021-02-24 14:20:00', 'YYYY-MM-DD HH:mm:ss'),
        },
        {
            id: 2,
            title: 'testing 2',
            description: 'this is a second test',
            day: dayjs('2021-02-24'),
            startTime: dayjs('2021-02-24 14:00:00', 'YYYY-MM-DD HH:mm:ss'),
            endTime: dayjs('2021-02-24 14:30:00', 'YYYY-MM-DD HH:mm:ss'),
        },
        {
            id: 3,
            title: 'testing 3',
            description: 'this is a third test',
            day: dayjs('2021-03-24'),
            startTime: dayjs('2021-03-24 14:00:00', 'YYYY-MM-DD HH:mm:ss'),
            endTime: dayjs('2021-03-24 14:30:00', 'YYYY-MM-DD HH:mm:ss'),
        },
    ])
    res.status(200).send({
        hi: [
            {
                id: 1,
                title: 'testing 1',
                description: 'hello this is a test 1',
                day: dayjs('2021-02-24'),
                startTime: dayjs('2021-02-24 13:00:00', 'YYYY-MM-DD HH:mm:ss'),
                endTime: dayjs('2021-02-24 14:20:00', 'YYYY-MM-DD HH:mm:ss'),
            },
            {
                id: 2,
                title: 'testing 2',
                description: 'this is a second test',
                day: dayjs('2021-02-24'),
                startTime: dayjs('2021-02-24 14:00:00', 'YYYY-MM-DD HH:mm:ss'),
                endTime: dayjs('2021-02-24 14:30:00', 'YYYY-MM-DD HH:mm:ss'),
            },
            {
                id: 3,
                title: 'testing 3',
                description: 'this is a third test',
                day: dayjs('2021-03-24'),
                startTime: dayjs('2021-03-24 14:00:00', 'YYYY-MM-DD HH:mm:ss'),
                endTime: dayjs('2021-03-24 14:30:00', 'YYYY-MM-DD HH:mm:ss'),
            },
        ][0].endTime.hour(),
    })
}

export const GetUserTasksForDay = async (req: Request, res: Response) => {
    const day = req.params.day
    const user = res.locals.user_id

    console.log(day)
    try {
        let daysTasks = await query(
            'SELECT title, description, start_time, end_time FROM tasks INNER JOIN user_calendars uc on tasks.calendar_id = uc.id INNER JOIN users u on uc.user_id = u.id WHERE day = $1 AND u.id = $2 ORDER BY start_time',
            [day, user]
        )
        res.status(200).send({ day, start: 9, end: 18, tasks: daysTasks.rows })
    } catch (error) {
        res.status(500).send({ error })
    }
}
