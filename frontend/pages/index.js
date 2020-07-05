import Layout from '@/components/layout/layout'

import Logo from '@/components/logo'
import LogoText from '@/components/logo-text'

export default function Index() {
    return (
        <Layout>
            {/* Hero section */}
            <section
                className="bg-brand"
                style={{
                    height: '442px',
                }}
            >
                <div className="flex justify-between items-center mb-8 px-3 lg:px-0">
                    <Logo />
                    <LogoText />
                    <svg className="h-7 w-7 text-white mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </div>
                <h2 className="text-3xl font-semibold text-center text-white">
                    Project management <br /> that <span className="font-bold">isn't</span>
                </h2>
            </section>
            <Wave />
        </Layout>
    )
}

export function Wave() {
    return (
        <svg fill="none" viewBox="0 0 1440 320">
            <path
                d="M1440 256l-34.3-5.3C1371.4 245 1303 235 1234 224c-68.3-11-137-21-205-26.7-69-5.3-138-5.3-206 5.4C754.3 213 686 235 617 224c-68.4-11-137-53-206-80-68.1-27-137-37-205-42.7C137.1 96 69 96 34 96H0V0h1440v256z"
                fill="url(#paint0_linear)"
            />
            <defs>
                <linearGradient id="paint0_linear" x1="720" y1="0" x2="720" y2="256" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3356BC" />
                    <stop offset="1" stopColor="#4665C2" />
                </linearGradient>
            </defs>
        </svg>
    )
}
