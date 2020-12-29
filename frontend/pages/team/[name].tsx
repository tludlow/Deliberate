import Layout from '@/components/Layout'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function TeamPage() {
    const router = useRouter()
    let teamName = router.query.name

    //design: https://dribbble.com/shots/11831844-Taskee-to-do-list
    return (
        <Layout title={`${teamName}`} contained>
            <p>hi</p>
        </Layout>
    )
}
