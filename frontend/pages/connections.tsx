import Layout from '@/components/Layout'
import { useEffect } from 'react'
import api from 'lib/api'
import withAuthentication from '@/components/HOC/withAuthentication'
import useSWR from 'swr'
import { GithubIcon } from '@/components/icons'

const fetcher = (url: string) => api.get(url).then((res) => res.data)
function Connections() {
    // const { data, error } = useSWR('/auth/github/connected', fetcher)

    // console.log(error)

    useEffect(() => {
        api.get('/auth/github/connected')
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    })

    // if (error) return <div>failed to load</div>
    // if (!data) return <div>loading...</div>
    // if (!data.connected) {
    //     return (
    //         <Layout title="Connections" contained>
    //             <div className="mt-8 space-y-4">
    //                 <h4 className="text-xl font-bold">Connections</h4>
    //                 <div className="flex items-center mt-4 space-x-3">
    //                     <GithubIcon className="w-12 h-12 text-black" />
    //                     <p className="text-lg font-bold">GitHub</p>
    //                     <span>-</span>
    //                     <p className="text-green-500">Connected</p>
    //                     <button className="px-2 py-1 ml-6 text-white bg-red-600 rounded hover:bg-red-500 hover:shadow">
    //                         Disconnect
    //                     </button>
    //                 </div>
    //                 <div className="">Coming soon...</div>
    //                 <div className="">Coming soon...</div>
    //             </div>
    //         </Layout>
    //     )
    // }
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
        </Layout>
    )
}
export default withAuthentication(Connections)
