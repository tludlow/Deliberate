import Layout from '../../components/Layout'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { MouseSafeArea } from '@/components/MouseSafeArea'

export default function TeamActivity() {

    const calculateMonthsBetweenDates = () => {
        var startDate = moment().subtract(2, 'years')
        var endDate = moment().add(2, 'years')

        var result = []

        if (endDate.isBefore(startDate)) {
            throw 'End date must be greated than start date.'
        }

        while (startDate.isBefore(endDate)) {
            result.push(startDate.format('MMM YY'))
            startDate.add(1, 'month')
        }

        return result
    }

    const monthsToDisplay = calculateMonthsBetweenDates()

    useEffect(() => {
        //Get the current month and scroll it into the left most part of the view in the scrolling month calendar
        let today = moment().format('MMM YY')
        let thisMonth = document.getElementById(today.replace(' ', '-').toLowerCase())
        thisMonth?.scrollIntoView({ inline: 'start' })
    })
    return (
        <Layout title="Team Activities">
            {/* <div className="mt-12 px-6 py-2 bg-gray-200">
                <li className="flex justify-between activity-times">
                    <ul className="font-medium text-sm">7AM</ul>
                    <ul className="font-medium text-sm">8AM</ul>
                    <ul className="font-medium text-sm">9AM</ul>
                    <ul className="font-medium text-sm">10AM</ul>
                    <ul className="font-medium text-sm">11AM</ul>
                    <ul className="font-medium text-sm">12PM</ul>
                    <ul className="font-medium text-sm">1PM</ul>
                    <ul className="font-medium text-sm">2PM</ul>
                    <ul className="font-medium text-sm">3PM</ul>
                    <ul className="font-medium text-sm">4PM</ul>
                    <ul className="font-medium text-sm">5PM</ul>
                    <ul className="font-medium text-sm">6PM</ul>
                    <ul className="font-medium text-sm">7PM</ul>
                </li>
            </div> */}

            <section className="mt-12 ml-12 h-96 flex border border-gray-300 rounded">
                <div className="w-96 flex-shrink-0 bg-red-200"></div>
                <div
                    className="bg-red-300 min-w-screen flex overflow-x-scroll thin-scrollbar"
                    style={{ width: `${monthsToDisplay.length * 200}px` }}
                >
                    {monthsToDisplay.map((month, idx) => (
                        <div
                            id={month.replace(' ', '-').toLowerCase()}
                            key={idx}
                            className={`h-12 flex items-center justify-center ${
                                idx % 2 === 0 ? 'bg-gray-200' : 'bg-gray-300'
                            } ${moment().format('MMM YY') === month ? 'text-orange-500' : ''}`}
                            style={{ minWidth: '200px' }}
                        >
                            <span className="text-sm font-medium">{month}</span>
                        </div>
                    ))}
                </div>
            </section>

            
        </Layout>
    )
}
