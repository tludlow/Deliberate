import { ClockIcon, TeamIcon } from '@/components/icons'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from 'reducers/indexReducer'
import { PlusIcon } from '../components/icons/index'
import withAuthentication from '../components/HOC/withAuthentication'
import Team from '../components/dashboard/Team'
import { RecentActivity } from '../components/dashboard/RecentActivity'

export function Dashboard() {
    const user = useSelector((state: RootState) => state.user)
    return (
        <Layout title={user.username} contained>
            <section className="mt-4">
                <div className="flex items-center space-x-3">
                    <ClockIcon className="w-7 h-7 text-brand" />
                    <h3 className="text-xl font-bold">Recent Activity</h3>
                </div>
                <ul className="grid grid-cols-1 gap-5 mt-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                    <RecentActivity />
                    <RecentActivity />
                    <RecentActivity />
                    <RecentActivity />
                    <RecentActivity />
                </ul>
            </section>
            <section className="w-full mt-15">
                <div className="flex items-center justify-between">
                    <h3 className="flex items-center space-x-2 text-xl font-bold gap-x-3">
                        <TeamIcon className="w-7 h-7 text-brand" /> <span>My Teams</span>
                    </h3>
                    <CreateTeamButton />
                </div>

                <div>
                    <ul className="grid grid-cols-1 gap-5 mt-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                        <Team initials="DL" name="Deliberate" memberCount={1} />
                        <Team initials="CS" name="Chicken Shop" memberCount={2} />
                        <Team initials="UP" name="University Project" memberCount={5} />
                    </ul>
                </div>
            </section>
        </Layout>
    )
}

export default withAuthentication(Dashboard)

import { Menu, Transition } from '@headlessui/react'

function CreateTeamButton() {
    return (
        <div className="relative">
            <Menu>
                {({ open }) => (
                    <>
                        <Menu.Button as="span">
                            <button className="flex items-center px-3 py-2 text-sm font-medium text-white border rounded bg-brand border-brand-light hover:shadow hover:bg-brand-light">
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <span className="pl-2">Create Calendar</span>
                            </button>
                        </Menu.Button>

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
                                            <a
                                                href="#account-settings"
                                                className={`${
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                } flex  justify-between w-full px-4 py-2 text-medium text-sm leading-5 text-left`}
                                            >
                                                Team calendar
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
