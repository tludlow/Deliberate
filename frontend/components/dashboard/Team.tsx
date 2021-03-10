import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'

type TeamType = {
    initials: string
    name: string
    memberCount: number
}

export default function Team({ initials, name, memberCount }: TeamType) {
    const initialColours = ['bg-pink-600', 'bg-green-600', 'bg-red-600', 'bg-blue-600', 'bg-indigo-600']
    const chosenColour = initialColours[Math.floor(Math.random() * initialColours.length)]

    return (
        <li className="relative flex items-center col-span-1 bg-white border border-gray-200 rounded-md shadow-sm">
            <div
                className={`flex items-center justify-center flex-shrink-0 w-16 h-16 text-sm font-medium leading-5 text-center text-white rounded-md rounded-r-none ${chosenColour}`}
            >
                {initials}
            </div>
            <div className="flex-1 px-4 py-2 truncate">
                <a
                    href="#"
                    className="text-sm font-medium leading-5 text-gray-900 transition duration-150 ease-in-out hover:text-gray-600"
                >
                    {name}
                </a>
                {memberCount === 1 ? (
                    <p className="text-sm leading-5 text-gray-500">{memberCount} Member</p>
                ) : (
                    <p className="text-sm leading-5 text-gray-500">{memberCount} Members</p>
                )}
            </div>
            <Menu>
                {({ open }) => (
                    <>
                        <span className="rounded-md">
                            <Menu.Button as="div" className="border-none shadow-none">
                                <div className="flex-shrink-0 pr-2">
                                    <button>
                                        <div className="inline-flex items-center justify-center w-8 h-8 text-gray-400 transition duration-150 ease-in-out bg-transparent rounded-full hover:text-gray-500 focus:outline-none focus:text-gray-500 focus:bg-gray-100">
                                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                            </svg>
                                        </div>
                                    </button>
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
                                className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                            >
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link href="/team/[name]/calendar" as={`/team/${name}/calendar`}>
                                                <a
                                                    href={`/team/${name}/calendar`}
                                                    className={`${
                                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                    } flex  justify-between w-full px-4 py-2 text-medium text-sm leading-5 text-left`}
                                                >
                                                    Team calendar
                                                </a>
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link href={`/team/${name}`}>
                                                <a
                                                    href={`/team/${name}`}
                                                    className={`${
                                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                    } hover:bg-gray-100 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                                                >
                                                    Team information
                                                </a>
                                            </Link>
                                        )}
                                    </Menu.Item>
                                </div>

                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="#sign-out"
                                                className={`${
                                                    active ? 'bg-gray-100 text-red-700' : 'text-red-600'
                                                } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                                            >
                                                Leave team
                                            </a>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </>
                )}
            </Menu>
        </li>
    )
}
