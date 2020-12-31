import ModalHOC from './Modal'
import { RightArrowIcon } from '../icons/index'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const TaskModal: React.FC<{ isOpen: boolean; id: number; closeModal: () => void }> = ({ isOpen, id, closeModal }) => {
    return (
        <ModalHOC isOpen={isOpen} closeModal={closeModal}>
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
            <div className="mt-3">
                <h3 className="text-lg font-bold text-center">Coffee with Chloe</h3>
                <div className="flex justify-between">
                    <p className="flex items-center text-xs font-medium text-gray-500">
                        12 PM <RightArrowIcon className="w-4 h-4 mx-1 font-normal text-gray-400" /> 1 PM
                    </p>
                    <p className="text-xs font-medium text-gray-500">{dayjs().to(dayjs().add(2, 'hour'))}</p>
                </div>
            </div>
        </ModalHOC>
    )
}
export default TaskModal
