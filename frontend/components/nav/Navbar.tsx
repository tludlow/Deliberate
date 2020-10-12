import { useEffect, useState, useRef } from 'react'

import { LogoIcon } from '../icons/Logo'
import Link from 'next/link'
import Search from './Search'

type NavbarProps = {
    showSearch?: boolean,
}

export default function Navbar({ showSearch }: NavbarProps) {
    //prettier-ignore
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [menuOpen, setMenuOpen] = useState(false)

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
        <nav ref={dropdownRef} className="bg-brand shadow">
            <div className="px-4 sm:px-6 md:px-4">
                <div className="flex items-center justify-between h-16 md:h-13">
                    <div className="flex flex-1 items-center">
                        <div className="flex-shrink-0">
                            <a href="/">
                                <LogoIcon className="-mt-1 w-32 h-12 text-white" hover="hover:text-gray-200" />
                            </a>
                        </div>
                    </div>
                    {showSearch && <Search />}
                    <div className="hidden md:flex flex-1 justify-end">
                        <div className="flex items-center">
                            <img
                                className="h-8 w-8 rounded-full"
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt="James Dean"
                            />
                            <span className="ml-2 text-white">James Dean</span>
                        </div>
                    </div>

                    {/* Burger menu, toggled to an X when open */}
                    <div className="-mr-2 flex flex-1 justify-end md:hidden">
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
            <div className={`${menuOpen ? 'block' : 'hidden'} px-6 py-3 text-white`}>
                <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="James Dean"
                />
            </div>
        </nav>
    )
}
