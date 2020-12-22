import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

import { LogoIcon } from '../icons/Logo'
import Search from './Search'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'reducers/indexReducer'
import { logoutUser } from 'actions/auth/userActions'
import Link from 'next/link'
import Notifications from './Notifications'

type NavbarProps = {
    showSearch?: boolean,
}

export default function Navbar({ showSearch }: NavbarProps) {
    const user = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()

    //prettier-ignore
    const dropdownRef = useRef<HTMLDivElement>(null)
    //prettier-ignore
    const popoverRef = useRef<HTMLDivElement>(null)
    const [menuOpen, setMenuOpen] = useState(false)
    const [popoverMenuOpen, setPopoverMenuOpen] = useState(false)

    const handleClickOutsideDropdown = (e: any) => {
        if (dropdownRef?.current?.contains(e.target)) {
            return
        }
        setMenuOpen(false)
    }

    const handleClickOutsidePopover = (e: any) => {
        if (popoverRef?.current?.contains(e.target)) {
            return
        }
        setPopoverMenuOpen(false)
    }

    useEffect(() => {
        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutsideDropdown)
        } else {
            document.removeEventListener('mousedown', handleClickOutsideDropdown)
        }

        if (popoverMenuOpen) {
            document.addEventListener('mousedown', handleClickOutsidePopover)
        } else {
            document.removeEventListener('mousedown', handleClickOutsidePopover)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideDropdown)
            document.removeEventListener('mousedown', handleClickOutsidePopover)
        }
    }, [menuOpen, popoverMenuOpen])

    return (
        <nav ref={dropdownRef} className="shadow bg-brand">
            <div className="container mx-auto">
                <div className="flex items-center justify-between h-14 md:h-13">
                    <div className="flex items-center flex-1">
                        <div className="flex-shrink-0">
                            <a href="/" tabIndex={0}>
                                <LogoIcon
                                    className="w-32 h-12 ml-2 -mt-1 text-white md:ml-0"
                                    hover="hover:text-gray-200"
                                />
                            </a>
                        </div>
                    </div>
                    {showSearch && <Search />}
                    <div className="relative justify-end flex-1 hidden md:flex">
                        {/* user logged out */}
                        {!user.loggedIn && (
                            <div className="flex items-center space-x-6">
                                <Link href="/account/sign-in">
                                    <a className="text-white hover:text-gray-100" href="/account/sign-in">
                                        Sign in
                                    </a>
                                </Link>
                                <Link href="/account/sign-up">
                                    <a
                                        className="px-4 py-2 font-medium text-white bg-blue-500 rounded shadow-md hover:bg-blue-600"
                                        href="/accounts/sign-up"
                                    >
                                        Join now
                                    </a>
                                </Link>
                            </div>
                        )}
                        {/* user logged in */}
                        {user.loggedIn && (
                            <div className="flex items-center space-x-8">
                                <Notifications />
                                <div
                                    className="flex items-center cursor-pointer group"
                                    onClick={() => setPopoverMenuOpen(!popoverMenuOpen)}
                                    ref={popoverRef}
                                    id="popover-toggle"
                                    tabIndex={0}
                                >
                                    <Image
                                        className="w-8 h-8 border rounded-full group-hover:border-gray-100 group-hover:shadow"
                                        src="/defaultimage.webp"
                                        alt="James Dean"
                                        width={32}
                                        height={32}
                                    />
                                    <span className="ml-2 text-white group-hover:text-gray-200">{user.username}</span>
                                    <svg
                                        className="h-4 w-4 ml-2 text-white pt-0.5 group-hover:text-gray-200"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>

                                    {popoverMenuOpen && (
                                        <div className="absolute right-0 z-20 flex flex-col w-48 bg-white rounded shadow top-9">
                                            <Link href="/calendar">
                                                <a className="flex items-center px-3 py-2 hover:bg-gray-100">
                                                    <svg
                                                        className="w-5 h-5 mr-2 text-brand"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    My Calendar
                                                </a>
                                            </Link>
                                            <Link href="/settings">
                                                <a className="flex items-center px-3 py-2 hover:bg-gray-100">
                                                    <svg
                                                        className="w-5 h-5 mr-2 text-brand"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                    </svg>
                                                    Settings
                                                </a>
                                            </Link>
                                            <div className="w-full h-px bg-gray-200"></div>
                                            <button
                                                onClick={() => dispatch(logoutUser())}
                                                className="flex items-center px-3 py-2 hover:bg-gray-100"
                                            >
                                                <svg
                                                    className="w-5 h-5 mr-2 text-brand"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                    />
                                                </svg>
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Burger menu, toggled to an X when open */}
                    <div className="flex justify-end flex-1 md:hidden">
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
            <div className={`${menuOpen ? 'block' : 'hidden'} px-2 py-3 text-white`}>
                {user.loggedIn ? (
                    <div>
                        <div className="flex items-center">
                            <Image
                                className="w-8 h-8 border rounded-full group-hover:border-gray-100 group-hover:shadow"
                                src="/defaultimage.webp"
                                alt="James Dean"
                                width={32}
                                height={32}
                            />
                            <span className="ml-2 text-white group-hover:text-gray-200">{user.username}</span>
                        </div>
                        <div className="my-4 border border-gray-600"></div>
                        <div className="mb-4 space-y-4">
                            <button
                                onClick={() => dispatch(logoutUser())}
                                className="flex items-center hover:bg-gray-100"
                            >
                                <svg
                                    className="w-5 h-5 mr-2 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                Logout
                            </button>
                        </div>{' '}
                    </div>
                ) : (
                    <p>Log in please</p>
                )}
            </div>
        </nav>
    )
}
