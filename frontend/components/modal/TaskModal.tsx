import ModalHOC from './Modal'
import { EditIcon, GithubIcon, RightArrowIcon, TrashIcon, UserIcon } from '../icons/index'
import api from 'lib/api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { createPortal } from 'react-dom'
import EditTaskModal from './EditTaskModal'
import { useEffect, useState } from 'react'
dayjs.extend(relativeTime)
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

type TaskModalProps = {
    isOpen: boolean
    closeModal: () => void
    id: number
    title: string
    description: string
    date: dayjs.Dayjs
    start: string
    end: string
    type: string
}

export default function TaskModal({
    isOpen,
    closeModal,
    id,
    title,
    description,
    date,
    start,
    end,
    type,
}: TaskModalProps) {
    const [editOpen, setEditOpen] = useState(false)

    const closeEditTaskModal = () => {
        setEditOpen(false)
    }

    const deleteTask = () => {
        api.post('/calendar/task/delete', { task_id: id })
            .then((response) => {
                console.log(response)
                closeModal()
                location.reload()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        console.log(`${date.format('YYYY-MM-DD')} ${start}`)
    }, [])

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
                        {type === 'github' && <GithubIcon className="text-white w-9 h-9" />}
                        {type === 'personal' && <UserIcon className="text-white w-9 h-9" />}
                    </div>
                </div>
                <div className="mt-5">
                    <h3 className="text-xl font-bold text-center">
                        {title}{' '}
                        <button onClick={() => deleteTask()}>
                            <TrashIcon className="w-4 h-4 text-red-500 hover:text-red-600" />
                        </button>
                    </h3>
                    <div className="flex items-center justify-between">
                        <p className="flex items-center flex-1 text-xs font-medium text-gray-500">
                            <span className="flex items-center mr-3">
                                {dayjs(start, 'HH:mm A').format('h:mm A')}{' '}
                                <RightArrowIcon className="w-4 h-4 mx-1 font-normal text-gray-400" />{' '}
                                {dayjs(end, 'HH:mm A').format('h:mm A')}{' '}
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
                            {dayjs().to(
                                dayjs(`${date.format('YYYY-MM-DD')} ${start.split(' ')[0]}`, 'YYYY-MM-DD HH:mm')
                            )}
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
