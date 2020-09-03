import Layout from '../../components/Layout'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

export default function TeamActivity() {
    return (
        <Layout title="Team Activities">
            <div className="mt-12 px-6 py-2 bg-gray-200">
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
            </div>
            <section>
                <div className="h-24 w-64 bg-red-500" draggable="true"></div>
            </section>
        </Layout>
    )
}
