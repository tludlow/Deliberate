import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { UserIcon, GithubIcon, RightArrowIcon } from '../icons'
import TaskModal from '../modal/TaskModal'

type TaskProps = {
    id: number
    title: string
    description: string
    start: string
    end: string
    day: dayjs.Dayjs
    now: dayjs.Dayjs
    type: string
    milestone_id: number
}

export default function Task({ id, title, description, start, end, type, day, now, milestone_id }: TaskProps) {
    const [open, setOpen] = useState(false)

    const closeModal = () => {
        setOpen(false)
    }

    const calculateHeight = (start: string, end: string) => {
        //Convert the string start and end into dayjs objects to do date/time manipulation
        const startTime = dayjs(start, 'h:mm A')
        const endTime = dayjs(end, 'h:mm A')

        let lengthMins = endTime.diff(startTime, 'minute')
        return lengthMins / 60
    }

    const calculateTopOffset = (start: string) => {
        const startTime = dayjs(start, 'HH:mm A')
        const dayStart = dayjs().hour(9).minute(0).second(0).millisecond(0)

        const difference = startTime.diff(dayStart, 'minute')
        return difference / 60
    }

    const calculateColour = () => {
        let possibleColours = [
            'bg-red-500',
            'bg-green-500',
            'bg-blue-500',
            'bg-indigo-500',
            'bg-pink-500',
            'bg-yellow-500',
            'bg-indigo-500',
            'bg-purple-500',
            'bg-blue-300',
            'bg-indigo-700',
            'bg-green-300',
            'bg-yellow-400',
        ]
        if (type == 'personal') {
            return `bg-gray-400`
        }
        if (!milestone_id) {
            return `bg-red-700`
        }

        return possibleColours[milestone_id % possibleColours.length]
    }

    return (
        <>
            {open &&
                createPortal(
                    <TaskModal
                        isOpen={open}
                        closeModal={closeModal}
                        id={id}
                        title={title}
                        description={description}
                        date={day}
                        start={start}
                        end={end}
                        type={type}
                    />,
                    document.body
                )}

            <div
                onClick={() => setOpen(true)}
                style={{ height: `${6 * calculateHeight(start, end)}rem`, top: `${6 * calculateTopOffset(start)}rem` }}
                className={`absolute flex items-center inset-x-0 bg-white rounded shadow cursor-pointer hover:bg-gray-100 hover:shadow-xs hover:border hover:border-gray-200 z-30 border border-gray-100`}
            >
                <div
                    className={`relative flex flex-col items-center justify-center flex-shrink-0 w-4 h-full ${calculateColour()} rounded-l`}
                >
                    <div
                        className={`absolute flex items-center justify-center ${calculateColour()} rounded-full shadow w-7 h-7`}
                    >
                        {type === 'github' && (
                            <a href="https://github.com/tludlow/Deliberate">
                                <GithubIcon className="w-5 h-5 text-white" />
                            </a>
                        )}
                        {type === 'personal' && <UserIcon className="w-5 h-5 text-white" />}
                    </div>
                </div>
                <div
                    className={`flex-grow h-full p-1 pl-4 ${
                        calculateHeight(start, end) < 0.3 ? 'flex justify-between leading-none pr-4' : ''
                    }`}
                >
                    <h5 className={`text-sm font-semibold ${calculateHeight(start, end) < 0.3 ? '-mt-0.5' : ''} `}>
                        {title}
                    </h5>
                    <p className="flex items-center text-xs font-medium text-gray-500">
                        {dayjs(start, 'HH:mm A').format('h:mm A')}{' '}
                        <RightArrowIcon className="w-4 h-4 mx-1 font-normal text-gray-400" />{' '}
                        {dayjs(end, 'HH:mm A').format('h:mm A')}
                    </p>
                </div>
            </div>
        </>
    )
}
