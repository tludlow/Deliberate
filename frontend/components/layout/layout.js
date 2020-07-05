import Head from 'next/head'

export default function Layout(props) {
    return (
        <>
            <Head>
                <title>{props.title || 'Deliberate'}</title>
            </Head>

            {/* Have the option to remove the container if wanted */}
            <div className={`${props.contained ? 'container mx-auto px-4 md:px-0' : ''}`}>{props.children}</div>
        </>
    )
}
