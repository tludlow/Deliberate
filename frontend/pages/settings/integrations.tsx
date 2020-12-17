import Layout from '@/components/Layout'
import SubNav from '@/components/SubNav/SubNav'
import { useRouter } from 'next/router'

export default function Settings() {
    const router = useRouter()

    let currentPath = router.pathname.split('/').pop()
    return (
        <Layout title="Settings" contained>
            <div className="grid grid-cols-12 col-gap-3 mt-6">
                <div className="col-span-3">
                    <div className="w-full h-full py-2 space-y-5">
                        <div className="flex flex-col py-2 space-y-3 border border-gray-300 rounded">
                            <SubNav current={currentPath} text="profile" />
                            <SubNav current={currentPath} text="integrations" />
                        </div>

                        <div className="flex flex-col py-2 space-y-3 border border-gray-300 rounded">
                            <p className="pl-3 text-red-600">Delete Account</p>
                        </div>
                    </div>
                </div>
                <div className="h-12 col-span-9">
                    <div className="w-full h-full pl-4">
                        <h3 className="text-2xl font-bold">Integrations</h3>
                        <p className="text-gray-600">
                            Other software which is connected to Deliberate to extract data from and put into your
                            calendar
                        </p>
                        <div className="w-full h-px my-1 bg-gray-300"></div>
                        <div>
                            <div className="inline-flex items-center justify-center px-4 py-2 mt-3 space-x-4 text-white bg-gray-700 rounded cursor-pointer hover:shadow">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                </svg>
                                <p>GitHub</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
