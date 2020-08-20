import Layout from '@/components/Layout'

import Link from 'next/link'
import Router from 'next/router'
import { LogoIcon } from '@/components/icons/Logo'

export default function FourOFour() {
    return (
        <Layout title="Page not found" contained>
            <section className="mt-6 flex flex-col items-center">
                <LogoIcon className="h-15 w-36 text-brand" />
                <p className="text-lg">This page doesn't exist</p>
                <button
                    className="mt-4 text-white text-lg bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded"
                    onClick={() => Router.back()}
                >
                    Go back
                </button>
            </section>
        </Layout>
    )
}
