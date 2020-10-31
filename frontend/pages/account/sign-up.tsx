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
