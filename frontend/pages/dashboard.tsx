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
                    <Link href="/team/create">
                        <span className="flex items-center px-3 py-2 space-x-3 text-white rounded cursor-pointer bg-brand hover:bg-brand-light ring-0">
                            <PlusIcon className="w-6 h-6" />
                            <span>Create Team</span>
                        </span>
                    </Link>
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
