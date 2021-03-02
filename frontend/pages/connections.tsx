import Layout from '@/components/Layout'
import { useEffect } from 'react'
import api from 'lib/api'
import withAuthentication from '@/components/HOC/withAuthentication'
import useSWR from 'swr'

const fetcher = (url: string) => api.get(url).then((res) => res.data)
function Connections() {
    const { data, error } = useSWR('/auth/github/connected', fetcher)

    console.log(data)

    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    if (!data.connected) return <div>Connect your github account through SSO</div>
    return (
        <Layout title="Connections" contained>
            <p>hello</p>
        </Layout>
    )
}
export default withAuthentication(Connections)
