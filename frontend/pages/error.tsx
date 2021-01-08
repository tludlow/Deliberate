import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Error() {
    const router = useRouter()

    return (
        <Layout title="Error!" contained>
            <div className="flex justify-center mt-8">
                <div className="text-center">
                    <h4 className="text-xl font-bold text-red-500">Error!</h4>
                    <p>{router.query.msg}</p>

                    <div className="flex justify-center mt-4 space-x-3">
                        <Link href="/">
                            <a
                                className="px-3 py-1 text-white rounded-lg bg-brand hover:shadow hover:bg-brand-light"
                                href="/"
                            >
                                Home
                            </a>
                        </Link>
                        <button
                            className="px-3 py-1 text-white bg-gray-500 rounded-lg hover:shadow hover:bg-gray-600"
                            onClick={() => router.back()}
                        >
                            Go back
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
