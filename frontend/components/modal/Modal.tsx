import { Transition } from '@headlessui/react'
import { CloseIcon } from '../icons/index'

type ModalHOCProps = {
    isOpen: boolean
    closeModal: () => void
    children: React.ReactNode
    modalWidth: string
}

const ModalHOC = ({ children, isOpen, closeModal, modalWidth }: ModalHOCProps) => {
    return (
        <Transition show={isOpen}>
            <div
                id="modal-wrapper"
                className="fixed inset-x-0 bottom-0 px-4 pb-6 z-60 sm:inset-0 sm:p-0 sm:flex sm:items-center sm:justify-center"
            >
                <Transition.Child
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div onClick={() => closeModal()} className="fixed inset-0 transition-opacity">
                        <div className="absolute inset-0 bg-gray-800 opacity-80"></div>
                    </div>
                </Transition.Child>

                <Transition.Child
                    className={`mx-auto ${modalWidth}`}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <div
                        className="relative px-4 pt-5 pb-4 mx-auto transition-all transform bg-white rounded-lg shadow-xl sm:max-w-lg sm:w-full md:max-w-xl lg:max-w-3xl xl:max-w-4xl sm:p-6"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-headline"
                    >
                        {/* X button to close modal */}
                        <button
                            onClick={() => closeModal()}
                            className="absolute p-2 rounded-full cursor-pointer hover:bg-gray-200 right-2 top-2"
                        >
                            <CloseIcon className="w-5 h-5" />
                        </button>
                        {children}
                    </div>
                </Transition.Child>
            </div>
        </Transition>
    )
}

export default ModalHOC
