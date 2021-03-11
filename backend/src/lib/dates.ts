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
    start_time: Dayjs
    end_time: Dayjs
}
//For a given day, ensure none of the tasks overlap with eachother
export const checkTaskOverlaps = (tasks: Task[]) => {
    let isInvalid = false
    for (let task of tasks) {
        for (let compared of tasks) {
            if (task === compared) {
                console.log(`${task.title}  same as ${compared.title}`)
                continue
            }
            //make sure the compared task starts before the first and ends before the last
            let invalidStart = task.start_time.isBetween(compared.start_time, compared.end_time, null, '()')
            let invalidEnd = task.end_time.isBetween(compared.start_time, compared.end_time, null, '()')
            let sameStartEnd = task.start_time.isSame(compared.start_time) && task.end_time.isSame(compared.end_time)

            if (invalidStart) {
                console.log(`${task.title} - ${task.start_time} is between ${compared.start_time}-${compared.end_time}`)
            }
            if (invalidEnd) {
                console.log(`${task.title} - ${task.end_time} is between ${compared.start_time}-${compared.end_time}`)
            }

            let invalid = invalidStart || invalidEnd || sameStartEnd
            if (invalid) {
                isInvalid = true
                break
            }
        }
    }
    return isInvalid
}
