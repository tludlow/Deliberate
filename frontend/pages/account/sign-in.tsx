import Layout from '@/components/Layout'
import Link from 'next/link'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'reducers/indexReducer'
import { clearLoginErrors, loginUser } from '../../actions/auth/userActions'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function SignIn() {
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        dispatch(clearLoginErrors())
        console.log(router)
    }, [])

    return (
        <Layout title="Sign In" contained>
            <div className="flex flex-col items-center mt-6">
                <h3 className="text-2xl font-bold md:text-3xl">Sign in</h3>
                <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/account/sign-up">
                        <a className="text-blue-500">Sign up</a>
                    </Link>
                </p>

                {router.query.auth === '401' && (
                    <p className="mt-4 text-red-500">
                        You must be signed in to an account to perform that action, log in now
                    </p>
                )}

                <div className="w-full p-4 mt-6 bg-white border border-gray-200 rounded shadow md:w-8/12 lg:w-6/12 xl:w-4/12">
                    <LogInForm />
                </div>

                <div className="relative w-full my-8 md:w-8/12 lg:w-6/12 xl:w-4/12">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex w-12 mx-auto jusitfy-center">
                        <span className="px-4 text-sm leading-5 text-gray-400 bg-gray-50">or</span>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <p className="text-lg font-medium">Sign in with these other platforms</p>
                    <a href="https://github.com/login/oauth/authorize?client_id=39a17c505bbbab3e6804">
                        <div className="flex items-center justify-center px-4 py-2 mt-3 space-x-4 text-white bg-black rounded cursor-pointer hover:shadow">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                            </svg>
                            <p>GitHub</p>
                        </div>
                    </a>
                </div>
            </div>
        </Layout>
    )
}

export function LogInForm() {
    const user = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()

    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            validate={(values) => {
                const errors: any = {}
                if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                    errors.email = 'Invalid email address'
                }
                return errors
            }}
            onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true)
                dispatch(loginUser(values.email, values.password))
                setSubmitting(false)
            }}
        >
            {({ isSubmitting }) => (
                <Form className="flex flex-col w-full mt-4 space-y-4">
                    <div className="flex flex-col">
                        <label className="font-medium" htmlFor="email">
                            Email Address
                        </label>
                        <ErrorMessage name="email">{(msg) => <div className="form-error">{msg}</div>}</ErrorMessage>
                        <Field
                            className="form-input"
                            type="email"
                            name="email"
                            id="email"
                            placeholder="johndoe@deliberate.com"
                            required
                        />
                    </div>

                    <div className="flex flex-col mt-6">
                        <label className="font-medium" htmlFor="password">
                            Password
                        </label>
                        <Field
                            className="form-input"
                            type="password"
                            name="password"
                            id="password"
                            placeholder="•••••••••••••••••••"
                            required
                        />
                    </div>

                    {user.error != null && <div className="form-error">{user.error}</div>}

                    <button
                        className="w-full h-12 mt-8 font-medium text-white rounded cursor-pointer bg-brand hover:bg-blue-500 disabled:bg-blue-300 disabled:cusor-not-allowed"
                        disabled={isSubmitting || user.loading}
                        type="submit"
                    >
                        Sign in
                    </button>
                </Form>
            )}
        </Formik>
    )
}
