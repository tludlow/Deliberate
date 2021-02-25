import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FoodIcon, GithubIcon, RightArrowIcon } from '../icons'
import TaskModal from '../modal/TaskModal'

type TaskProps = {
    title: string
    description: string
    start: string
    end: string
    type: string
    day: dayjs.Dayjs
    now: dayjs.Dayjs
}

export default function Task({ title, description, start, end, type = 'github', day, now }: TaskProps) {
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

    let possibleColours = ['red', 'green', 'blue', 'indigo', 'pink', 'gray']
    const selectedColour = possibleColours[Math.floor(Math.random() * possibleColours.length)]

    return (
        <>
            {open &&
                createPortal(
                    <TaskModal
                        isOpen={open}
                        closeModal={closeModal}
                        id={1}
                        title={title}
                        description={description}
                        start={start}
                        end={end}
                    />,
                    document.body
                )}

            <div
                onClick={() => setOpen(true)}
                style={{ height: `${6 * calculateHeight(start, end)}rem`, top: `${6 * calculateTopOffset(start)}rem` }}
                className={`absolute flex items-center inset-x-0 bg-white rounded shadow cursor-pointer hover:bg-gray-100 hover:shadow-xs hover:border hover:border-gray-200 z-30 border border-gray-100`}
            >
                <div
                    className={`relative flex flex-col items-center justify-center flex-shrink-0 w-4 h-full bg-${selectedColour}-500 rounded-l`}
                >
                    <div
                        className={`absolute flex items-center justify-center bg-${selectedColour}-400 rounded-full shadow w-7 h-7`}
                    >
                        {type === 'github' && (
                            <a href="https://github.com/tludlow/Deliberate">
                                <GithubIcon className="w-5 h-5 text-white" />
                            </a>
                        )}
                        {type === 'food' && <FoodIcon className="w-5 h-5 text-white" />}
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
                        {start} <RightArrowIcon className="w-4 h-4 mx-1 font-normal text-gray-400" /> {end}
                    </p>
                </div>
            </div>
        </>
    )
}
