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
}

export default function Task({ title, start, end }: TaskProps) {
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

    return (
        <>
            {open && createPortal(<TaskModal isOpen={open} closeModal={closeModal} id={1} />, document.body)}

            <div
                onClick={() => setOpen(true)}
                style={{ height: `${6 * calculateHeight(start, end)}rem`, top: `${6 * calculateTopOffset(start)}rem` }}
                className={`absolute flex items-center inset-x-0 bg-white rounded shadow cursor-pointer hover:bg-gray-100 hover:shadow-xs hover:border hover:border-gray-200 z-30`}
            >
                <div className="relative flex flex-col items-center justify-center flex-shrink-0 w-4 h-full bg-green-400 rounded-l">
                    <div className="absolute flex items-center justify-center bg-green-500 rounded-full shadow w-7 h-7">
                        <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                    </div>
                </div>
                <div className="flex-grow h-full p-1 pl-4">
                    <h5 className="text-sm font-semibold">{title}</h5>
                    <p className="flex items-center text-xs font-medium text-gray-500">
                        {start} <RightArrowIcon className="w-4 h-4 mx-1 font-normal text-gray-400" /> {end}
                    </p>
                </div>
            </div>
        </>
    )
}
