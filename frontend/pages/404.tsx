import Layout from '@/components/layout'

import Link from 'next/link'
import Router from 'next/router'
import { LogoIcon } from '@/components/icons/Logo'

export default function FourOFour() {
    return (
        <Layout title="Page not found" contained>
            <section className=" flex flex-col items-center">
                <LogoIcon className="h-15 w-36 text-brand" />
            </section>
        </Layout>
    )
}
