import Layout from '@/components/Layout'

import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import api from 'lib/api'

export default function CreateTeam() {
    //Custom radio button:
    //https://codepen.io/ig_design/pen/dLNKgM
    return (
        <Layout title="Create A Team" contained>
            <section className="flex flex-col items-center w-1/2 p-5 mx-auto my-6 bg-white border border-gray-200 rounded shadow">
                <h3 className="text-2xl font-bold">Create a team</h3>
                <p className="text-gray-600">
                    Provide us with some information about your team so we can get you set right up
                </p>

                <Formik
                    initialValues={{
                        name: '',
                        teamType: 'team-radio-solo',
                    }}
                    validationSchema={Yup.object().shape({
                        name: Yup.string()
                            .max(50, 'Your team name must be 50 charcters or less')
                            .required('A team name is required'),
                        teamType: Yup.string().required('You must select a team type'),
                    })}
                    onSubmit={async (fields) => {
                        console.log(fields)
                        const res = await api.post('/team/create', fields)
                    }}
                >
                    {({ errors, status, touched }) => (
                        <Form className="flex flex-col w-10/12 mt-2">
                            {/* Team name */}
                            <div className="flex flex-col">
                                <label className="mt-6 text-xl font-medium" htmlFor="name">
                                    Team name
                                </label>
                                <span className="text-gray-600">How do you want people to know your team?</span>
                                <ErrorMessage name="name" component="div" className="form-error" />
                                <Field
                                    className={
                                        'mt-2 form-input w-8/12' +
                                        (errors.name && touched.name ? ' border-red-300' : '')
                                    }
                                    type="text"
                                    name="name"
                                    placeholder="Big Christmas Party"
                                    id="name"
                                />
                            </div>

                            {/* Team type */}
                            <p className="mt-6 text-xl font-medium">Team type</p>
                            <span className="text-gray-600">How many people are going to be in your team?</span>
                            <div
                                role="group"
                                aria-labelledby="team-type-radio"
                                className="flex items-center mt-2 space-x-5"
                            >
                                <div>
                                    <Field
                                        className="radio-team"
                                        type="radio"
                                        id="team-radio-solo"
                                        value="team-radio-solo"
                                        name="teamType"
                                    />
                                    <label
                                        className="flex items-center px-3 py-3 border border-gray-400 rounded cursor-pointer"
                                        htmlFor="team-radio-solo"
                                    >
                                        <span>
                                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 mr-2 user">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </span>
                                        Solo
                                    </label>
                                </div>

                                <div>
                                    <Field
                                        className="radio-team"
                                        type="radio"
                                        id="team-radio-group"
                                        value="team-radio-group"
                                        name="teamType"
                                    />
                                    <label
                                        className="flex items-center px-3 py-3 border border-gray-400 rounded cursor-pointer"
                                        htmlFor="team-radio-group"
                                    >
                                        <span>
                                            <svg
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                className="w-6 h-6 mr-2 user-group"
                                            >
                                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                            </svg>
                                        </span>
                                        Group
                                    </label>
                                </div>
                            </div>
                            <input
                                className="h-12 mt-6 font-medium text-white rounded cursor-pointer bg-brand hover:bg-blue-500"
                                type="submit"
                                value="Create Team"
                            />
                        </Form>
                    )}
                </Formik>
            </section>
        </Layout>
    )
}
