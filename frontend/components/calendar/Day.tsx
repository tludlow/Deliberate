import dayjs from 'dayjs'

import { Menu, Transition } from '@headlessui/react'
import { useEffect, useRef } from 'react'
import Task from './Task'

type DayProps = {
    day: dayjs.Dayjs
    now: dayjs.Dayjs
    startHour: number
    endHour: number
}

const Day = ({ day, now, startHour = 9, endHour = 17 }: DayProps) => {
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
    const dayHours = calculateHoursBetween(startHour, endHour)

    //Is the current hour of the day within the day's schedule events?
    const workDayActive =
        now.isBefore(dayjs().hour(endHour).minute(0).second(0)) &&
        now.isAfter(dayjs().hour(startHour).minute(59).second(59))

    const timeline = useRef<HTMLDivElement>(null)

    //Calculate the height of the hour block inside the day timeline, used to scale the timeline top offsets
    let hourBlock = timeline.current?.childNodes[1] as HTMLElement
    let hourBlockHeightRem = hourBlock?.getBoundingClientRect().height / 16

    return (
        <div
            id={day.format('D-MMMM-YYYY').toLowerCase()}
            className="flex flex-col items-center flex-shrink-0 w-10/12 max-h-full p-2 cursor-default sm:w-8/12 md:w-6/12 lg:w-4/12 xl:w-3/12"
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
                className="relative flex flex-col flex-grow w-full p-3 pt-4 pb-2 overflow-y-auto border border-gray-200 ultra-thin-scrollbar"
            >
                {/* Current time tracker, only display for the current day and if the calendar dates are within the current time range */}
                {now.format('D-MMMM-YYYY').toLowerCase() === day.format('D-MMMM-YYYY').toLowerCase() &&
                    workDayActive && <TimeLine now={now} hourHeight={hourBlockHeightRem} startHour={startHour} />}

                {dayHours.map((hour, i) => (
                    <div key={i} className="flex-1 h-24">
                        <div className="absolute inset-x-0 flex items-center pr-3 -mt-3 space-x-2">
                            <span className="flex-shrink-0 text-sm text-right text-gray-400" style={{ width: '42px' }}>
                                {hour}
                            </span>
                            <div className="w-full h-px bg-gray-400"></div>
                        </div>
                        {i !== dayHours.length-1 ? (
                            <div className="h-full pt-1 pb-2 pl-11">
                                <Task />
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                ))}
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
                                className="absolute right-0 z-10 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none w-72 md:w-96"
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
    const mapMinutesPastHourToRem = (container: number) => {
        const hourToStart = dayjs().hour(startHour)
        const currentHour = dayjs().hour(Number(now.format('HH')))

        const offsetHour = currentHour.diff(hourToStart, 'hour')
        const offset = offsetHour * container + 0.75

        const percentOfHour = Number(now.format('m')) / 60
        return `${percentOfHour * container + offset}rem`
    }

    return (
        <div
            style={{
                top: mapMinutesPastHourToRem(hourHeight),
            }}
            className="absolute flex items-center w-full -mt-3 -ml-3 pointer-events-none"
        >
            <span className="z-30 flex-shrink-0 px-3 py-1 text-sm text-white rounded-full bg-brand-light">
                {now.format('h:mm A')}
            </span>
            <div className="w-full h-px bg-brand-light"></div>
        </div>
    )
}
