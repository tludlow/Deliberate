import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

import { Menu, Transition } from '@headlessui/react'
import { useEffect, useRef, useState } from 'react'
import Task from './Task'

type DayProps = {
    day: dayjs.Dayjs
    now: dayjs.Dayjs
    startHour: number
    endHour: number
    tasks: TaskProp[]
}
interface TaskProp {
    title: string
    description: string
    start_time: string
    end_time: string
    type: string
}

const Day = ({ day, now, startHour = 9, endHour = 17, tasks }: DayProps) => {
    const calculateHoursBetween = (startHour: number, endHour: number) => {
        const dayHourStart = dayjs().hour(startHour)
        const dayHourEnd = dayjs().hour(endHour)
        let intermediaryTime = dayHourStart

        let hours: string[] = []

        for (let i = 0; i <= dayHourEnd.diff(dayHourStart, 'hour'); i++) {
            hours.push(intermediaryTime.format('h A'))
            intermediaryTime = intermediaryTime.add(1, 'hour')
        }
        hours.push(intermediaryTime.format('h A'))

        return hours
    }

    //Array of all the hours between the start and end time of the day
    const dayHours = calculateHoursBetween(startHour, endHour - 1)

    //Is the current hour of the day within the day's schedule events?
    const workDayActive =
        now.isBefore(dayjs().hour(endHour).minute(59).second(59)) &&
        now.isAfter(dayjs().hour(startHour).minute(0).second(0))

    const isToday = now.format('D-MMMM-YYYY').toLowerCase() === day.format('D-MMMM-YYYY').toLowerCase()

    const timeline = useRef<HTMLDivElement>(null)

    //Calculate the height of the hour block inside the day timeline, used to scale the timeline top offsets
    let hourBlock = timeline.current?.childNodes[1] as HTMLElement
    let hourBlockHeightRem = 6 //hourBlock?.getBoundingClientRect().height / 16

    useEffect(() => {
        console.log(tasks)
    }, [])
    return (
        <div
            id={day.format('D-MMMM-YYYY').toLowerCase()}
            className={`flex flex-col items-center flex-shrink-0 w-10/12 m-2 overflow-hidden rounded shadow-lg cursor-default sm:w-8/12 md:w-6/12 lg:w-4/12 xl:w-3/12 ${
                workDayActive && isToday ? 'border border-brand' : 'border border-gray-200'
            }`}
        >
            {/* Day header */}
            <div className="flex items-center justify-between flex-shrink-0 w-full p-3 border border-gray-200 just-self-start">
                <div>
                    <h4 className="font-semibold">{day.format('dddd D MMMM')}</h4>
                </div>

                <DayOptionsDropdown />
            </div>

            {/* Timeline */}
            <article
                ref={timeline}
                id="day-timeline"
                className="relative flex flex-col flex-1 w-full p-3 pb-2 border border-gray-200 ultra-thin-scrollbar"
            >
                {/* Current time tracker, only display for the current day and if the calendar dates are within the current time range */}
                {isToday && workDayActive && (
                    <TimeLine now={now} hourHeight={hourBlockHeightRem} startHour={startHour} />
                )}

                {dayHours.map((hour, i) => (
                    <div
                        key={i}
                        style={{ top: `${i * 6}rem` }}
                        className="absolute inset-x-0 z-10 flex items-center pt-4 pr-3 -mt-3 space-x-2"
                    >
                        <span className="flex-shrink-0 text-sm text-right text-gray-400" style={{ width: '42px' }}>
                            {hour}
                        </span>

                        <div className="w-full h-px bg-gray-300 "></div>
                    </div>
                ))}

                {/* Task container */}
                <div style={{ height: '54.3rem' }} className="absolute inset-x-0 mt-0.5 right-3 left-14">
                    {tasks.map((task, i) => (
                        <Task
                            key={i}
                            title={task.title}
                            description={task.description}
                            day={day}
                            start={dayjs(task.start_time, 'HH:mm:ss').format('HH:mm A')}
                            end={dayjs(task.end_time, 'HH:mm:ss').format('HH:mm A')}
                            type="food"
                            now={now}
                            id={task.id}
                            type={task.type}
                        />
                    ))}
                </div>
            </article>
        </div>
    )
}

export default Day

function DayOptionsDropdown() {
    return (
        <span className="relative">
            <Menu>
                {({ open }) => (
                    <>
                        <span className="rounded-md">
                            <Menu.Button
                                className={`p-1 border-none rounded-full shadow-none hover:bg-gray-2000 ${
                                    open ? 'bg-gray-200' : ''
                                }`}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </Menu.Button>
                        </span>

                        <Transition
                            show={open}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items
                                static
                                className="absolute right-0 z-50 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none w-72 md:w-96"
                            >
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                            } flex justify-between items-center w-full px-4 py-2 text-medium leading-5 text-left`}
                                        >
                                            <span className="flex flex-col">
                                                <span className="font-medium">Cancel Today</span>
                                                <span className="text-sm text-gray-500">Reschedule today's events</span>
                                            </span>
                                            <svg
                                                className="text-red-500 w-7 h-7"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </button>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Transition>
                    </>
                )}
            </Menu>
        </span>
    )
}

type TimeLineProps = {
    now: dayjs.Dayjs
    hourHeight: number
    startHour: number
}
function TimeLine({ now, hourHeight, startHour }: TimeLineProps) {
    //Maps aka quater past the hour to 1/4 of them rem of the hour block container
    const mapMinutesPastHourToRem = (container = 6) => {
        const hourToStart = dayjs().hour(startHour)
        const currentHour = dayjs().hour(Number(now.format('HH')))

        const offsetHour = currentHour.diff(hourToStart, 'hour')
        const offset = offsetHour * container + 0.75

        const percentOfHour = Number(now.format('m')) / 60

        return `${percentOfHour * container + offset}rem`
    }

    const [topOffset, setTopOffset] = useState(mapMinutesPastHourToRem(hourHeight))

    useEffect(() => {
        setTopOffset(mapMinutesPastHourToRem(hourHeight))
    }, [now])
    return (
        <div
            style={{
                top: topOffset,
            }}
            className="absolute flex items-center w-full -mt-3 -ml-3 pointer-events-none"
        >
            <span className="relative z-40 flex-shrink-0 px-3 py-1 text-sm text-white rounded-full bg-brand-light">
                {now.format('h:mm A')}
            </span>
            <div className="relative z-10 w-full h-px bg-brand-light"></div>
        </div>
    )
}
