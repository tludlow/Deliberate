import Layout from '@/components/Layout'
import Link from 'next/link'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'reducers/indexReducer'
import { clearLoginErrors, loginUser } from '../../actions/auth/userActions'
import { useEffect } from 'react'

export default function SignIn() {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(clearLoginErrors())
    })
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

                <div className="w-full p-4 mt-6 bg-white border border-gray-200 rounded shadow md:w-8/12 lg:w-6/12 xl:w-4/12">
                    <LogInForm />
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
