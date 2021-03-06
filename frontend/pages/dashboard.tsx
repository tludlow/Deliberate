import { ClockIcon, TeamIcon } from '@/components/icons'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from 'reducers/indexReducer'
import { PlusIcon } from '../components/icons/index'
import withAuthentication from '../components/HOC/withAuthentication'
import Team from '../components/dashboard/Team'
import { RecentActivity } from '../components/dashboard/RecentActivity'
import api from 'lib/api'
import useSWR from 'swr'
import LoadingSpinner from '@/components/LoadingSpinner'

export function Dashboard() {
    const user = useSelector((state: RootState) => state.user)

    const fetchUserDashboard = (url: string) => api.get(url)
    const { data, error } = useSWR(`/user/dashboard`, fetchUserDashboard)

    if (error) {
        return (
            <Layout title={user.username} contained>
                <p>Error loading dashboard data</p>
            </Layout>
        )
    }
    return (
        <Layout title={user.username} contained>
            <section className="mt-4">
                {/* <Link href="/calendar">
                    <a href="/calendar" className="mb-2 underline text-brand hover:text-brand-light">
                        My Calendar
                    </a>
                </Link> */}
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
                        {!data ? (
                            <LoadingSpinner className="w-7 h-7 text-brand" />
                        ) : (
                            data.data.teams.map((team: any, i: number) => (
                                <Team key={i} initials="DL" name={team.name} memberCount={Number(team.member_count)} />
                            ))
                        )}
                    </ul>
                </div>
            </section>
        </Layout>
    )
}

export default withAuthentication(Dashboard)
