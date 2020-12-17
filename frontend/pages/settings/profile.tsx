import Layout from '@/components/Layout'
import SubNav from '@/components/SubNav/SubNav'
import { useRouter } from 'next/router'

export default function Profile() {
    const router = useRouter()

    let currentPath = router.pathname.split('/').pop()
    return (
        <Layout title="Settings" contained>
            <div className="grid grid-cols-12 col-gap-3 mt-3">
                <div className="col-span-3 border border-gray-300 rounded">
                    <div className="w-full h-full py-2">
                        <div className="flex flex-col space-y-3">
                            <SubNav current={currentPath} text="profile" />
                            <SubNav current={currentPath} text="integrations" />
                        </div>
                    </div>
                </div>
                <div className="h-12 col-span-9 bg-blue-300"></div>
            </div>
        </Layout>
    )
}
