import { useEffect, useState, useRef } from 'react'

import { LogoIcon } from '../icons/Logo'
import Search from './Search'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'reducers/indexReducer'

type NavbarProps = {
    showSearch?: boolean,
}

export default function Navbar({ showSearch }: NavbarProps) {
    // const user = useSelector((state: RootState) => state.user)
    // const dispatch = useDispatch()

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
                    <div className="justify-end flex-1 hidden md:flex">
                        <div className="flex items-center">
                            <img
                                className="w-8 h-8 rounded-full"
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt="James Dean"
                            />
                            <span className="ml-2 text-white">Testing User</span>
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
