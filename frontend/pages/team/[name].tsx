import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
dayjs.extend(relativeTime)

import Layout from '@/components/Layout'
import InviteTeamMember from '@/components/modal/InviteTeamMember'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import api from 'lib/api'
import useSWR from 'swr'
import Image from 'next/image'
import { UserAddIcon } from '../../components/icons/index'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const teamName = context.query.name

    return { props: { teamName } }
}

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
        return (
            <Layout title={`${teamName}`} contained>
                <div className="mt-4">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">{teamName}</h2>

                        <p className="text-lg font-bold text-red-500">Error loading team data...</p>
                    </div>
                </div>
            </Layout>
        )
    }

    useEffect(() => {
        console.log(data)
    }, [data])

    return (
        <Layout title={`${teamName}`}>
            {open &&
                createPortal(
                    <InviteTeamMember isOpen={open} closeModal={closeModal} team={teamName as string} />,
                    document.body
                )}
            <div className="grid grid-cols-12 gap-x-3">
                <div className="w-full col-span-2 p-6 h-within bg-brand-light"></div>
                <div className="w-full col-span-7 p-6 h-within">
                    <h3 className="my-1 text-4xl font-bold leading-6">{teamName}</h3>
                    <span className="text-sm text-gray-400">Created {dayjs(data?.data.created_at).fromNow()}</span>
                </div>
                <div className="w-full col-span-3 p-6 bg-white shadow h-within">
                    <div className="flex items-center justify-between pb-1 mb-2 border-b border-gray-300">
                        <h5 className="text-xl font-bold">Members</h5>
                        <button
                            onClick={() => setOpen(true)}
                            className="flex items-center px-2 py-1 space-x-1 text-xs font-medium text-white bg-green-400 rounded-full bg-opacity-90 hover:shadow hover:bg-green-500"
                        >
                            <UserAddIcon className="w-4 h-4" /> <span>Invite</span>
                        </button>
                    </div>
                    <div className="space-y-2">
                        {data?.data.members.map((member: any, i) => (
                            <TeamMember
                                key={i}
                                member_id={member.id}
                                name={`${member.first_name} ${member.last_name}`}
                                role={member.permission}
                                added_at={dayjs(member.joined_at).from()}
                                user_permission={data?.data.team_permission}
                                team_name={data?.data.team_name}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

function TeamMember({ name, role, added_at, user_permission, team_name, member_id }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <Image
                    className="hidden border border-gray-600 rounded-full shadow md:block"
                    src="https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    width={50}
                    height={50}
                />
                <div>
                    <h6 className="font-semibold leading-3 text-gray-700">{name}</h6>
                    <p className="-ml-px text-gray-400">{added_at}</p>
                </div>
            </div>
            <MemberPermissionSelect
                role={role}
                user_permission={user_permission}
                team_name={team_name}
                member_id={member_id}
            />
        </div>
    )
}

export function MemberPermissionSelect({ role, user_permission, team_name, member_id }) {
    const [memberRole, setMemberRole] = useState(role)

    const onSelectChange = async (e: any) => {
        const { value } = e.target
        setMemberRole(value)
        api.post(`/team/${team_name}/permission`, { new_permission: value, updating_id: member_id })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    if (user_permission === 'regular') {
        return (
            <p
                className={`p-2 py-0.5 rounded-full border cursor-pointer text-white text-xs ${
                    role === 'admin' ? 'bg-red-500 border-red-400' : 'bg-brand-light border-brand'
                }`}
            >
                <span>{role}</span>
            </p>
        )
    } else {
        return (
            <select
                className="text-xs form-select"
                name="permission"
                id="permission"
                onChange={(e) => onSelectChange(e)}
                defaultValue={memberRole}
                value={memberRole}
            >
                <option value="regular">Regular</option>
                <option className="text-red-500" value="admin">
                    Admin
                </option>
            </select>
        )
    }
}
