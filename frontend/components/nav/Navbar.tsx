import { LogoIcon } from '../icons/Logo'
import Link from 'next/link'

export default function Navbar() {
    return (
        <header className="w-full h-13 mb-4 bg-brand">
            <div className="h-full container mx-auto flex items-center">
                <Link href="/">
                    <a href="/">
                        <LogoIcon className="h-10 w-32 -mt-px text-white cursor-pointer" hover="hover:text-gray-200" />
                    </a>
                </Link>
            </div>
        </header>
    )
}
