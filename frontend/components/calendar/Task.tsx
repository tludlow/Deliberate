import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { RightArrowIcon } from '../icons'
import TaskModal from '../modal/TaskModal'

type TaskProps = {
    title: string
    start: string
    end: string
    type: string
    day: dayjs.Dayjs
    now: dayjs.Dayjs
}

export default function Task({ title, start, end, type = 'github', day, now }: TaskProps) {
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
        const startTime = dayjs(start, 'h:mm A')
        const dayStart = dayjs().hour(9).minute(0).second(0).millisecond(0)

        const difference = startTime.diff(dayStart, 'minute')
        return difference / 60
    }

    useEffect(() => {
        console.log(calculateHeight(start, end))
    }, [])

    let possibleColours = ['red', 'green', 'blue', 'indigo', 'pink', 'gray']
    const selectedColour = possibleColours[Math.floor(Math.random() * possibleColours.length)]

    return (
        <>
            {open &&
                createPortal(
                    <TaskModal isOpen={open} closeModal={closeModal} id={1} title={title} start={start} end={end} />,
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
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 text-white"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
                                </svg>
                            </a>
                        )}
                        {type === 'food' && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 text-white"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M3 19l15 -15l3 3l-6 6l2 2a14 14 0 0 1 -14 4" />
                            </svg>
                        )}
                    </div>
                </div>
                <div className="flex-grow h-full p-1 pl-4">
                    <h5 className="text-sm font-semibold truncate overflow-ellipsis">{title}</h5>
                    <p className="flex items-center text-xs font-medium text-gray-500">
                        {start} <RightArrowIcon className="w-4 h-4 mx-1 font-normal text-gray-400" /> {end}
                    </p>
                </div>
            </div>
        </>
    )
}
