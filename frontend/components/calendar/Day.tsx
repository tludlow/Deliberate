import dayjs from 'dayjs'

import { Menu, Transition } from '@headlessui/react'
import { useEffect, useRef } from 'react'

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

        return hours
    }

    //Array of all the hours between the start and end time of the day
    const dayHours = calculateHoursBetween(startHour, endHour)

    //Is the current hour of the day within the day's schedule events?
    const workDayActive =
        now.isBefore(dayjs().hour(endHour).minute(0).second(0)) &&
        now.isAfter(dayjs().hour(startHour).minute(0).second(0))

    const timeline = useRef<HTMLDivElement>(null)

    //Calculate the height of the hour block inside the day timeline, used to scale the timeline top offsets
    let hourBlock = timeline.current?.childNodes[1] as HTMLElement
    let hourBlockHeightRem = hourBlock?.getBoundingClientRect().height / 16

    return (
        <div
            id={day.format('D-MMMM-YYYY').toLowerCase()}
            className="flex flex-col items-center flex-shrink-0 h-full p-2"
            style={{ width: '25%' }}
        >
            {/* Day header */}
            <div className="flex items-center justify-between w-full p-3 border border-gray-200 just-self-start">
                <div>
                    <h4 className="font-semibold">{day.format('dddd D MMMM')}</h4>
                </div>

                <DayOptionsDropdown />
            </div>

            {/* Timeline */}
            <div ref={timeline} className="relative flex-col w-full h-full p-3 border border-gray-200 sm:flex">
                {/* Current time tracker, only display for the current day and if the calendar dates are within the current time range */}
                {now.format('D-MMMM-YYYY').toLowerCase() === day.format('D-MMMM-YYYY').toLowerCase() &&
                    workDayActive && <TimeLine now={now} hourHeight={hourBlockHeightRem} startHour={startHour} />}

                {dayHours.map((hour, i) => (
                    <div key={i} className="h-24">
                        <div className="flex items-center space-x-2">
                            <span className="flex-shrink-0 text-sm text-gray-400">{hour}</span>
                            <div className="w-full h-px bg-gray-300"></div>
                        </div>
                    </div>
                ))}
            </div>
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
                                className="absolute right-0 z-10 mt-2 origin-top-right border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none bg-gray-50 w-96"
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
                                                className="w-7 h-7"
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
        //Starts at 9am and each hour block is 6rem tall, plus the beginning padding which is 0.75 rem
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
            className="absolute z-30 flex items-center w-full -mt-1 -ml-3"
        >
            <span className="flex-shrink-0 px-3 py-1 text-sm text-white rounded-full bg-brand-light">
                {now.format('h:mm A')}
            </span>
            <div className="w-full h-px bg-brand-light"></div>
        </div>
    )
}
