import '@/css/tailwind.css'
import '@/css/components.css'
import '@/css/utilities.css'

import Head from 'next/head'
import { AppProps } from 'next/app'

import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import { useStore } from '../store/store'
import LoadingSpinner from '../components/LoadingSpinner'
import Layout from '@/components/Layout'

export default function App({ Component, pageProps }: AppProps) {
    const store = useStore(pageProps.initialReduxState)
    const persistor = persistStore(store)

    return (
        <>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
                <link rel="icon" href="/favicon.ico" />

                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta charSet="utf-8" />
                <meta name="description" content="An automated solution to small team project management" />
                <meta property="og:title" content="Deliberate" />
                <meta property="og:type" content="website" />
                <meta property="og:description" content="An automated solution to small team project management" />
                <meta property="og:image" content="https://via.placeholder.com/450x200.png" />
                <meta property="og:url" content="" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>

            <Provider store={store}>
                <PersistGate
                    loading={
                        <Layout>
                            <div className="flex justify-center mt-6">
                                <LoadingSpinner className="w-12 h-12 text-brand" />
                            </div>
                        </Layout>
                    }
                    persistor={persistor}
                >
                    <Component {...pageProps} />
                </PersistGate>
            </Provider>
        </>
    )
}
