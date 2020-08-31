import Layout from '@/components/Layout'
import Link from 'next/link'

export default function SignIn() {
    return (
        <Layout title="Sign In" contained>
            <div className="mt-6 flex flex-col items-center">
                <h3 className="font-bold text-2xl md:text-3xl">Sign in</h3>
                <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/account/sign-up">
                        <a className="text-blue-500">Sign up</a>
                    </Link>
                </p>

                <div className="w-full md:w-8/12 lg:w-6/12 xl:w-4/12 mt-6 p-4 bg-white rounded border border-gray-200 shadow">
                    <form>
                        <div className="flex flex-col">
                            <label className="font-medium" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                className="form-input"
                                type="email"
                                name="email"
                                id="email"
                                placeholder="johndoe@deliberate.com"
                            />
                        </div>

                        <div className="mt-6 flex flex-col">
                            <label className="font-medium" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="form-input"
                                type="password"
                                name="password"
                                id="password"
                                placeholder="•••••••••••••••••••"
                            />
                        </div>

                        <input
                            className="mt-8 w-full h-12 bg-brand text-white font-medium rounded cursor-pointer hover:bg-blue-500"
                            type="submit"
                            value="Sign in"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    )
}
