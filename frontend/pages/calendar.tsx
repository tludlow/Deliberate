import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

import Layout from '../components/Layout'
import { useEffect, useRef, useState } from 'react'
import Day from '../components/calendar/Day'
import api from 'lib/api'
import { Transition } from '@headlessui/react'
import { CaretRightIcon, ArrowLeft, ArrowRight, CalendarIcon, MarkerIcon } from '@/components/icons'
import { createPortal } from 'react-dom'
import CreateTaskModal from '../components/modal/CreateTaskModal'

/* tslint:disable */

export default function Calendar() {
    let now = dayjs()

    const calendar = useRef<HTMLElement>(null)
    const scrollHorizontally = (e: any) => {
        let x = e.clientX
        let y = e.clientY
        let elementMouseIsOver = document.elementFromPoint(x, y)
        let nearestArticleParent = elementMouseIsOver?.closest('article')

        //Does a double check, if the cursor is over a day with a scrollbar and if the day actually exists...
        let dayHasScroll = false
        if (nearestArticleParent) {
            dayHasScroll = nearestArticleParent.scrollHeight > nearestArticleParent.clientHeight
        }

        //Only scroll if we ARENT over a day with a scrollbar
        if (!dayHasScroll) {
            if (e.deltaY > 0) {
                // @ts-expect-error
                calendar.current.scrollLeft += 100
            } else {
                // @ts-expect-error
                calendar.current.scrollLeft -= 100
            }
        }
    }

    const [createTaskOpen, setCreateTaskOpen] = useState(false)

    const closeCreateTaskModal = () => {
        setCreateTaskOpen(false)
    }

    const [calendarData, setCalendarData] = useState([])
    const [overallData, setOverallData] = useState([])
    let daysToLoad: any = []

    useEffect(() => {
        //Load calendar data
        setCalendarData([])

        let localNow = dayjs()

        //Find which days to load, the date today and some days surrounding it
        for (let i = -14; i <= 14; i++) {
            daysToLoad.push(localNow.add(i, 'day').format('YYYY-MM-DD'))
        }

        //Get calendar overall info (not day info)
        api.get('/calendar/info')
            .then((response) => {
                setOverallData(response.data.milestoneData)
            })
            .catch((error) => {
                console.log(error)
            })

        daysToLoad.forEach((day: any) => {
            api.get(`/calendar/day/${day}`)
                .then((response: any) => {
                    setCalendarData((data) => [...data, response.data])
                })
                .catch((error: any) => {
                    console.log(error)
                })
        })

        //Make the scrolling be horizontal on this page
        document.documentElement.style.overflowY = 'hidden'

        window.addEventListener('wheel', scrollHorizontally)
        window.addEventListener('resize', scrollCalendarToToday)
        //calendar.current?.addEventListener('scroll', handleScroll)

        setTimeout(() => {
            scrollCalendarToToday()
        }, 1000)

        return () => {
            window.removeEventListener('wheel', scrollHorizontally)
            window.removeEventListener('resize', scrollCalendarToToday)
            //calendar.current?.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const scrollCalendarToToday = () => {
        let today = document.getElementById(dayjs().format('D-MMMM-YYYY').toLowerCase())
        today?.scrollIntoView({ inline: 'center', behavior: 'smooth' })
    }

    // Scroll handler for lazy loading the dates on the edge of the horizontal axis

    // const handleScroll = (e: any) => {
    //     let width = calendar.current?.getBoundingClientRect()['width']
    //     let scrollWidth = calendar.current?.scrollWidth
    //     let scrollLeft = calendar.current?.scrollLeft
    //     // const scrollWidth = $('#scrollquestion')[0].scrollWidth;
    //     // const scrollLeft = $('#scrollquestion').scrollLeft();

    //     //   if($scrollWidth - $width === $scrollLeft){
    //     //     alert('right end');
    //     //   }
    //     //   if($scrollLeft===0){
    //     //     alert('left end');
    //     //   }
    //     // console.log("Width: ", width)
    //     // console.log("Scroll Left: ", scrollLeft)
    //     // console.log("Scroll Width: ", scrollWidth)
    //     // console.log("-------------")

    //     if (width + scrollLeft >= 0.9 * scrollWidth) {
    //         if (shouldLoad) {
    //             loadFuture()
    //         }
    //     }
    //     if (scrollLeft <= 0.1 * scrollWidth) {
    //         if (shouldLoad) {
    //             loadPast()
    //         }
    //     }
    // }

    const loadFuture = () => {
        //get the current largest day loaded
        let sorted = calendarData.sort((a, b) => new Date(a.day) - new Date(b.day))
        console.log(sorted)
        let largestLoadedDay = sorted[sorted.length - 1]

        api.get(`/calendar/${largestLoadedDay.day}/future`)
            .then((response) => {
                let newData = [...calendarData, ...response.data.calendarData]
                setCalendarData(newData)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const loadPast = () => {
        //get the current largest day loaded
        let sorted = calendarData.sort((a, b) => new Date(a.day) - new Date(b.day))
        let lowestDayLoaded = sorted[0]
        console.log(lowestDayLoaded)

        api.get(`/calendar/${lowestDayLoaded.day}/past`)
            .then((response) => {
                let newData = [...response.data.calendarData, ...calendarData]
                setCalendarData(newData)
            })
            .catch((error) => {
                console.log(error)
            })

        let least = document.getElementById(dayjs(lowestDayLoaded.day).format('D-MMMM-YYYY').toLowerCase())
        least.scrollIntoView({ inline: 'center', behavior: 'auto' })
    }

    // Attach the handler

    const [showActionMenu, setShowActionMenu] = useState(false)
    const [showMilestoneMenu, setShowMilestoneMenu] = useState(false)
    return (
        <Layout title="My Calendar">
            <section
                id="calendar-container"
                ref={calendar}
                style={{ minHeight: '-webkit-fill-available' }}
                className="flex w-full overflow-x-scroll cursor-move select-none h-within thin-scrollbar"
            >
                {/* Left occlusion */}
                {/* <div className="left-0 hidden w-32 md:fixed bg-gradient-to-r from-gray-50 to-transparent h-within"></div> */}
                {/* Right occlusion */}
                {/* <div className="right-0 hidden w-32 md:fixed bg-gradient-to-l from-gray-50 to-transparent h-within"></div> */}

                {createTaskOpen &&
                    createPortal(
                        <CreateTaskModal isOpen={createTaskOpen} closeModal={closeCreateTaskModal} />,
                        document.body
                    )}

                {/* Control menu */}
                <div
                    onMouseEnter={() => setShowActionMenu(true)}
                    onMouseLeave={() => setShowActionMenu(false)}
                    className="fixed hidden p-4 rounded-full cursor-pointer z-60 md:block bg-brand left-6 bottom-6"
                >
                    <div className="relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-white w-7 h-7"
                            viewBox="0 0 24 24"
                            strokeWidth="2.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <circle cx="12" cy="12" r="9" />
                            <line x1="8" y1="12" x2="8" y2="12.01" />
                            <line x1="12" y1="12" x2="12" y2="12.01" />
                            <line x1="16" y1="12" x2="16" y2="12.01" />
                        </svg>
                        <Transition
                            show={showActionMenu}
                            enter="transition-opacity duration-75"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            {/* Action menu */}
                            <div className="fixed inset-y-0 left-0 z-30 p-3 bg-white border-r border-gray-300 cursor-default w-80 top-13">
                                <div className="flex flex-col">
                                    <h3 className="pb-2 text-xl font-bold text-center text-gray-800 border-b border-gray-300">
                                        Calendar Actions
                                    </h3>
                                </div>
                                <div className="p-3">
                                    <ul className="space-y-5">
                                        <li className="w-full">
                                            <button onClick={() => scrollCalendarToToday()} className="w-full">
                                                <div className="flex items-center p-2 hover:bg-gray-100">
                                                    <CalendarIcon className="block w-5 h-5 mr-1 text-gray-600" />
                                                    <p className="font-semibold">Scroll to Today</p>
                                                </div>
                                            </button>
                                        </li>
                                        <li className="w-full">
                                            <button onClick={() => setCreateTaskOpen(true)} className="w-full">
                                                <div className="flex items-center p-2 hover:bg-gray-100">
                                                    <CaretRightIcon className="block w-5 h-5 text-gray-600" />
                                                    <p className="font-semibold">Add Task</p>
                                                </div>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div
                                onMouseEnter={() => setShowActionMenu(false)}
                                className="fixed inset-0 bg-gray-700 bg-opacity-50 top-13"
                            ></div>
                        </Transition>
                    </div>
                </div>

                {/* Calendar menu */}
                <div
                    onMouseEnter={() => setShowMilestoneMenu(true)}
                    onMouseLeave={() => setShowMilestoneMenu(false)}
                    className="fixed hidden p-4 rounded-full cursor-pointer z-60 md:block bg-brand right-6 bottom-6"
                >
                    <div className="relative">
                        <MarkerIcon className="text-white h-7 w-7" />
                        <Transition
                            show={showMilestoneMenu}
                            enter="transition-opacity duration-75"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            {/* Action menu */}
                            <div className="fixed inset-y-0 right-0 z-30 p-3 bg-white border-r border-gray-300 cursor-default w-80 top-13">
                                <div className="flex flex-col">
                                    <h3 className="pb-2 text-xl font-bold text-center text-gray-800 border-b border-gray-300">
                                        Milestones
                                    </h3>
                                </div>
                                <div className="p-3">
                                    <ul className="space-y-6">
                                        {overallData.map((milestone, i) => (
                                            <li
                                                key={i}
                                                className="flex justify-between w-full p-1 px-3 border border-gray-600 rounded"
                                            >
                                                <div>
                                                    <h4 className="text-lg font-semibold">{milestone.title}</h4>
                                                    <p className="mt-0.5 flex items-center text-sm">
                                                        <CalendarIcon className="w-4 h-4 mr-2 text-gray-700" />
                                                        <span>
                                                            {milestone.due_date.split('T')[0]}
                                                            <span className="text-gray-400">
                                                                - {dayjs(milestone.due_date).from()}
                                                            </span>
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-center flex-grow h-full mt-2">
                                                    <div className="flex items-center justify-center bg-red-500 rounded-full w-9 h-9">
                                                        <span className="text-white tabular-nums">
                                                            {milestone.percentage}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div
                                onMouseEnter={() => setShowMilestoneMenu(false)}
                                className="fixed inset-0 bg-gray-700 bg-opacity-50 top-13"
                            ></div>
                        </Transition>
                    </div>
                </div>

                <div className="flex w-full h-full px-12">
                    <div className="flex items-center w-48 h-full">
                        <button
                            onClick={() => loadPast()}
                            className="flex items-center justify-center p-6 mx-12 rounded-full bg-brand hover:bg-brand-light hover:shadow"
                        >
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {calendarData
                        .sort((a, b) => new Date(a.day) - new Date(b.day))
                        .map((day, i) => (
                            <Day
                                key={i}
                                day={dayjs(day.day, 'YYYY-MM-DD')}
                                now={dayjs()}
                                startHour={day.start}
                                endHour={day.end}
                                tasks={day.tasks}
                            />
                        ))}
                    <div className="flex items-center w-48 h-full">
                        <button
                            onClick={() => loadFuture()}
                            className="flex items-center justify-center p-6 mx-12 rounded-full bg-brand hover:bg-brand-light hover:shadow"
                        >
                            <ArrowRight className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </section>
        </Layout>
    )
}
