import { Transition } from '@headlessui/react'

const TaskModal: React.FC<{ isOpen: boolean; id: number; closeModal: () => void }> = ({ isOpen, id, closeModal }) => {
    return (
        <Transition show={isOpen}>
            <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-6 sm:inset-0 sm:p-0 sm:flex sm:items-center sm:justify-center">
                <Transition.Child
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div onClick={() => closeModal()} className="fixed inset-0 transition-opacity">
                        <div className="absolute inset-0 bg-gray-700 opacity-75"></div>
                    </div>
                </Transition.Child>

                <Transition.Child
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <div
                        className="px-4 pt-5 pb-4 overflow-hidden transition-all transform bg-white rounded-lg shadow-xl sm:max-w-lg sm:w-full md:max-w-xl lg:max-w-3xl xl:max-w-6xl sm:p-6"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-headline"
                    >
                        <div>
                            <div className="flex justify-center">
                                <svg
                                    className="w-10 h-10 text-red-500 "
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-5">
                                <h3 className="text-xl font-medium leading-6 text-gray-900" id="modal-headline">
                                    Remove task <span className="font-bold">{id}</span>
                                </h3>
                                <div className="mt-2">
                                    <p className="leading-5 text-gray-500 ">
                                        Are you sure you want to remove this task from your calendar? Once it's removed
                                        <span className="font-medium"> you can't get it backed!</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                            <span className="flex w-full rounded-md shadow-sm sm:col-start-2">
                                <button
                                    type="button"
                                    className="inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:border-red-700 focus:shadow-outline-indigo sm:text-sm sm:leading-5"
                                >
                                    Remove Task
                                </button>
                            </span>
                            <span className="flex w-full mt-3 rounded-md shadow-sm sm:mt-0 sm:col-start-1">
                                <button
                                    onClick={() => closeModal()}
                                    type="button"
                                    className="inline-flex justify-center w-full px-4 py-2 text-base font-medium leading-6 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue sm:text-sm sm:leading-5"
                                >
                                    Cancel
                                </button>
                            </span>
                        </div>
                    </div>
                </Transition.Child>
            </div>
        </Transition>
    )
}
export default TaskModal
