import { request } from '@octokit/request'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import dayjs, { Dayjs } from 'dayjs'
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)
import { query } from '../db'

export async function ScheduleUserCalendar(user_id: number) {
    //Get all issues ordered by milestone which the user is assigned to
    try {
        let manuallyAddedTasks = await query(
            'SELECT * FROM tasks WHERE calendar_id=$1 AND type=$2 ORDER BY day, start_time',
            [user_id, 'personal']
        )
        let milestones = await query(
            'SELECT * FROM milestones INNER JOIN user_repos ur on milestones.repo_id = ur.repo_id WHERE user_id=$1 ORDER BY due_date',
            [user_id]
        )
        let assignedTasksOrderedByDueDate = await query(
            'SELECT issues.title, issues.description, issues.assigned_users, m.due_date, cardinality(assigned_users) as assigned_count FROM issues INNER JOIN user_repos ur on issues.repo_id = ur.repo_id LEFT JOIN milestones m on m.id = issues.milestone_id WHERE ur.user_id=$1 ORDER BY due_date, assigned_count DESC, updated_at',
            [user_id]
        )

        let alreadyScheduledTasks = manuallyAddedTasks.rows

        let tasksLeftToSchedule = assignedTasksOrderedByDueDate.rowCount
        let schedulingDay = dayjs()
        // schedulingDay.format('YYYY-MM-DD HH:mm:ss')
        //Check if the days schedule is still "running"
        let activeDay = schedulingDay.isBefore(dayjs().hour(18).minute(0).second(0).millisecond(0))
        if (!activeDay) {
            schedulingDay = schedulingDay.add(1, 'day')
            schedulingDay = schedulingDay.hour(9).minute(0).second(0).millisecond(0)
        }

        for (let [i, task] of alreadyScheduledTasks.entries()) {
            // console.log('------------')
            let startTime = dayjs(task.day)
                .hour(task.start_time.split(':')[0])
                .minute(task.start_time.split(':')[1])
                .second(task.start_time.split(':')[2])
                .millisecond(0)
            let endTime = dayjs(task.day)
                .hour(task.end_time.split(':')[0])
                .minute(task.end_time.split(':')[1])
                .second(task.end_time.split(':')[2])
                .millisecond(0)
            if (
                dayjs(task.day).isSame(schedulingDay, 'day') &&
                schedulingDay.isBetween(startTime, endTime, null, '[)')
            ) {
                //We're at a time where a task is already scheduled, let's go to the end of this task
                console.log(`overlap with task: ${task.title}`)
                console.log(`removing ${task.title}-(${i}) from tasks list`)
                schedulingDay = schedulingDay
                    .hour(endTime.hour())
                    .minute(endTime.minute())
                    .second(endTime.second())
                    .millisecond(endTime.millisecond())
                alreadyScheduledTasks = alreadyScheduledTasks.filter((innerTask, index) => innerTask.id !== task.id)
                continue
            }
            //How long until the next task? can we fit a task to be scheduled in here?!
            let timeUntilNextTask = dayjs(alreadyScheduledTasks[0].day)
                .hour(alreadyScheduledTasks[0].start_time.split(':')[0])
                .minute(alreadyScheduledTasks[0].start_time.split(':')[1])
                .second(alreadyScheduledTasks[0].start_time.split(':')[2])
                .millisecond(0)
                .diff(schedulingDay, 'hour', true)
            console.log(`${timeUntilNextTask} hours until the next task!`)
            if (timeUntilNextTask > 1) {
                console.log(`Can schedule ${Math.floor(timeUntilNextTask / 1)} tasks between now and the next task`)
            }
        }

        console.log(schedulingDay.format('YYYY-MM-DD HH:mm:ss'))
        console.log(alreadyScheduledTasks)

        //How long until the next task?

        return manuallyAddedTasks.rows
    } catch (error) {
        throw new Error('Something bad happened whilst scheduling user tasks - ' + error)
    }
}
