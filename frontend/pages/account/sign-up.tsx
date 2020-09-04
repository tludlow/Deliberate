import Link from 'next/link'
import Layout from '@/components/Layout'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import api from 'lib/api'
import { useState } from 'react'

//Design inspiration: https://dribbble.com/shots/9712645-StartGlobal-Onboarding
export default function SignUp() {
    const [formError, setFormError] = useState('')
    return (
        <Layout title="Sign up - Deliberate" contained>
            {/* Cool background dots to fill the blank space, need the grid section to be position:relative so we can force the dots behind it */}
            <div className="hidden xl:block fixed right-0 top-13 h-96 w-56 bg-center z-0 bg-with-dots"></div>
            <div className="mt-6 h-full w-full grid grid-cols-1 md:grid-cols-10 gap-x-4 relative z-10">
                <div className="hidden md:flex pt-4 w-full md:col-span-5 lg:col-span-6 flex-col justify-between">
                    <AutomationInformation />
                    <ToolYouWantInformation />
                    <IncreasedBusinessSuccess />
                </div>
                <div className="w-full flex md:col-span-5 lg:col-span-4 flex-col items-center">
                    <h3 className="font-bold text-2xl md:text-3xl">Sign up for an account</h3>
                    <p className="text-gray-600 text-center">
                        Gain access to all the features and become more productive today
                    </p>
                    <p className="mt-3 text-gray-600 text-center">
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
                        onSubmit={async (fields) => {
                            setFormError('')
                            // console.log('SUCCESS!! :-)\n\n' + JSON.stringify(fields, null, 4))
                            try {
                                const res = await api.post('/auth/signup', fields)
                                //Send user to the index page for whatever is defined
                            } catch (err) {
                                console.log(err.response.data.message)
                                setFormError(err.response.data.message)
                            }
                        }}
                        render={({ errors, status, touched }) => (
                            <Form className="mt-4 lg:mt-10 w-full p-4 flex flex-col bg-white border border-gray-100 rounded shadow">
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

                                {formError.length > 0 ? <p className="form-error">{formError}</p> : ''}

                                <input
                                    className="mt-4 w-full h-12 bg-brand text-white font-medium rounded cursor-pointer hover:bg-blue-500"
                                    type="submit"
                                    value="Sign up"
                                />
                            </Form>
                        )}
                    />
                </div>
            </div>
        </Layout>
    )
}

function AutomationInformation() {
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
                <p className="text-gray-600 leading-snug text-md lg:w-8/12">
                    Many team management tasks are mundane, yet important to project success. Let deliberate do these
                    for you with our powerful, in-built automation tools
                </p>
            </div>
        </div>
    )
}

function ToolYouWantInformation() {
    return (
        <div className="flex justify-between space-x-4">
            <div className="h-14 w-14 p-2 flex items-center justify-center bg-green-500 rounded">
                <svg viewBox="0 0 20 20" fill="currentColor" className="emoji-happy w-10 h-10 text-white">
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
            <div>
                <h5 className="text-lg font-semibold">Tools you want to use</h5>
                <p className="text-gray-600 leading-snug text-md lg:w-8/12">
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
            <div className="h-14 w-14 p-2 flex items-center justify-center bg-indigo-500 rounded">
                <svg viewBox="0 0 20 20" fill="currentColor" className="chevron-double-up w-10 h-10 text-white">
                    <path
                        fillRule="evenodd"
                        d="M4.293 15.707a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414 0zm0-6a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
            <div>
                <h5 className="text-lg font-semibold">Increased business success</h5>
                <p className="text-gray-600 leading-snug text-md lg:w-8/12">
                    Using a combinationg of our management tools and the knowledge provided your business or side
                    project will be guided by the science and will be more likely to succeed
                </p>
            </div>
        </div>
    )
}
