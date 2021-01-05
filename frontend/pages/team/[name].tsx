import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import { UserAddIcon } from '../../components/icons/index'

export default function TeamPage() {
    const router = useRouter()
    let teamName = router.query.name

    //design: https://dribbble.com/shots/11831844-Taskee-to-do-list
    return (
        <Layout title={`${teamName}`} contained>
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
                        <button className="flex items-center px-3 py-1 space-x-1 text-sm border rounded-full border-brand hover:shadow hover:bg-white">
                            <UserAddIcon className="w-5 h-5" />
                            <span>Invite members</span>
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
