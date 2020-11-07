import dayjs from 'dayjs'
import Layout from '../components/Layout'
import { useEffect } from 'react'
import { CalendarIcon } from '@/components/icons'

export default function Calendar() {
    let now = dayjs()
    let days: dayjs.Dayjs[] = []
    for (let i = -6; i < 6; i++) {
        days.push(now.add(i, 'day'))
    }

    useEffect(() => {
        //Find the calendar for today and scroll it into the center of the view port
        scrollCalendarToToday()
    }, [])

    const scrollCalendarToToday = () => {
        let today = document.getElementById(now.format('D-MMMM-YYYY').toLowerCase())
        today?.scrollIntoView({ inline: 'center', behavior: 'smooth' })
    }

    return (
        <Layout title="My Calendar" showSearch>
            <section className="flex flex-shrink-0 w-full pt-2 space-x-1 overflow-auto h-within thin-scrollbar">
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
    let now = dayjs()
    useEffect(() => {
        console.log(now.format('D-MMMM-YYYY').toLowerCase())
        console.log('=', day.format('D-MMMM-YYYY').toLowerCase())
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
        </div>
    )
}
