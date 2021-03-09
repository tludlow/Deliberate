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
        let assignedTasksOrderedByDueDate = await query(
            'SELECT issues.title, issues.description, issues.assigned_users, m.due_date, cardinality(assigned_users) as assigned_count FROM issues INNER JOIN user_repos ur on issues.repo_id = ur.repo_id LEFT JOIN milestones m on m.id = issues.milestone_id WHERE ur.user_id=$1 ORDER BY due_date, assigned_count DESC, updated_at',
            [user_id]
        )
        return assignedTasksOrderedByDueDate.rows
    } catch (error) {
        throw new Error('Something bad happened whilst scheduling user tasks - ' + error)
    }
}
