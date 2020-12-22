import { Menu, Transition } from '@headlessui/react'
import { BellIcon } from '../icons'
import Image from 'next/image'

export default function Notifications() {
    return (
        <div className="relative">
            <Menu>
                {({ open }) => (
                    <>
                        <span className="rounded-md">
                            <Menu.Button as="div" className="border-none shadow-none">
                                <div className="relative cursor-pointer">
                                    <BellIcon className="text-white w-7 h-7 hover:text-gray-200 hover:shadow" />
                                    <div className="absolute bottom-0 right-0 flex items-center justify-center w-4 h-4 bg-red-500 rounded-full">
                                        <span className="text-sm text-white">1</span>
                                    </div>
                                </div>
                            </Menu.Button>
                        </span>

                        <Transition
                            show={open}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items
                                static
                                className="absolute right-0 z-10 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none w-96"
                            >
                                <div className="flex justify-between px-4 py-3">
                                    <h3 className="text-xl font-bold text-gray-800">Notifications</h3>
                                    <button className="text-xs font-medium text-brand hover:text-brand-light">
                                        Mark all as read
                                    </button>
                                </div>
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="#account-settings"
                                                className={`${
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                } flex justify-between w-full px-4 py-2 text-medium text-sm leading-5 text-left`}
                                            >
                                                <div className="flex-none">
                                                    <Image
                                                        className="border border-gray-600 rounded-full shadow"
                                                        src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                        width={50}
                                                        height={50}
                                                    />
                                                </div>
                                                <div className="flex-1 px-2">
                                                    <h4 className="text-lg font-bold leading-none">Jessi Stevens</h4>
                                                    <p className="mt-1 leading-tight text-gray-400">
                                                        Marked the task <span className="text-brand">bug fixing</span>
                                                    </p>
                                                </div>
                                                <div className="flex-none">
                                                    <p className="text-xs text-gray-400 tracking-tightest">
                                                        15 min ago
                                                    </p>
                                                </div>
                                            </a>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </>
                )}
            </Menu>
        </div>
    )
}
