import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

import Layout from '../components/Layout'
import { useEffect, useRef } from 'react'
import { CalendarIcon } from '@/components/icons'
import Day from '../components/calendar/Day'

export default function Calendar() {
    let now = dayjs()
    let days: dayjs.Dayjs[] = []
    for (let i = -6; i <= 6; i++) {
        days.push(now.add(i, 'day'))
    }

    const calendarData = [
        {
            day: '01-02-2021',
            start: 9,
            end: 18,
            tasks: [{ title: 'Wake up! 🛏', start: '9:00 AM', end: '9:30 AM' }],
        },
        {
            day: '02-02-2021',
            start: 9,
            end: 18,
            tasks: [
                { title: 'Scrum standup', start: '9:30 AM', end: '10:30 AM' },
                { title: 'Finish homework 📚', start: '12:00 PM', end: '1:00 PM' },
                { title: 'Have lunch with the bros', start: '1:00 PM', end: '2:15 PM' },
            ],
        },
        {
            day: '03-02-2021',
            start: 9,
            end: 17,
            tasks: [{ title: 'Prepare dissertation', start: '9:00 AM', end: '11:30 AM' }],
        },
        {
            day: '04-02-2021',
            start: 9,
            end: 18,
            tasks: [{ title: 'Call with bryan 📲', start: '10:20 AM', end: '11:05 AM' }],
        },
        {
            day: '05-02-2021',
            start: 9,
            end: 19,
            tasks: [
                { title: 'Scrum standup', start: '9:30 AM', end: '10:30 AM' },
                { title: 'Finish homework 📚', start: '12:00 PM', end: '1:00 PM' },
                { title: 'Have lunch with the bros', start: '1:00 PM', end: '2:15 PM' },
            ],
        },
    ]

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

    useEffect(() => {
        //Find the calendar for today and scroll it into the center of the view port
        scrollCalendarToToday()

        //Make the scrolling be horizontal on this page
        document.documentElement.style.overflowY = 'hidden'

        window.addEventListener('wheel', scrollHorizontally)
        window.addEventListener('resize', scrollCalendarToToday)

        return () => {
            window.removeEventListener('wheel', scrollHorizontally)
            window.removeEventListener('resize', scrollCalendarToToday)
        }
    }, [])

    const scrollCalendarToToday = () => {
        let today = document.getElementById(now.format('D-MMMM-YYYY').toLowerCase())
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

    return (
        <Layout title="My Calendar" showSearch>
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

                <div
                    onClick={() => scrollCalendarToToday()}
                    className="fixed z-40 p-4 rounded-full cursor-pointer bg-brand right-6 bottom-6"
                >
                    <CalendarIcon className="w-6 h-6 text-white" />
                </div>

                <div className="flex w-full h-full px-12">
                    {calendarData.map((day, i) => (
                        <Day
                            key={i}
                            day={dayjs(day.day, 'DD-MM-YYYY')}
                            now={now.hour(14).minute(15)}
                            startHour={day.start}
                            endHour={day.end}
                            tasks={day.tasks}
                        />
                    ))}
                    {/* {days.map((day, i) => (
                        
                    ))} */}
                </div>
            </section>
        </Layout>
    )
}
