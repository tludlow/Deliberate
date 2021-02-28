import ModalHOC from './Modal'
import { EditIcon, RightArrowIcon, TrashIcon } from '../icons/index'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { createPortal } from 'react-dom'
import EditTaskModal from './EditTaskModal'
import { useState } from 'react'
dayjs.extend(relativeTime)

type TaskModalProps = {
    isOpen: boolean
    closeModal: () => void
    id: number
    title: string
    description: string
    date: dayjs.Dayjs
    start: string
    end: string
}

export default function TaskModal({ isOpen, closeModal, id, title, description, date, start, end }: TaskModalProps) {
    const [editOpen, setEditOpen] = useState(false)

    const closeEditTaskModal = () => {
        setEditOpen(false)
    }

    return (
        <>
            {editOpen &&
                createPortal(
                    <EditTaskModal
                        isOpen={editOpen}
                        closeModal={closeEditTaskModal}
                        id={id}
                        title={title}
                        description={description}
                        date={date}
                        start_time={start}
                        end_time={end}
                    />,
                    document.body
                )}
            <ModalHOC isOpen={isOpen} closeModal={closeModal} modalWidth="w-full lg:w-1/2 xl:w-5/12">
                <div className="absolute inset-x-0 flex justify-center -mt-12">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-500 border-2 border-white rounded-full">
                        <svg
                            className="text-white w-9 h-9"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                    </div>
                </div>
                <div className="mt-5">
                    <h3 className="text-xl font-bold text-center">
                        {title}{' '}
                        <button>
                            <TrashIcon className="w-4 h-4 text-red-500 hover:text-red-600" />
                        </button>
                    </h3>
                    <div className="flex items-center justify-between">
                        <p className="flex items-center flex-1 text-xs font-medium text-gray-500">
                            <span className="flex items-center mr-3">
                                {start} <RightArrowIcon className="w-4 h-4 mx-1 font-normal text-gray-400" /> {end}{' '}
                            </span>
                            <button onClick={() => setEditOpen(true)}>
                                <EditIcon className="w-4 h-4 text-gray-700 hover:text-gray-500" />
                            </button>
                        </p>
                        <a
                            className="text-sm font-semibold text-blue-600 hover:underline"
                            href="https://github.com"
                            target="_blank"
                        >
                            View on GitHub
                        </a>
                        <p className="flex justify-end flex-1 text-xs font-medium text-gray-500">
                            {dayjs().to(dayjs().add(2, 'hour'))}
                        </p>
                    </div>

                    <div className="mt-6">
                        <p className="leading-tight text-center text-gray-600">{description}</p>
                    </div>
                </div>
            </ModalHOC>
        </>
    )
}
