import Layout from '@/components/layout'
import { LogoIcon } from '@/components/icons/Logo'
import { BurgerMenuIcon } from '../components/icons/BurgerMenu'

import { useState, useRef, useEffect } from 'react'

export default function Index() {
    return (
        <Layout title="Deliberate - Team management made easy" hideNav>
            <section className="w-full px-3 xl:px-0 pb-6 bg-brand index-hero shadow-lg">
                <IndexNavbar />
                <h2 className="mt-6 text-center text-white text-3xl md:text-4xl font-bold md:font-extrabold">
                    An automated approach to small team management
                </h2>
                <h5 className="mt-3 w-10/12 sm:w-8/12 md:w-5/12 mx-auto text-center text-lg text-gray-200">
                    Stop using the tools which are complicated, contribute nothing to your productivity and are more
                    hassle than they are worth
                </h5>
                <div className="mt-8 mb-15 flex justify-center">
                    <button className="flex items-center p-2 border-2 border-blue-500 rounded cursor-pointer group">
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

function IndexNavbar() {
    // prettier-ignore
    const dropdownRef = useRef<HTMLElement>(null)
    const [menuOpen, setMenuOpen] = useState(false)

    //TODO: properly define the type of event, this is a weird edge case in typescript types that isnt clear
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
        <>
            <header ref={dropdownRef} className="h-16 container mx-auto flex justify-between items-center">
                <a href="/">
                    <LogoIcon className="w-32 h-12 text-white" hover="hover:text-gray-200" />
                </a>
                <ul className="hidden md:flex space-x-6 text-white">
                    <li tabIndex={0}>Contact</li>
                    <li tabIndex={0}>Pricing</li>
                    <li tabIndex={0}>Documentation</li>
                </ul>
                <div className="hidden md:flex md:items-center">
                    <a className="mr-6 text-white" href="">
                        Sign in
                    </a>
                    <button className="bg-blue-500 text-white font-medium px-4 py-2 rounded">Join now</button>
                </div>
                <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                    <BurgerMenuIcon className="h-8 w-8 text-white" />
                </button>
            </header>
            {menuOpen && (
                <div className="mt-4 flex flex-col container mx-auto space-y-6">
                    <ul className="flex flex-col space-y-2 text-white">
                        <li tabIndex={0}>Contact</li>
                        <li tabIndex={0}>Pricing</li>
                        <li tabIndex={0}>Documentation</li>
                    </ul>

                    <a className="mr-6 text-white" href="">
                        Sign in
                    </a>
                    <button className="block bg-blue-500 text-white font-medium px-4 py-2 rounded shadow-md">
                        Join now
                    </button>
                </div>
            )}
        </>
    )
}
