import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

import Layout from '@/components/Layout'
import { LogoIcon } from '@/components/icons/Logo'

export default function Index() {
    return (
        <Layout title="Deliberate - Team management made easy" hideNav>
            {/* Hero section */}
            <section className="w-full px-3 shadow-lg xl:px-0 bg-brand index-hero">
                <IndexNavbar />
                <h2 className="mt-10 text-3xl font-bold text-center text-white md:text-4xl md:font-extrabold">
                    An <span className="p-1 bg-blue-500 bg-opacity-25 rounded shadow-sm md:underline">automated</span>{' '}
                    approach to{' '}
                    <span className="p-1 bg-blue-500 bg-opacity-25 rounded shadow-sm md:underline">
                        small team project management
                    </span>
                </h2>
                <h5 className="w-full mx-auto mt-5 text-center text-gray-200 lg:w-7/12 xl:w-5/12 md:text-lg">
                    Stop using the tools which are complicated, contribute nothing to your productivity and are more
                    hassle than they are worth
                </h5>
                <div className="flex justify-center pb-10 mt-8 md:mt-12">
                    <button
                        className="flex items-center p-2 border-2 border-blue-500 rounded cursor-pointer group"
                        style={{ backgroundColor: '#316bbc' }}
                    >
                        <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-8 h-8 text-gray-100 group-hover:animate-pulse"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p className="ml-2 text-gray-100 group-hover:animate-pulse">
                            Watch the <span className="font-bold">Demo</span>
                        </p>
                    </button>
                </div>
            </section>

            <section className="container mx-auto">
                <h3 className="mt-8 text-2xl font-bold">Integrate with your existing tools</h3>
            </section>
        </Layout>
    )
}

export function IndexNavbar() {
    //prettier-ignore
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [menuOpen, setMenuOpen] = useState(false)

    //Middle links popovers
    const [pricingMenuOpen, setPricingMenuOpen] = useState(false)

    const handleClickOutsideDropdown = (e: any) => {
        if (dropdownRef?.current?.contains(e.target)) {
            return
        }
        setMenuOpen(false)
    }

    useEffect(() => {
        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutsideDropdown)
        } else {
            document.removeEventListener('mousedown', handleClickOutsideDropdown)
        }
    }, [menuOpen])

    return (
        <nav ref={dropdownRef}>
            <div className="mx-auto max-w-7xl">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <a href="/">
                                <LogoIcon className="w-32 h-12 -mt-1 text-white" hover="hover:text-gray-200" />
                            </a>
                        </div>
                    </div>
                    <ul className="hidden space-x-12 text-white md:flex">
                        <li
                            className="relative cursor-pointer"
                            onMouseEnter={() => setPricingMenuOpen(true)}
                            onMouseLeave={() => setPricingMenuOpen(false)}
                        >
                            Pricing
                            <div
                                className={`${
                                    pricingMenuOpen ? 'flex' : 'hidden'
                                } absolute w-48 h-32 p-6 top-10 left-1/2 transform -translate-x-1/2 bg-white rounded shadow`}
                            >
                                testing
                            </div>
                        </li>
                        <li>Community</li>
                        <li>Docs</li>
                    </ul>
                    <div className="hidden md:block">
                        <Link href="/account/sign-in">
                            <a className="mr-6 text-white" href="/account/sign-in">
                                Sign in
                            </a>
                        </Link>
                        <Link href="/account/sign-up">
                            <a
                                className="px-4 py-2 font-medium text-white bg-blue-500 rounded hover:shadow hover:bg-blue-600"
                                href="/accounts/sign-up"
                            >
                                Join now
                            </a>
                        </Link>
                    </div>

                    {/* Burger menu, toggled to an X when open */}
                    <div className="flex -mr-2 md:hidden">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-white"
                        >
                            <svg
                                className={`${menuOpen ? 'hidden' : 'block'} h-7 w-7 text-white`}
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                            <svg
                                className={`${menuOpen ? 'block' : 'hidden'} h-7 w-7 text-white`}
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Dropdown menu */}
            <div className={`${menuOpen ? 'block' : 'hidden'} px-6 text-white`}>
                <ul className="space-y-2">
                    <li>Pricing</li>
                    <li>Community</li>
                    <li>Documentation</li>
                </ul>

                <div className="flex flex-col mt-6">
                    <Link href="/account/sign-in">
                        <a className="mr-6 text-white" href="/account/sign-in">
                            Sign in
                        </a>
                    </Link>
                    <Link href="/account/sign-up">
                        <a
                            className="px-4 py-2 mt-2 font-medium text-white bg-blue-500 rounded shadow-md"
                            href="/accounts/sign-up"
                        >
                            Join now
                        </a>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
