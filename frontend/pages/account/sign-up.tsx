import Link from 'next/link'
import Layout from '@/components/Layout'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { signUpUser } from 'actions/auth/userActions'
import { RootState } from 'reducers/indexReducer'

//Design inspiration: https://dribbble.com/shots/9712645-StartGlobal-Onboarding
export default function SignUp() {
    const user = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()

    return (
        <Layout title="Sign up - Deliberate" contained>
            {/* Cool background dots to fill the blank space, need the grid section to be position:relative so we can force the dots behind it */}
            <div className="fixed right-0 z-0 hidden w-56 bg-center xl:block top-13 h-96 bg-with-dots"></div>
            <div className="relative z-10 grid w-full h-full grid-cols-1 mt-6 md:grid-cols-10 gap-x-4">
                <div className="flex-col justify-between hidden w-full pt-4 md:flex md:col-span-5 lg:col-span-6">
                    <AutomationInformation />
                    <ToolYouWantInformation />
                    <IncreasedBusinessSuccess />
                </div>
                <div className="flex flex-col items-center w-full md:col-span-5 lg:col-span-4">
                    <h3 className="text-2xl font-bold md:text-3xl">Sign up for an account</h3>
                    <p className="text-center text-gray-600">
                        Gain access to all the features and become more productive today
                    </p>
                    <p className="mt-3 text-center text-gray-600">
                        Already have an account?{' '}
                        <Link href="/account/sign-in">
                            <a className="text-blue-500">Sign in</a>
                        </Link>
                    </p>
                    <div className="flex flex-col items-center my-2">
                        <p className="text-lg font-medium">Join easily with GitHub!</p>
                        <a
                            href={`https://github.com/login/oauth/authorize?client_id=39a17c505bbbab3e6804&scope=${[
                                'repo',
                            ].join(' ')}`}
                        >
                            <div className="flex items-center justify-center px-4 py-2 mt-3 space-x-4 text-white bg-black rounded cursor-pointer hover:shadow">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                </svg>
                                <p>GitHub</p>
                            </div>
                        </a>
                    </div>
                    <Formik
                        initialValues={{
                            firstName: '',
                            lastName: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                        }}
                        validationSchema={Yup.object().shape({
                            firstName: Yup.string()
                                .max(50, 'First name must be 50 characters or less')
                                .required('First name is required'),
                            lastName: Yup.string()
                                .max(50, 'Last name must be 50 characters or less')
                                .required('Last name is required'),
                            email: Yup.string()
                                .email('Email is invalid')
                                .max(120, 'Email must be 120 characters or less')
                                .required('Email is required'),
                            password: Yup.string()
                                .min(6, 'Password must be at least 6 characters')
                                .required('Password is required'),
                            confirmPassword: Yup.string()
                                .oneOf([Yup.ref('password')], 'Passwords must match')
                                .required('Confirm password is required'),
                        })}
                        onSubmit={async (values, { setSubmitting }) => {
                            setSubmitting(true)
                            dispatch(
                                signUpUser(
                                    values.firstName,
                                    values.lastName,
                                    values.email,
                                    values.password,
                                    values.confirmPassword
                                )
                            )
                            setSubmitting(false)
                        }}
                    >
                        {({ errors, status, touched }) => (
                            <Form className="flex flex-col w-full p-4 mt-4 bg-white border border-gray-100 rounded shadow lg:mt-10">
                                <label className="font-medium" htmlFor="firstName">
                                    First name
                                </label>
                                <ErrorMessage name="firstName" component="div" className="form-error" />
                                <Field
                                    name="firstName"
                                    type="text"
                                    className={
                                        'form-input mb-4' +
                                        (errors.firstName && touched.firstName ? ' border-red-300' : '')
                                    }
                                    placeholder="John"
                                />

                                <label className="font-medium" htmlFor="lastName">
                                    Last name
                                </label>
                                <ErrorMessage name="lastName" component="div" className="form-error" />
                                <Field
                                    name="lastName"
                                    type="text"
                                    className={
                                        'form-input mb-4' +
                                        (errors.lastName && touched.lastName ? ' border-red-300' : '')
                                    }
                                    placeholder="Doe"
                                />

                                <label className="font-medium" htmlFor="email">
                                    Email
                                </label>
                                <ErrorMessage name="email" component="div" className="form-error" />
                                <Field
                                    name="email"
                                    type="email"
                                    className={
                                        'form-input mb-4' + (errors.email && touched.email ? ' border-red-300' : '')
                                    }
                                    placeholder="johndoe@deliberate.com"
                                />

                                <label className="font-medium" htmlFor="password">
                                    Password
                                </label>
                                <ErrorMessage name="password" component="div" className="form-error" />
                                <Field
                                    name="password"
                                    type="password"
                                    className={
                                        'form-input mb-4' +
                                        (errors.password && touched.password ? ' border-red-300' : '')
                                    }
                                    placeholder="•••••••••••••••••••"
                                />

                                <label className="font-medium" htmlFor="confirm-password">
                                    Confirm Password
                                </label>
                                <ErrorMessage name="confirmPassword" component="div" className="form-error" />
                                <Field
                                    name="confirmPassword"
                                    type="password"
                                    className={
                                        'form-input mb-4' +
                                        (errors.confirmPassword && touched.confirmPassword ? ' border-red-300' : '')
                                    }
                                    placeholder="•••••••••••••••••••"
                                />

                                {user.error && <p className="form-error">{user.error}</p>}

                                <input
                                    className="w-full h-12 mt-4 font-medium text-white rounded cursor-pointer bg-brand hover:bg-blue-500"
                                    type="submit"
                                    value="Sign up"
                                />
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </Layout>
    )
}

function AutomationInformation() {
    return (
        <div className="flex justify-between space-x-4">
            <div className="flex items-center justify-center p-2 bg-red-500 rounded h-14 w-14">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-10 h-10 text-white desktop-computer">
                    <path
                        fillRule="evenodd"
                        d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                        clipRule="evenodd"
                    ></path>
                </svg>
            </div>
            <div>
                <h5 className="text-lg font-semibold">Useful automations</h5>
                <p className="leading-snug text-gray-600 text-md lg:w-8/12">
                    Many team management tasks are mundane, yet important to project success. Let deliberate do these
                    for you with our powerful, in-built automation features.
                </p>
            </div>
        </div>
    )
}

function ToolYouWantInformation() {
    return (
        <div className="flex justify-between space-x-4">
            <div className="flex items-center justify-center p-2 bg-green-500 rounded h-14 w-14">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-10 h-10 text-white emoji-happy">
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
            <div>
                <h5 className="text-lg font-semibold">Tools you want to use</h5>
                <p className="leading-snug text-gray-600 text-md lg:w-8/12">
                    Most project management tools are complex, mundane and seem to have no effective on productivity,
                    deliberate is a tool you actually want to use
                </p>
            </div>
        </div>
    )
}

function IncreasedBusinessSuccess() {
    return (
        <div className="flex justify-between space-x-4">
            <div className="flex items-center justify-center p-2 bg-indigo-500 rounded h-14 w-14">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-10 h-10 text-white chevron-double-up">
                    <path
                        fillRule="evenodd"
                        d="M4.293 15.707a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414 0zm0-6a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
            <div>
                <h5 className="text-lg font-semibold">Increased business success</h5>
                <p className="leading-snug text-gray-600 text-md lg:w-8/12">
                    Using a combinationg of our management tools and the knowledge provided your business or side
                    project will be guided by the science and will be more likely to succeed
                </p>
            </div>
        </div>
    )
}
