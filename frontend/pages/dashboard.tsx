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
                </ul>
            </section>
            <section className="w-full mt-15">
                <h3 className="flex items-center space-x-2 text-xl font-bold gap-x-3">
                    <TeamIcon className="w-7 h-7 text-brand" /> <span>My Teams</span>
                </h3>
                {/* <div className="grid grid-cols-12 mt-4 gap-x-3">
                    <div className="flex col-span-2 overflow-hidden bg-white border border-gray-100 rounded shadow">
                        <div className="flex items-center justify-center w-12 h-full bg-brand">
                            <span className="text-lg font-bold text-white">TL</span>
                        </div>
                        <div className="flex-1 px-2 py-2">
                            <p className="font-medium truncate">Deliberate is so so so cool wowi1</p>
                            <p className="text-sm text-gray-600">12 Members</p>
                        </div>
                        <div className="flex items-center justify-center w-8 h-full">
                            <button>
                                <svg
                                    className="w-6 h-6 text-gray-600 hover:text-gray-800"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div> */}

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
