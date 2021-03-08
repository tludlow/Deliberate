import Layout from '@/components/Layout'
import { useEffect } from 'react'
import api from 'lib/api'
import withAuthentication from '@/components/HOC/withAuthentication'
import useSWR from 'swr'
import { GithubIcon } from '@/components/icons'

const fetcher = (url: string) => api.get(url).then((res) => res.data)
function Connections() {
    const { data, error } = useSWR('/auth/github/connected', fetcher)

    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    if (!data.connected) {
        return (
            <Layout title="Connections" contained>
                <div className="mt-8 space-y-4">
                    <h4 className="text-xl font-bold">Connections</h4>
                    <div className="flex items-center mt-4 space-x-3">
                        <GithubIcon className="w-12 h-12 text-black" />
                        <p className="text-lg font-bold">GitHub</p>
                        <span>-</span>
                        <p className="text-red-500">Disconnected</p>
                        <button className="px-2 py-1 ml-6 text-white bg-red-600 rounded hover:bg-red-500 hover:shadow">
                            Connect now
                        </button>
                    </div>
                    <div className="">Coming soon...</div>
                    <div className="">Coming soon...</div>
                </div>
            </Layout>
        )
    } else {
        return (
            <Layout title="Connections" contained>
                <div className="mt-8 space-y-4">
                    <h4 className="text-xl font-bold">Connections</h4>
                    <div className="grid grid-cols-3 gap-x-4">
                        <div className="flex items-center space-x-3">
                            <GithubIcon className="w-12 h-12 text-black" />
                            <p className="text-lg font-bold">GitHub</p>
                            <span>-</span>
                            <p className="text-green-500">Connected</p>
                            <button className="px-2 py-1 ml-6 text-white bg-red-600 rounded hover:bg-red-500 hover:shadow">
                                Disconnect
                            </button>
                        </div>
                        <div className="flex items-center h-full">Coming soon...</div>
                        <div className="flex items-center h-full">Coming soon...</div>
                    </div>
                </div>
                <div className="mt-12">
                    <h5 className="text-lg font-bold">Your repositories</h5>
                    <ul className="grid grid-cols-2 mt-4 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
                        {data.repos.map((repo: any, idx: number) => (
                            <li className="p-1 bg-gray-200" key={idx}>
                                <a
                                    className="flex items-center font-semibold text-blue-500 truncate hover:underline overflow-ellipsis"
                                    href={repo.html_url}
                                    target="_blank"
                                >
                                    {repo.private && (
                                        <svg
                                            className="w-5 h-5 mr-1 text-black"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            ></path>
                                        </svg>
                                    )}
                                    <p className="break-words">{repo.full_name}</p>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </Layout>
        )
    }
}
export default withAuthentication(Connections)
