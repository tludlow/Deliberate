import ModalHOC from './Modal'
import { RightArrowIcon } from '../icons/index'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

type TaskModalProps = {
    isOpen: boolean
    closeModal: () => void
    id: number
    title: string
    start: string
    end: string
}

export default function TaskModal({ isOpen, closeModal, id, title, start, end }: TaskModalProps) {
    return (
        <ModalHOC isOpen={isOpen} closeModal={closeModal} modalWidth="w-full md:w-1/2 lg:w-1/3">
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
                <h3 className="text-xl font-bold text-center">{title}</h3>
                <div className="flex justify-between">
                    <p className="flex items-center text-xs font-medium text-gray-500">
                        {start} <RightArrowIcon className="w-4 h-4 mx-1 font-normal text-gray-400" /> {end}
                    </p>
                    <p className="text-xs font-medium text-gray-500">{dayjs().to(dayjs().add(2, 'hour'))}</p>
                </div>

                <div className=""></div>
            </div>
        </ModalHOC>
    )
}
