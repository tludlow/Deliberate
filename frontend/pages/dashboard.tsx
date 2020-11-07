import { ClockIcon, TeamIcon } from '@/components/icons'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from 'reducers/indexReducer'
import { PlusIcon } from '../components/icons/index'
import withAuthentication from '../components/HOC/withAuthentication'

export function Dashboard() {
    const user = useSelector((state: RootState) => state.user)
    return (
        <Layout title={user.username} contained showSearch>
            <section className="grid w-full grid-cols-12 mt-2">
                <article className="col-span-4 ">
                    <h3 className="flex items-center space-x-2 text-xl font-bold">
                        <ClockIcon className="w-7 h-7 text-brand" /> <span>Recent Activity</span>
                    </h3>
                    <div className="mt-1 space-y-3 overflow-auto h-52 thin-scrollbar">
                        <div className="flex items-center justify-between w-full px-3 py-1 border border-gray-400 rounded">
                            <PlusIcon className="w-8 h-8 text-gray-600" />
                            <p className="text-lg font-medium">New Issue</p>
                            <button className="p-1 text-sm text-white rounded bg-brand-light hover:shadow">More</button>
                        </div>
                        <div className="flex items-center justify-between w-full px-3 py-1 border border-gray-400 rounded">
                            <PlusIcon className="w-8 h-8 text-gray-600" />
                            <p className="text-lg font-medium">New Issue</p>
                            <button className="p-1 text-sm text-white rounded bg-brand-light hover:shadow">More</button>
                        </div>
                        <div className="flex items-center justify-between w-full px-3 py-1 border border-gray-400 rounded">
                            <PlusIcon className="w-8 h-8 text-gray-600" />
                            <p className="text-lg font-medium">New Issue</p>
                            <button className="p-1 text-sm text-white rounded bg-brand-light hover:shadow">More</button>
                        </div>
                        <div className="flex items-center justify-between w-full px-3 py-1 border border-gray-400 rounded">
                            <PlusIcon className="w-8 h-8 text-gray-600" />
                            <p className="text-lg font-medium">New Issue</p>
                            <button className="p-1 text-sm text-white rounded bg-brand-light hover:shadow">More</button>
                        </div>
                        <div className="flex items-center justify-between w-full px-3 py-1 border border-gray-400 rounded">
                            <PlusIcon className="w-8 h-8 text-gray-600" />
                            <p className="text-lg font-medium">New Issue</p>
                            <button className="p-1 text-sm text-white rounded bg-brand-light hover:shadow">More</button>
                        </div>
                    </div>
                </article>
                <div className="col-span-8"></div>
            </section>
            <section className="w-full mt-8">
                <h3 className="flex items-center space-x-2 text-xl font-bold">
                    <TeamIcon className="w-7 h-7 text-brand" /> <span>My Teams</span>
                </h3>
                <div className="flex mt-2 space-x-5">
                    <div className="flex flex-col w-48 h-48 border border-gray-300 rounded"></div>
                    <div className="flex flex-col items-center justify-between w-48 h-48 p-2 border border-gray-300 rounded">
                        <h4 className="text-lg font-medium text-brand">One Team</h4>
                        <p className="text-sm text-center text-gray-600">This is some ranndom team description</p>
                        <Link href="/wow">
                            <a className="p-1 text-white rounded bg-brand hover:shadow" href="/wow">
                                Team Page
                            </a>
                        </Link>
                    </div>
                    <div className="flex flex-col items-center w-48 h-48 border border-gray-300 rounded"></div>
                </div>
            </section>
        </Layout>
    )
}

export default withAuthentication(Dashboard)
