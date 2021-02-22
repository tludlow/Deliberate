import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import dayjs, { Dayjs } from 'dayjs'
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

type Task = {
    id: number
    title: string
    description: string
    day: Dayjs
    startTime: Dayjs
    endTime: Dayjs
}
//For a given day, ensure none of the tasks overlap with eachother
export const checkTaskOverlaps = (tasks: Task[]) => {
    tasks.forEach((task) => {
        tasks.forEach((compared) => {
            //make sure the compared task starts before the first and ends before the last
            let invalidTime =
                task.startTime.isBetween(compared.startTime, compared.endTime, null, '()') ||
                task.endTime.isBetween(compared.startTime, compared.endTime, null, '()')
            invalidTime && console.log(`Task: ${task.id} conflicts with task: ${compared.id}`)
        })
    })
}
