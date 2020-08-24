import Head from 'next/head'
import Navbar from './nav/Navbar'

type LayoutProps = {
    title?: string,
    contained?: boolean,
    hideNav?: boolean,
    showSearch?: boolean,
}
const Layout: React.FC<LayoutProps> = ({ title, contained, hideNav = false, showSearch = false, children }) => (
    <div className="flex flex-col w-screen h-screen">
        <Head>
            <title>{`${title} - Deliberate` || 'Deliberate'}</title>
        </Head>
        {!hideNav && <Navbar showSearch={showSearch} />}

        <main className="flex-1 overflow-auto bg-gray-50">
            <div className={`${contained ? 'container mx-auto px-3 md:px-1 lg:px-0' : ''}`}>{children}</div>
        </main>
    </div>
)

export default Layout
