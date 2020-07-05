import '@/css/tailwind.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap"
                    rel="stylesheet"
                />
                {/* <link rel="icon" href="/favicon.ico" /> */}

                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta charSet="utf-8" />
                <meta property="og:title" content="Deliberate" />
                <meta property="og:type" content="website" />
                <meta
                    property="og:description"
                    content="An automated management for small, agile software development teams"
                />
                <meta property="og:image" content="https://via.placeholder.com/450x200.png" />
                {/* <meta property="og:url" content="https://billpop-kohl.now.sh/" /> */}
                <meta name="twitter:card" content="summary_large_image" />
            </Head>

            <Component {...pageProps} />
        </>
    )
}
