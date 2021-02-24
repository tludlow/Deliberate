import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

import Layout from '../components/Layout'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CalendarIcon } from '@/components/icons'
import Day from '../components/calendar/Day'
import api from 'lib/api'

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

    const [loading, setLoading] = useState(true)
    const [calendarData, setCalendarData] = useState([])
    let daysToLoad: any = []

    useEffect(() => {
        //Load calendar data
        setCalendarData([])

        let localNow = dayjs()

        //Find which days to load, the date today and some days surrounding it
        for (let i = -4; i <= 4; i++) {
            daysToLoad.push(localNow.add(i, 'day').format('YYYY-MM-DD'))
        }

        daysToLoad.forEach((day: any) => {
            api.get(`/calendar/day/${day}`)
                .then((response: any) => {
                    setCalendarData((data) => [...data, response.data])
                    if (response.data.tasks.length > 0) {
                        console.log(response)
                    }
                })
                .catch((error: any) => {
                    console.log(error)
                })
        })

        //Make the scrolling be horizontal on this page
        document.documentElement.style.overflowY = 'hidden'

        window.addEventListener('wheel', scrollHorizontally)
        window.addEventListener('resize', scrollCalendarToToday)

        setLoading(false)
        setTimeout(() => {
            scrollCalendarToToday()
        }, 150)

        return () => {
            window.removeEventListener('wheel', scrollHorizontally)
            window.removeEventListener('resize', scrollCalendarToToday)
        }
    }, [])

    const scrollCalendarToToday = () => {
        let today = document.getElementById(dayjs().format('D-MMMM-YYYY').toLowerCase())
        today?.scrollIntoView({ inline: 'center', behavior: 'smooth' })
    }

    // Scroll handler for lazy loading the dates on the edge of the horizontal axis

    // const handleScroll = (e: any) => {
    //     let width = calendar.current?.getBoundingClientRect()["width"]
    //     let scrollWidth = calendar.current?.scrollWidth
    //     let scrollLeft = calendar.current?.scrollLeft
    // 	// const scrollWidth = $('#scrollquestion')[0].scrollWidth;
    //   	// const scrollLeft = $('#scrollquestion').scrollLeft();

    // //   if($scrollWidth - $width === $scrollLeft){
    // //     alert('right end');
    // //   }
    // //   if($scrollLeft===0){
    // //     alert('left end');
    // //   }
    // // console.log("Width: ", width)
    // // console.log("Scroll Left: ", scrollLeft)
    // // console.log("Scroll Width: ", scrollWidth)
    // // console.log("-------------")

    //     if (width + scrollLeft === scrollWidth) {
    //         console.log("right")
    //     }
    //     if(scrollLeft === 0) {
    //         console.log("left")
    //     }
    // }

    // Attach the handler

    const [showActionMenu, setShowActionMenu] = useState(false)
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

                {/* Control menu */}
                <div
                    onMouseEnter={() => setShowActionMenu(true)}
                    onMouseLeave={() => setShowActionMenu(false)}
                    className="fixed z-40 hidden p-4 rounded-full cursor-pointer md:block bg-brand left-6 bottom-6"
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

                        {showActionMenu && (
                            <>
                                {/* Action menu */}
                                <div className="fixed inset-y-0 left-0 z-30 p-3 bg-white border-r border-gray-300 cursor-default w-80 top-13">
                                    <div className="flex flex-col">
                                        <h3 className="pb-2 text-xl font-bold text-center text-gray-800 border-b border-gray-300">
                                            Calendar Actions
                                        </h3>
                                    </div>
                                    <div className="p-3">
                                        <ul className="space-y-5">
                                            <li className="p-2 border rounded cursor-pointer border-brand hover:bg-gray-100">
                                                <button className="flex justify-between w-full">
                                                    <span className="font-semibold">Add Task</span>
                                                    <svg
                                                        className="w-6 h-6 text-white bg-green-500 rounded-full"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                        />
                                                    </svg>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div
                                    onMouseEnter={() => setShowActionMenu(false)}
                                    className="fixed inset-0 bg-gray-700 bg-opacity-50 top-13"
                                ></div>
                            </>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => scrollCalendarToToday()}
                    className="fixed z-40 hidden p-4 rounded-full cursor-pointer md:block bg-brand right-6 bottom-6 hover:shadow"
                >
                    <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </button>

                <div className="flex w-full h-full px-12">
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
                </div>
            </section>
        </Layout>
    )
}
