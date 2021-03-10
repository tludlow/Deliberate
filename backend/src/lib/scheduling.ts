import { request } from '@octokit/request'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import dayjs, { Dayjs } from 'dayjs'
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)
import { query } from '../db'

export async function ScheduleDay(
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

            //If a task is scheduled at this time jump to the end
            if (daysTasks.length > 0) {
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
                    //Schedule a task in this period
                    console.log(`amount left to schedule: ${tasksToSchedule.length}`)
                    let schedulingIssue = tasksToSchedule[0]
                    let insertNewTask = await query(
                        'INSERT INTO tasks (title, description, day, start_time, end_time, calendar_id, type, issue_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
                        [
                            schedulingIssue.title,
                            schedulingIssue.description,
                            schedulingTime.format('YYYY-MM-DD'),
                            `${schedulingTime.hour()}:${schedulingTime.minute()}:00`,
                            `${schedulingTime.add(1, 'hour').hour()}:${schedulingTime.add(1, 'hour').minute()}:00`,
                            user_id,
                            'github',
                            schedulingIssue.id,
                        ]
                    )
                    schedulingTime = schedulingTime.add(1, 'hour')
                    tasksToSchedule = tasksToSchedule.filter((taskSched, index) => taskSched.id !== schedulingIssue.id)
                    console.log('-------------')
                }
            } else {
                //Schedule a task in this period
                console.log(`amount left to schedule: ${tasksToSchedule.length}`)
                let schedulingIssue = tasksToSchedule[0]
                let insertNewTask = await query(
                    'INSERT INTO tasks (title, description, day, start_time, end_time, calendar_id, type, issue_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
                    [
                        schedulingIssue.title,
                        schedulingIssue.description,
                        schedulingTime.format('YYYY-MM-DD'),
                        `${schedulingTime.hour()}:${schedulingTime.minute()}:00`,
                        `${schedulingTime.add(1, 'hour').hour()}:${schedulingTime.add(1, 'hour').minute()}:00`,
                        user_id,
                        'github',
                        schedulingIssue.id,
                    ]
                )
                schedulingTime = schedulingTime.add(1, 'hour')
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

    try {
        let infoToSchedule = await query(
            'SELECT issues.id, issues.title, issues.description, issues.assigned_users, m.due_date, cardinality(assigned_users) as assigned_count FROM issues INNER JOIN user_repos ur on issues.repo_id = ur.repo_id LEFT JOIN milestones m on m.id = issues.milestone_id WHERE ur.user_id=$1 AND issues.id NOT IN (SELECT issue_id FROM tasks WHERE calendar_id=1 AND issue_id IS NOT NULL) ORDER BY due_date, assigned_count DESC, updated_at',
            [user_id]
        )

        let issuesToSchedule = infoToSchedule.rows

        let now = dayjs()
        while (true) {
            let issuesLeft = issuesToSchedule
            //When to start scheduling (for today or tomorrow if the day has already ended)
            if (now.isAfter(dayjs().hour(18).minute(0).second(0))) {
                //Start scheduling tomorrow (the day has already ended)
                now = now.add(1, 'day').hour(9).minute(0).second(0).millisecond(0)
            }
            if (now.isBefore(dayjs().hour(18).minute(0).second(0))) {
                now = now.hour(9).minute(0).second(0).millisecond(0)
            }

            //Get the tasks for today
            let scheduledPersonalTasksForToday = await query(
                'SELECT * FROM tasks WHERE calendar_id=$1 AND type=$2 AND day=$3 ORDER BY day, start_time',
                [user_id, 'personal', now.format('YYYY-MM-DD')]
            )

            let remainingIssues = await ScheduleDay(now, scheduledPersonalTasksForToday.rows, issuesLeft, user_id)
            if (issuesToSchedule.length === 0) {
                break
            }
            now = now.add(1, 'day').hour(9).minute(0).second(0).millisecond(0)
            console.log(`remaining issues: ${remainingIssues.length}`)
            issuesToSchedule = remainingIssues
        }
    } catch (error) {
        throw new Error(`Error scheduling tasks - ${error}`)
    }

    // try {
    //     let manuallyAddedTasks = await query(
    //         'SELECT * FROM tasks WHERE calendar_id=$1 AND type=$2 ORDER BY day, start_time',
    //         [user_id, 'personal']
    //     )
    //     let milestones = await query(
    //         'SELECT * FROM milestones INNER JOIN user_repos ur on milestones.repo_id = ur.repo_id WHERE user_id=$1 ORDER BY due_date',
    //         [user_id]
    //     )
    //     let assignedTasksOrderedByDueDate = await query(
    //         'SELECT issues.id, issues.title, issues.description, issues.assigned_users, m.due_date, cardinality(assigned_users) as assigned_count FROM issues INNER JOIN user_repos ur on issues.repo_id = ur.repo_id LEFT JOIN milestones m on m.id = issues.milestone_id WHERE ur.user_id=$1 AND issues.id NOT IN (SELECT issue_id FROM tasks WHERE calendar_id=1 AND issue_id IS NOT NULL) ORDER BY due_date, assigned_count DESC, updated_at',
    //         [user_id]
    //     )

    //     let alreadyScheduledTasks = manuallyAddedTasks.rows
    //     let issuesToSchedule = assignedTasksOrderedByDueDate.rows

    //     let tasksLeftToSchedule = assignedTasksOrderedByDueDate.rowCount
    //     let schedulingDay = dayjs()
    //     // schedulingDay.format('YYYY-MM-DD HH:mm:ss')
    //     //Check if the days schedule is still "running"
    //     let activeDay = schedulingDay.isBefore(dayjs().hour(18).minute(0).second(0).millisecond(0))
    //     if (!activeDay) {
    //         schedulingDay = schedulingDay.add(1, 'day')
    //         schedulingDay = schedulingDay.hour(9).minute(0).second(0).millisecond(0)
    //     }

    //     for (let [i, task] of alreadyScheduledTasks.entries()) {
    //         // console.log('------------')
    //         let startTime = dayjs(task.day)
    //             .hour(task.start_time.split(':')[0])
    //             .minute(task.start_time.split(':')[1])
    //             .second(task.start_time.split(':')[2])
    //             .millisecond(0)
    //         let endTime = dayjs(task.day)
    //             .hour(task.end_time.split(':')[0])
    //             .minute(task.end_time.split(':')[1])
    //             .second(task.end_time.split(':')[2])
    //             .millisecond(0)
    //         if (
    //             dayjs(task.day).isSame(schedulingDay, 'day') &&
    //             schedulingDay.isBetween(startTime, endTime, null, '[)')
    //         ) {
    //             //We're at a time where a task is already scheduled, let's go to the end of this task
    //             console.log(`overlap with task: ${task.title}`)
    //             console.log(`removing ${task.title}-(${i}) from tasks list`)
    //             schedulingDay = schedulingDay
    //                 .hour(endTime.hour())
    //                 .minute(endTime.minute())
    //                 .second(endTime.second())
    //                 .millisecond(endTime.millisecond())
    //             alreadyScheduledTasks = alreadyScheduledTasks.filter((innerTask, index) => innerTask.id !== task.id)
    //             continue
    //         }
    //         //How long until the next task? can we fit a task to be scheduled in here?!
    //         let timeUntilNextTask = dayjs(alreadyScheduledTasks[0].day)
    //             .hour(alreadyScheduledTasks[0].start_time.split(':')[0])
    //             .minute(alreadyScheduledTasks[0].start_time.split(':')[1])
    //             .second(alreadyScheduledTasks[0].start_time.split(':')[2])
    //             .millisecond(0)
    //             .diff(schedulingDay, 'hour', true)

    //         for (let j = 0; j < Math.floor(timeUntilNextTask / 1); j++) {
    //             //Schedule the j tasks within this gap for 1 hour each
    //             let schedulingIssue = issuesToSchedule[0]
    //             let insertNewTask = await query(
    //                 'INSERT INTO tasks (title, description, day, start_time, end_time, calendar_id, type, issue_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
    //                 [
    //                     schedulingIssue.title,
    //                     schedulingIssue.description,
    //                     schedulingDay.format('YYYY-MM-DD'),
    //                     `${schedulingDay.hour()}:${schedulingDay.minute()}:00`,
    //                     `${schedulingDay.add(1, 'hour').hour()}:${schedulingDay.add(1, 'hour').minute()}:00`,
    //                     user_id,
    //                     'github',
    //                     schedulingIssue.id,
    //                 ]
    //             )
    //             schedulingDay = schedulingDay.add(1, 'hour')
    //             issuesToSchedule = issuesToSchedule.filter((taskSched, index) => taskSched.id !== schedulingIssue.id)
    //         }
    //     }
    // } catch (error) {
    //     throw new Error('Something bad happened whilst scheduling user tasks - ' + error)
    // }
}
