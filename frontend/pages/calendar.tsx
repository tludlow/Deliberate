import dayjs from 'dayjs'
import Layout from '../components/Layout'
import { useEffect, useRef, useState } from 'react'
import { CalendarIcon } from '@/components/icons'

import { createPortal } from 'react-dom'

import RemoveTaskModal from '@/components/modal/RemoveTaskModal';

export default function Calendar() {
    let now = dayjs()
    let days: dayjs.Dayjs[] = []
    for (let i = -6; i < 6; i++) {
        days.push(now.add(i, 'day'))
    }

    //prettier-ignore
    const calendar = useRef<HTMLElement>()
    const scrollHorizontally = (e: any) => {
        if (calendar) {
            if (e.deltaY > 0) calendar.current.scrollLeft += 100
            else calendar.current.scrollLeft -= 100
        }
    }

    useEffect(() => {
        //Find the calendar for today and scroll it into the center of the view port
        scrollCalendarToToday()

        document.documentElement.style.overflowY = 'hidden'; 

        window.addEventListener("wheel", scrollHorizontally)
        return () => {
            window.removeEventListener("wheel", scrollHorizontally)
        }
    }, [])

    const scrollCalendarToToday = () => {
        let today = document.getElementById(now.format('D-MMMM-YYYY').toLowerCase())
        today?.scrollIntoView({ inline: 'center', behavior: 'smooth' })
    }

    const handleScroll = (e: any) => {
        let width = calendar.current?.getBoundingClientRect()["width"]
        let scrollWidth = calendar.current?.scrollWidth
        let scrollLeft = calendar.current?.scrollLeft
		// const scrollWidth = $('#scrollquestion')[0].scrollWidth;	
      	// const scrollLeft = $('#scrollquestion').scrollLeft();
        
    //   if($scrollWidth - $width === $scrollLeft){
    //     alert('right end');
    //   }
    //   if($scrollLeft===0){
    //     alert('left end');
    //   }
    // console.log("Width: ", width)
    // console.log("Scroll Left: ", scrollLeft)
    // console.log("Scroll Width: ", scrollWidth)
    // console.log("-------------")

    if (width + scrollLeft === scrollWidth) {
        console.log("right")
    }
    if(scrollLeft === 0) {
        console.log("left")
    }
      }

    return (
        <Layout title="My Calendar" showSearch>
            <section
                ref={calendar}
                className="flex flex-shrink-0 w-full space-x-1 overflow-auto h-within thin-scrollbar"
                onScroll={handleScroll}
            >
                <div className="fixed left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent h-within"></div>
                <div className="fixed right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent h-within"></div>
                <div
                    onClick={() => scrollCalendarToToday()}
                    className="fixed flex items-center justify-center w-12 h-12 rounded-full cursor-pointer bg-brand right-8 bottom-8 hover:shadow"
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

const Day: React.FC<{ day: dayjs.Dayjs }> = ({ day }) => {

    const [isRemoveOpen, setIsRemoveOpen] = useState(false)
    const closeModal = () => {
        setIsRemoveOpen(false)
    }

    let now = dayjs()
    useEffect(() => {
        console.log(now.format('D-MMMM-YYYY').toLowerCase())
    }, [])
    return (
        <div
            id={day.format('D-MMMM-YYYY').toLowerCase()}
            className={`flex flex-col items-center flex-shrink-0 h-full p-2 border ${
                day.format('D-MMMM-YYYY').toLowerCase() === now.format('D-MMMM-YYYY').toLowerCase()
                    ? 'border-brand'
                    : 'border-gray-200'
            } w-96`}
        >
            <span className="font-bold">{day.format('D MMMM')}</span>

            <button onClick={()=> setIsRemoveOpen(!isRemoveOpen)} className="p-2 mt-6 border rounded border-brand">Open modal</button>

            {isRemoveOpen &&
                createPortal(<RemoveTaskModal isOpen={isRemoveOpen} closeModal={closeModal} id={Number(day.format('D-MMMM-YYYY').toLowerCase().split("-")[0])}/>, document.body)
            }
        </div>
    )
}
