import { Menu, Transition } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import { logoutUser } from 'actions/auth/userActions'
import { useDispatch } from 'react-redux'
import { CalendarIcon } from '../icons'

type DropdownProps = {
    username: string
}

export default function Dropdown({ username }: DropdownProps) {
    const dispatch = useDispatch()
    return (
        <div className="relative" tabIndex={0}>
            <Menu>
                {({ open }) => (
                    <>
                        <span className="rounded-md">
                            <Menu.Button as="div" className="border-none shadow-none cursor-pointer">
                                <div className="flex items-center">
                                    <Image
                                        className="w-8 h-8 border rounded-full group-hover:border-gray-100 group-hover:shadow"
                                        src="/defaultimage.webp"
                                        alt="James Dean"
                                        width={32}
                                        height={32}
                                    />
                                    <span className="ml-2 text-white group-hover:text-gray-200">{username}</span>
                                    <svg
                                        className="h-4 w-4 ml-2 text-white pt-0.5 group-hover:text-gray-200"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
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
                                className="absolute right-0 z-10 w-64 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg outline-none"
                            >
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="/calendar"
                                            className={`${
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                            } hover:bg-gray-100 flex items-center space-x-2 w-full px-4 py-2 text-sm leading-5 text-left`}
                                        >
                                            <CalendarIcon className="w-5 h-5" />
                                            <span>My Calendar</span>
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link href="/settings">
                                            <a
                                                href="/settings"
                                                className={`${
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                } hover:bg-gray-100 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                                            >
                                                Settings
                                            </a>
                                        </Link>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={() => dispatch(logoutUser())}
                                            className={`${
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                            } hover:bg-gray-100 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left font-medium`}
                                        >
                                            Logout
                                        </button>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Transition>
                    </>
                )}
            </Menu>
        </div>
    )
}
