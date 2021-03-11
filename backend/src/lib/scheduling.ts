import { request } from '@octokit/request'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import dayjs, { Dayjs } from 'dayjs'
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)
import { query } from '../db'

export async function ScheduleUserDay(
    schedulingTime: dayjs.Dayjs,
    daysTasks: any[],
    tasksToSchedule: any[],
    user_id: number
) {
    let endOfDay = dayjs(`${schedulingTime.format('YYYY-MM-DD')} 18:00:00`, 'YYYY-MM-DD HH:mm:ss')
    while (schedulingTime.isBefore(endOfDay) || schedulingTime.isSame(endOfDay)) {
        //Check if theres a task scheduled now
        while (true) {
            if (tasksToSchedule.length == 0) {
                console.log('nothing left to schedule')
                return tasksToSchedule
            }

            if (Number(schedulingTime.hour()) >= 17 && Number(schedulingTime.minute()) > 0) {
                //No time left in the day to schedule any more tasks
                console.log('no time left for day')
                return tasksToSchedule
            }

            //If a task is scheduled at this time jump to the end
            if (daysTasks.length > 0) {
                let splitStart = daysTasks[0].start_time.split(':')
                let splitEnd = daysTasks[0].end_time.split(':')
                let startTime = dayjs(daysTasks[0].day)
                    .hour(splitStart[0])
                    .minute(splitStart[1])
                    .second(splitStart[2])
                    .millisecond(0)
                let endTime = dayjs(daysTasks[0].day)
                    .hour(splitEnd[0])
                    .minute(splitEnd[1])
                    .second(splitEnd[2])
                    .millisecond(0)
                if (schedulingTime.isBetween(startTime, endTime, null, '[)')) {
                    console.log(`same as another task: ${schedulingTime.format('YYYY-MM-DD HH:mm:ss')}`)
                    //Task already scheduled here, lets jump to the end of this task
                    schedulingTime = schedulingTime
                        .hour(endTime.hour())
                        .minute(endTime.minute())
                        .second(endTime.second())
                        .millisecond(endTime.millisecond())
                    daysTasks = daysTasks.filter((innerTask, index) => innerTask.id !== daysTasks[0].id)
                    console.log(`jumped to: ${schedulingTime.format('YYYY-MM-DD HH:mm:ss')}`)
                }
            }

            if (daysTasks.length > 0) {
                let timeUntilNextTask = dayjs(daysTasks[0].day)
                    .hour(daysTasks[0].start_time.split(':')[0])
                    .minute(daysTasks[0].start_time.split(':')[1])
                    .second(daysTasks[0].start_time.split(':')[2])
                    .millisecond(0)
                    .diff(schedulingTime, 'hour', true)

                if (timeUntilNextTask < 1) {
                    console.log('no time to schedule here')
                    //Jump to the next task so we can start scheduling again
                    schedulingTime = dayjs(daysTasks[0].day)
                        .hour(daysTasks[0].start_time.split(':')[0])
                        .minute(daysTasks[0].start_time.split(':')[1])
                        .second(daysTasks[0].start_time.split(':')[2])
                        .millisecond(0)
                    console.log(`jumping to: ${schedulingTime.format('YYYY-MM-DD HH:mm:ss')}`)
                    continue
                } else {
                    if (Number(schedulingTime.hour()) >= 17 && Number(schedulingTime.minute()) > 0) {
                        //No time left in the day to schedule any more tasks
                        console.log('no time left for day')
                        return tasksToSchedule
                    }
                    //Schedule a task in this period
                    console.log(`amount left to schedule: ${tasksToSchedule.length}`)
                    let schedulingIssue = tasksToSchedule[0]

                    //Find how long to schedule for (from the task description)
                    let lengthMinutes = 60
                    if (
                        !isNaN(Number(schedulingIssue.description.split('time:').pop().split('m')[0])) &&
                        schedulingIssue.description.includes('time:')
                    ) {
                        lengthMinutes = Number(schedulingIssue.description.split('time:').pop().split('m')[0])
                    }
                    if (timeUntilNextTask * 60 < lengthMinutes) {
                        console.log('no time to schedule here')
                        //Jump to the next task so we can start scheduling again
                        schedulingTime = dayjs(daysTasks[0].day)
                            .hour(daysTasks[0].start_time.split(':')[0])
                            .minute(daysTasks[0].start_time.split(':')[1])
                            .second(daysTasks[0].start_time.split(':')[2])
                            .millisecond(0)
                        console.log(`jumping to: ${schedulingTime.format('YYYY-MM-DD HH:mm:ss')}`)
                        continue
                    }

                    console.log(lengthMinutes)
                    let insertNewTask = await query(
                        'INSERT INTO tasks (title, description, day, start_time, end_time, calendar_id, type, issue_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
                        [
                            schedulingIssue.title,
                            schedulingIssue.description,
                            schedulingTime.format('YYYY-MM-DD'),
                            `${schedulingTime.hour()}:${schedulingTime.minute()}:00`,
                            `${schedulingTime.add(lengthMinutes / 60, 'hour').hour()}:${schedulingTime
                                .add(lengthMinutes / 60, 'hour')
                                .minute()}:00`,
                            user_id,
                            'github',
                            schedulingIssue.id,
                        ]
                    )
                    schedulingTime = schedulingTime.add(lengthMinutes / 60, 'hour')
                    tasksToSchedule = tasksToSchedule.filter((taskSched, index) => taskSched.id !== schedulingIssue.id)
                    console.log('-------------')
                }
            } else {
                if (Number(schedulingTime.hour()) >= 17 && Number(schedulingTime.minute()) > 0) {
                    //No time left in the day to schedule any more tasks
                    console.log('no time left for day')
                    return tasksToSchedule
                }
                //Schedule a task in this period
                console.log(`amount left to schedule: ${tasksToSchedule.length}`)
                let schedulingIssue = tasksToSchedule[0]
                let lengthMinutes = 60
                if (
                    !isNaN(Number(schedulingIssue.description.split('time:').pop().split('m')[0])) &&
                    schedulingIssue.description.includes('time:')
                ) {
                    lengthMinutes = Number(schedulingIssue.description.split('time:').pop().split('m')[0])
                }
                console.log(lengthMinutes)
                let insertNewTask = await query(
                    'INSERT INTO tasks (title, description, day, start_time, end_time, calendar_id, type, issue_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
                    [
                        schedulingIssue.title,
                        schedulingIssue.description,
                        schedulingTime.format('YYYY-MM-DD'),
                        `${schedulingTime.hour()}:${schedulingTime.minute()}:00`,
                        `${schedulingTime.add(lengthMinutes / 60, 'hour').hour()}:${schedulingTime
                            .add(lengthMinutes / 60, 'hour')
                            .minute()}:00`,
                        user_id,
                        'github',
                        schedulingIssue.id,
                    ]
                )
                schedulingTime = schedulingTime.add(lengthMinutes / 60, 'hour')
                tasksToSchedule = tasksToSchedule.filter((taskSched, index) => taskSched.id !== schedulingIssue.id)
                console.log('-------------')
            }
        }
    }
    console.log('escaping here')
    return tasksToSchedule
}

export async function ScheduleTeamDay(
    schedulingTime: dayjs.Dayjs,
    daysTasks: any[],
    tasksToSchedule: any[],
    team_id: number
) {
    let endOfDay = dayjs(`${schedulingTime.format('YYYY-MM-DD')} 18:00:00`, 'YYYY-MM-DD HH:mm:ss')
    while (schedulingTime.isBefore(endOfDay) || schedulingTime.isSame(endOfDay)) {
        //Check if theres a task scheduled now
        while (true) {
            if (tasksToSchedule.length == 0) {
                console.log('nothing left to schedule')
                return tasksToSchedule
            }

            if (Number(schedulingTime.hour()) >= 17 && Number(schedulingTime.minute()) > 0) {
                //No time left in the day to schedule any more tasks
                console.log('no time left for day')
                return tasksToSchedule
            }

            //If a task is scheduled at this time jump to the end
            if (daysTasks.length > 0) {
                let splitStart = daysTasks[0].start_time.split(':')
                let splitEnd = daysTasks[0].end_time.split(':')
                let startTime = dayjs(daysTasks[0].day)
                    .hour(splitStart[0])
                    .minute(splitStart[1])
                    .second(splitStart[2])
                    .millisecond(0)
                let endTime = dayjs(daysTasks[0].day)
                    .hour(splitEnd[0])
                    .minute(splitEnd[1])
                    .second(splitEnd[2])
                    .millisecond(0)
                if (schedulingTime.isBetween(startTime, endTime, null, '[)')) {
                    console.log(`same as another task: ${schedulingTime.format('YYYY-MM-DD HH:mm:ss')}`)
                    //Task already scheduled here, lets jump to the end of this task
                    schedulingTime = schedulingTime
                        .hour(endTime.hour())
                        .minute(endTime.minute())
                        .second(endTime.second())
                        .millisecond(endTime.millisecond())
                    daysTasks = daysTasks.filter((innerTask, index) => innerTask.id !== daysTasks[0].id)
                    console.log(`jumped to: ${schedulingTime.format('YYYY-MM-DD HH:mm:ss')}`)
                }
            }

            if (daysTasks.length > 0) {
                let timeUntilNextTask = dayjs(daysTasks[0].day)
                    .hour(daysTasks[0].start_time.split(':')[0])
                    .minute(daysTasks[0].start_time.split(':')[1])
                    .second(daysTasks[0].start_time.split(':')[2])
                    .millisecond(0)
                    .diff(schedulingTime, 'hour', true)

                if (timeUntilNextTask < 1) {
                    console.log('no time to schedule here')
                    //Jump to the next task so we can start scheduling again
                    schedulingTime = dayjs(daysTasks[0].day)
                        .hour(daysTasks[0].start_time.split(':')[0])
                        .minute(daysTasks[0].start_time.split(':')[1])
                        .second(daysTasks[0].start_time.split(':')[2])
                        .millisecond(0)
                    console.log(`jumping to: ${schedulingTime.format('YYYY-MM-DD HH:mm:ss')}`)
                    continue
                } else {
                    if (Number(schedulingTime.hour()) >= 17 && Number(schedulingTime.minute()) > 0) {
                        //No time left in the day to schedule any more tasks
                        console.log('no time left for day')
                        return tasksToSchedule
                    }
                    //Schedule a task in this period
                    console.log(`amount left to schedule: ${tasksToSchedule.length}`)
                    let schedulingIssue = tasksToSchedule[0]

                    //Find how long to schedule for (from the task description)
                    let lengthMinutes = 60
                    if (
                        !isNaN(Number(schedulingIssue.description.split('time:').pop().split('m')[0])) &&
                        schedulingIssue.description.includes('time:')
                    ) {
                        lengthMinutes = Number(schedulingIssue.description.split('time:').pop().split('m')[0])
                    }

                    if (timeUntilNextTask * 60 < lengthMinutes) {
                        console.log('no time to schedule here')
                        //Jump to the next task so we can start scheduling again
                        schedulingTime = dayjs(daysTasks[0].day)
                            .hour(daysTasks[0].start_time.split(':')[0])
                            .minute(daysTasks[0].start_time.split(':')[1])
                            .second(daysTasks[0].start_time.split(':')[2])
                            .millisecond(0)
                        console.log(`jumping to: ${schedulingTime.format('YYYY-MM-DD HH:mm:ss')}`)
                        continue
                    }

                    console.log(lengthMinutes)
                    let insertNewTask = await query(
                        'INSERT INTO team_tasks (title, description, day, start_time, end_time, calendar_id, type, issue_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
                        [
                            schedulingIssue.title,
                            schedulingIssue.description,
                            schedulingTime.format('YYYY-MM-DD'),
                            `${schedulingTime.hour()}:${schedulingTime.minute()}:00`,
                            `${schedulingTime.add(lengthMinutes / 60, 'hour').hour()}:${schedulingTime
                                .add(lengthMinutes / 60, 'hour')
                                .minute()}:00`,
                            team_id,
                            'github',
                            schedulingIssue.id,
                        ]
                    )
                    schedulingTime = schedulingTime.add(lengthMinutes / 60, 'hour')
                    tasksToSchedule = tasksToSchedule.filter((taskSched, index) => taskSched.id !== schedulingIssue.id)
                    console.log('-------------')
                }
            } else {
                if (Number(schedulingTime.hour()) >= 17 && Number(schedulingTime.minute()) > 0) {
                    //No time left in the day to schedule any more tasks
                    console.log('no time left for day')
                    return tasksToSchedule
                }
                //Schedule a task in this period
                console.log(`amount left to schedule: ${tasksToSchedule.length}`)
                let schedulingIssue = tasksToSchedule[0]
                let lengthMinutes = 60
                if (
                    !isNaN(Number(schedulingIssue.description.split('time:').pop().split('m')[0])) &&
                    schedulingIssue.description.includes('time:')
                ) {
                    lengthMinutes = Number(schedulingIssue.description.split('time:').pop().split('m')[0])
                }
                console.log(lengthMinutes)
                let insertNewTask = await query(
                    'INSERT INTO team_tasks (title, description, day, start_time, end_time, calendar_id, type, issue_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
                    [
                        schedulingIssue.title,
                        schedulingIssue.description,
                        schedulingTime.format('YYYY-MM-DD'),
                        `${schedulingTime.hour()}:${schedulingTime.minute()}:00`,
                        `${schedulingTime.add(lengthMinutes / 60, 'hour').hour()}:${schedulingTime
                            .add(lengthMinutes / 60, 'hour')
                            .minute()}:00`,
                        team_id,
                        'github',
                        schedulingIssue.id,
                    ]
                )
                schedulingTime = schedulingTime.add(lengthMinutes / 60, 'hour')
                tasksToSchedule = tasksToSchedule.filter((taskSched, index) => taskSched.id !== schedulingIssue.id)
                console.log('-------------')
            }
        }
    }
    console.log('escaping here')
    return tasksToSchedule
}

export async function ScheduleUserCalendar(user_id: number) {
    //Get all issues ordered by milestone which the user is assigned to

    console.log('STARTING SCHEDULE')
    let currentTime = dayjs()
    let now = dayjs()
    try {
        let infoToSchedule = await query(
            'SELECT issues.id, issues.title, issues.description, issues.assigned_users, m.due_date, cardinality(assigned_users) as assigned_count FROM issues INNER JOIN user_repos ur on issues.repo_id = ur.repo_id LEFT JOIN milestones m on m.id = issues.milestone_id INNER JOIN users u on ur.user_id = u.id WHERE ur.user_id=$1 AND u.github_id= ANY(assigned_users) AND issues.id NOT IN (SELECT issue_id FROM tasks WHERE calendar_id=$2 AND issue_id IS NOT NULL) ORDER BY due_date, assigned_count DESC, updated_at',
            [user_id, user_id]
        )

        let issuesToSchedule = infoToSchedule.rows

        while (true) {
            let issuesLeft = issuesToSchedule
            //When to start scheduling (for today or tomorrow if the day has already ended)
            if (currentTime.isAfter(dayjs().hour(18).minute(0).second(0))) {
                //Start scheduling tomorrow (the day has already ended)
                console.log('scheduling tomorrow because today has ended')
                now = now.add(1, 'day').hour(9).minute(0).second(0).millisecond(0)
            }

            //Get the tasks for the day being scheduled
            let scheduledPersonalTasksForToday = await query(
                'SELECT * FROM tasks WHERE calendar_id=$1 AND day=$2 ORDER BY day, start_time',
                [user_id, now.format('YYYY-MM-DD')]
            )

            // console.log(`Scheduling for ${now.format('YYYY-MM-DD')}`)
            // console.log('Scheduling issues:')
            // console.log(issuesLeft)
            // console.log('Scheduling around tasks:')
            console.log(scheduledPersonalTasksForToday.rows)
            let remainingIssues = await ScheduleUserDay(now, scheduledPersonalTasksForToday.rows, issuesLeft, user_id)
            // console.log('Remaining issues:')
            // console.log(remainingIssues)
            if (issuesToSchedule.length === 0) {
                console.log('breaking')
                console.log('ENDING SCHEDULE')
                break
            }
            now = now.add(1, 'day').hour(9).minute(0).second(0).millisecond(0)
            issuesToSchedule = remainingIssues
        }
    } catch (error) {
        console.log(error)
        throw new Error(`Error scheduling tasks - ${error}`)
    }
}

export async function ScheduleTeamCalendar(team_id: number) {
    //Get all issues ordered by milestone which the user is assigned to

    console.log('STARTING SCHEDULE')
    let currentTime = dayjs()
    let now = dayjs()
    try {
        let infoToSchedule = await query(
            'SELECT issues.id, issues.title, issues.description, issues.assigned_users, m.due_date, cardinality(assigned_users) as assigned_count FROM issues INNER JOIN team_repos tr on issues.repo_id = tr.repo_id LEFT JOIN milestones m on m.id = issues.milestone_id WHERE tr.team_id=$1 AND issues.id NOT IN (SELECT issue_id FROM team_tasks WHERE calendar_id=$2 AND issue_id IS NOT NULL) ORDER BY due_date, assigned_count DESC, updated_at',
            [team_id, team_id]
        )

        let issuesToSchedule = infoToSchedule.rows

        while (true) {
            let issuesLeft = issuesToSchedule
            //When to start scheduling (for today or tomorrow if the day has already ended)
            if (currentTime.isAfter(dayjs().hour(18).minute(0).second(0))) {
                //Start scheduling tomorrow (the day has already ended)
                console.log('scheduling tomorrow because today has ended')
                now = now.add(1, 'day').hour(9).minute(0).second(0).millisecond(0)
            }

            //Get the tasks for the day being scheduled
            let scheduledPersonalTasksForToday = await query(
                'SELECT * FROM team_tasks WHERE calendar_id=$1 AND day=$2 ORDER BY day, start_time',
                [team_id, now.format('YYYY-MM-DD')]
            )

            // console.log(`Scheduling for ${now.format('YYYY-MM-DD')}`)
            // console.log('Scheduling issues:')
            // console.log(issuesLeft)
            // console.log('Scheduling around tasks:')
            // console.log(scheduledPersonalTasksForToday.rows)
            let remainingIssues = await ScheduleTeamDay(now, scheduledPersonalTasksForToday.rows, issuesLeft, team_id)
            // console.log('Remaining issues:')
            // console.log(remainingIssues)
            if (issuesToSchedule.length === 0) {
                console.log('breaking')
                console.log('ENDING SCHEDULE')
                break
            }
            now = now.add(1, 'day').hour(9).minute(0).second(0).millisecond(0)
            issuesToSchedule = remainingIssues
        }
    } catch (error) {
        console.log(error)
        throw new Error(`Error scheduling tasks - ${error}`)
    }
}
