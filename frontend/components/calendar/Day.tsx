import dayjs from 'dayjs'
import { Menu, Transition } from '@headlessui/react'

type DayProps = {
    day: dayjs.Dayjs,
}

const Day = ({ day }: DayProps) => {
    //Maps aka quater past the hour to 1/4 of them rem of the hour block container
    const mapMinutesPastHourToRem = (hour: number, minutes: number, container: number) => {
        //Starts at 9am and each hour block is 6rem tall, plus the beginning padding which is 0.75 rem
        const offset = (hour - 9) * 6 + 0.75

        if (minutes === 0) {
            return `${offset}rem`
        }
        const percentOfHour = minutes / 60
        return `${percentOfHour * container + offset}rem`
    }

    return (
        <div
            id={day.format('D-MMMM-YYYY').toLowerCase()}
            className="flex flex-col items-center flex-shrink-0 h-full p-2"
            style={{ width: '25%' }}
        >
            {/* Day header */}
            <div className="flex items-center justify-between w-full p-3 border border-gray-200 just-self-start">
                <h4 className="font-semibold">{day.format('dddd D MMMM')}</h4>

                <DayOptionsDropdown />
            </div>

            {/* Timeline */}
            <div className="relative flex-col w-full h-full p-3 border border-gray-200 sm:flex">
                {/* Current time tracker */}
                <div
                    style={{ top: mapMinutesPastHourToRem(9, 15, 6) }}
                    className="absolute flex items-center w-full -mt-1 -ml-3"
                >
                    <span className="flex-shrink-0 px-3 py-1 text-sm text-white rounded-full bg-brand-light">
                        9:15 AM
                    </span>
                    <div className="w-full h-px bg-brand-light"></div>
                </div>

                {/* 9AM */}
                <div className="h-24">
                    <div className="flex items-center space-x-2">
                        <span className="flex-shrink-0 text-sm text-gray-400">9 AM</span>
                        <div className="w-full h-px bg-gray-300"></div>
                    </div>
                </div>
                <div className="h-24">
                    <div className="flex items-center space-x-2">
                        <span className="flex-shrink-0 text-sm text-gray-400">10 AM</span>
                        <div className="w-full h-px bg-gray-300"></div>
                    </div>
                </div>
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
                                className="absolute right-0 z-10 mt-2 origin-top-right border divide-y divide-gray-100 rounded-md shadow-lg outline-none bg-gray-50 bordr-gray-200 w-96"
                            >
                                <Menu.Item>{({ active }) => <p>Cheese!</p>}</Menu.Item>
                            </Menu.Items>
                        </Transition>
                    </>
                )}
            </Menu>
        </span>
    )
}
