import Head from 'next/head'
import Navbar from './nav/Navbar'

type LayoutProps = {
    title?: string,
    contained?: boolean,
    hideNav?: boolean,
}
const Layout: React.FC<LayoutProps> = ({ title, contained, hideNav = false, children }) => (
    <div className="flex flex-col w-screen h-screen">
        <Head>
            <title>{title || 'Deliberate'}</title>
        </Head>
        {!hideNav && <Navbar />}

        <main className="flex-1 overflow-auto">
            <div className={`${contained ? 'container mx-auto' : ''}`}>{children}</div>
        </main>
    </div>
)

export default Layout
