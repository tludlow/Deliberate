import dayjs from 'dayjs'
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

    // prettier-ignore
    const calendar = useRef<HTMLElement>(null)
    const scrollHorizontally = (e: any) => {
        if (e.deltaY > 0) {
            // @ts-expect-error
            calendar.current.scrollLeft += 100
        } else {
            // @ts-expect-error
            calendar.current.scrollLeft -= 100
        }
    }

    useEffect(() => {
        //Find the calendar for today and scroll it into the center of the view port
        scrollCalendarToToday()

        document.documentElement.style.overflowY = 'hidden'

        window.addEventListener('wheel', scrollHorizontally)
        return () => {
            window.removeEventListener('wheel', scrollHorizontally)
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

    return (
        <Layout title="My Calendar" showSearch>
            <section
                ref={calendar}
                className="flex flex-shrink-0 w-full overflow-auto divide-x-0 divide-gray-400 h-within thin-scrollbar"
            >
                {/* Left occlusion */}
                <div className="fixed left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent h-within"></div>
                {/* Right occlusion */}
                <div className="fixed right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent h-within"></div>

                <div
                    onClick={() => scrollCalendarToToday()}
                    className="fixed flex items-center justify-center w-12 h-12 pt-1 rounded-full cursor-pointer bg-brand right-8 bottom-8 hover:shadow"
                >
                    <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                {days.map((day, i) => (
                    <Day key={i} day={day} />
                ))}
            </section>
        </Layout>
    )
}
