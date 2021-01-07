import Layout from '@/components/Layout'
import InviteTeamMember from '@/components/modal/InviteTeamMember'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { UserAddIcon } from '../../components/icons/index'
import api from 'lib/api'
import useSWR from 'swr'
import LoadingSpinner from '@/components/LoadingSpinner'

interface TeamPageProps {
    teamName: string
}

export default function TeamPage({ teamName }: TeamPageProps) {
    const [open, setOpen] = useState(false)

    const closeModal = () => {
        setOpen(false)
    }

    const fetchTeamInformation = (url: string) => api.get(url)
    const { data, error } = useSWR(`/team/${teamName}`, fetchTeamInformation)

    if (error) {
        ;<Layout title={`${teamName}`} contained>
            <div className="mt-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{teamName}</h2>

                    <p className="text-lg font-bold text-red-500">Error loading team data...</p>
                </div>
            </div>
        </Layout>
    }

    useEffect(() => {
        console.log(data)
    }, [data])

    //design: https://dribbble.com/shots/11831844-Taskee-to-do-list
    return (
        <Layout title={`${teamName}`} contained>
            {open &&
                createPortal(
                    <InviteTeamMember isOpen={open} closeModal={closeModal} team={teamName as string} />,
                    document.body
                )}
            <div className="mt-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{teamName}</h2>

                    <div className="flex items-center justify-between space-x-3 sm:justify-start">
                        <div className="flex -space-x-2 overflow-hidden">
                            <img
                                className="inline-block rounded-full shadow w-7 h-7 ring-2 ring-white"
                                src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                width={28}
                                height={28}
                                alt=""
                            />
                            <img
                                className="inline-block rounded-full shadow w-7 h-7 ring-2 ring-white"
                                src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                width={28}
                                height={28}
                                alt=""
                            />
                            <img
                                className="inline-block rounded-full shadow w-7 h-7 ring-2 ring-white"
                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                                width={28}
                                height={28}
                                alt=""
                            />
                            <div className="flex items-center justify-center bg-white rounded-full shadow w-7 h-7">
                                <span className="text-sm font-medium text-gray-600">12</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(true)}
                            className="flex items-center px-3 py-1 space-x-1 text-sm border rounded-full border-brand hover:shadow hover:bg-white"
                        >
                            <UserAddIcon className="w-5 h-5" />
                            <span>Invite members</span>
                        </button>
                    </div>
                    <div>
                        <h5 className="mt-8 text-lg font-medium">Members</h5>
                        {!data ? (
                            <LoadingSpinner className="w-5 h-5 text-brand" />
                        ) : (
                            <ul>
                                {data?.data.members.map((member: any) => (
                                    <li key={member.id}>
                                        {member.id} - {member.first_name} {member.last_name} - {member.email}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

TeamPage.getInitialProps = async (ctx: any) => {
    return { teamName: ctx.query.name }
}
