import Layout from '@/components/Layout'

//Design inspiration: https://dribbble.com/shots/9712645-StartGlobal-Onboarding
export default function SignUp() {
    return (
        <Layout title="Sign up - Deliberate" contained>
            {/* Cool background dots to fill the blank space, need the grid section to be position:relative so we can force the dots behind it */}
            <div className="hidden xl:block fixed right-0 top-13 h-96 w-52 bg-center z-0 bg-with-dots"></div>
            <div className="mt-10 h-full w-full grid grid-cols-1 md:grid-cols-10 gap-x-4 relative z-10">
                <div className="hidden md:block w-full md:col-span-5 lg:col-span-6 space-y-8">
                    <InformationItem />
                    <InformationItem />
                    <InformationItem />
                    <InformationItem />
                </div>
                <div className="w-full flex md:col-span-5 lg:col-span-4 flex-col items-center">
                    <h3 className="font-bold text-2xl md:text-3xl">Sign up for an account</h3>
                    <p className="text-grayh-600">Gain access to all the features of</p>
                    <form className="mt-4 w-full p-4 flex flex-col bg-white rounded shadow">
                        <label className="font-medium" htmlFor="name">
                            Name
                        </label>
                        <input className="form-input mb-4" type="text" name="name" id="name" placeholder="John Doe" />

                        <label className="font-medium" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="form-input mb-4"
                            type="email"
                            name="email"
                            id="email"
                            placeholder="john@deliberate.com"
                        />

                        <label className="font-medium" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="form-input mb-4"
                            type="password"
                            name="password"
                            id="password"
                            placeholder="•••••••••••••••••••"
                        />

                        <label className="font-medium" htmlFor="confirm-password">
                            Confirm Password
                        </label>
                        <input
                            className="form-input mb-4"
                            type="password"
                            name="confirm-password"
                            id="confirm-password"
                            placeholder="•••••••••••••••••••"
                        />

                        <input
                            className="mt-4 sw-full h-12 bg-brand text-white font-medium rounded cursor-pointer hover:bg-blue-500"
                            type="submit"
                            value="Sign up"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    )
}

function InformationItem() {
    return (
        <div className="flex justify-between space-x-4">
            <div className="h-14 w-14 p-2 flex items-center justify-center bg-red-500 rounded">
                <svg viewBox="0 0 20 20" fill="currentColor" className="desktop-computer w-10 h-10 text-white">
                    <path
                        fillRule="evenodd"
                        d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                        clipRule="evenodd"
                    ></path>
                </svg>
            </div>
            <div>
                <h5 className="text-lg font-semibold">Useful automations</h5>
                <p className="text-gray-600 text-md lg:w-8/12">
                    Many team management tasks are mundane, yet important to project success. Let deliberate do these
                    for you with our powerful, in-built automation tools
                </p>
            </div>
        </div>
    )
}
