import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

import Layout from '@/components/Layout'
import { LogoIcon } from '@/components/icons/Logo'
import { BurgerMenuIcon } from '../components/icons/BurgerMenu'

export default function Index() {
    return (
        <Layout title="Deliberate - Team management made easy" hideNav>
            {/* Hero section */}
            <section className="w-full px-3 xl:px-0 bg-brand index-hero shadow-lg">
                <IndexNavbar />
                <h2 className="mt-10 text-center text-white text-3xl md:text-4xl font-bold md:font-extrabold">
                    An <span className="md:underline p-1 rounded shadow-sm bg-blue-500 bg-opacity-25">automated</span>{' '}
                    approach to{' '}
                    <span className="md:underline p-1 rounded shadow-sm bg-blue-500 bg-opacity-25">
                        small team project management
                    </span>
                </h2>
                <h5 className="mt-5 w-full lg:w-7/12 xl:w-5/12 mx-auto text-center md:text-lg text-gray-200">
                    Stop using the tools which are complicated, contribute nothing to your productivity and are more
                    hassle than they are worth
                </h5>
                <div className="mt-8 md:mt-12 pb-10 flex justify-center">
                    <button
                        className="flex items-center p-2 border-2 border-blue-500 rounded cursor-pointer group"
                        style={{ backgroundColor: '#316bbc' }}
                    >
                        <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-8 w-8 text-gray-100 group-hover:animate-pulse"
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <a href="/">
                                <LogoIcon className="-mt-1 w-32 h-12 text-white" hover="hover:text-gray-200" />
                            </a>
                        </div>
                    </div>
                    <ul className="hidden md:flex space-x-12 text-white">
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
                                className="bg-blue-500 text-white font-medium px-4 py-2 rounded hover:shadow hover:bg-blue-600"
                                href="/accounts/sign-up"
                            >
                                Join now
                            </a>
                        </Link>
                    </div>

                    {/* Burger menu, toggled to an X when open */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white"
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

                <div className="mt-6 flex flex-col">
                    <Link href="/account/sign-in">
                        <a className="mr-6 text-white" href="/account/sign-in">
                            Sign in
                        </a>
                    </Link>
                    <Link href="/account/sign-up">
                        <a
                            className="mt-2 bg-blue-500 text-white font-medium px-4 py-2 rounded shadow-md"
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
