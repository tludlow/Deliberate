import Layout from '@/components/Layout'
import { useRouter } from 'next/router'

export default function TeamInvite() {
    const router = useRouter()
    //ID of the invite, corresponds to the backend invite object
    const { id } = router.query

    const teamName = 'Classic Cats'
    return (
        <Layout contained>
            <section className="mt-12 flex flex-col items-center">
                <h3 className="text-xl">You have been invited to the team</h3>
                <div className="my-8 flex flex-col items-center">
                    <img
                        className="h-15 w-15 rounded-full border border-gray-400"
                        src="https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt={`${teamName}'s Team Image`}
                    />
                    <span className="text-lg font-bold">{teamName}</span>
                </div>
                <div className="mt-66 flex justif-end space-x-4">
                    <button className="px-5 h-12 bg-red-500 text-white rounded hover:shadow">Decline</button>
                    <button className="px-5 h-12 bg-green-500 text-white rounded hover:shadow">Accept</button>
                </div>
            </section>
        </Layout>
    )
}
