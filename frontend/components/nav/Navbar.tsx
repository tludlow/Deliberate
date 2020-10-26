import { useEffect, useState, useRef } from 'react'

import { LogoIcon } from '../icons/Logo'
import Search from './Search'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'reducers/indexReducer'
import { logoutUser } from 'actions/auth/userActions'

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
    const [popoverMenuOpen, setPopoverMenuOpen] = useState(true)

    const handleClickOutsideDropdown = (e: any) => {
        if (dropdownRef?.current?.contains(e.target)) {
            return
        }
        setMenuOpen(false)
    }

    const handleClickOutsidePopover = (e: any) => {
        console.log(e)
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
                <div className="flex items-center justify-between h-16 md:h-13">
                    <div className="flex items-center flex-1">
                        <div className="flex-shrink-0">
                            <a href="/">
                                <LogoIcon className="w-32 h-12 -mt-1 text-white" hover="hover:text-gray-200" />
                            </a>
                        </div>
                    </div>
                    {showSearch && <Search />}
                    <div className="relative justify-end flex-1 hidden md:flex">
                        <div
                            className="flex items-center cursor-pointer group"
                            onClick={() => setPopoverMenuOpen(!popoverMenuOpen)}
                            ref={popoverRef}
                            id="popover-toggle"
                        >
                            <img
                                className="w-8 h-8 rounded-full"
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt="James Dean"
                            />
                            <span className="ml-2 text-white group-hover:text-gray-200">{user.username}</span>
                            <svg
                                className="h-4 w-4 ml-2 text-white pt-0.5 group-hover:text-gray-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>

                            {popoverMenuOpen && (
                                <div className="absolute right-0 flex flex-col w-48 py-4 bg-white rounded shadow top-9">
                                    <button
                                        onClick={() => dispatch(logoutUser())}
                                        className="flex items-center p-1 px-3 hover:bg-gray-100"
                                    >
                                        <svg
                                            className="w-5 h-5 mr-2 text-black"
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

                    {/* Burger menu, toggled to an X when open */}
                    <div className="flex justify-end flex-1 -mr-2 md:hidden">
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
            <div className={`${menuOpen ? 'block' : 'hidden'} px-6 py-3 text-white`}>
                <img
                    className="w-8 h-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="James Dean"
                />
            </div>
        </nav>
    )
}
