import ModalHOC from './Modal'
import { Field, Form, Formik, ErrorMessage } from 'formik'
import api from 'lib/api'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

type EditTaskModalProps = {
    isOpen: boolean
    closeModal: () => void
    id: number
    title: string
    description: string
    date: dayjs.Dayjs
    start_time: string
    end_time: string
}

export default function EditTaskModal({
    isOpen,
    closeModal,
    id,
    title,
    description,
    date,
    start_time,
    end_time,
}: EditTaskModalProps) {
    const [error, setError] = useState('')

    return (
        <ModalHOC isOpen={isOpen} closeModal={closeModal} modalWidth="w-full lg:w-1/2 xl:w-5/12">
            <div className="flex justify-center">
                <h4 className="text-xl font-bold">Edit Task - {title}</h4>
            </div>

            <div className="mt-6">
                <Formik
                    initialValues={{
                        title,
                        description,
                        day: date.format('YYYY-MM-DD'),
                        start_time: start_time.split(' ')[0],
                        end_time: end_time.split(' ')[0],
                    }}
                    validate={(values) => {
                        const errors: any = {}

                        let startTime = dayjs(`${date.format('YYYY-MM-DD')} ${values.start_time}`, 'YYYY-MM-DD HH-mm')
                        let endTime = dayjs(`${date.format('YYYY-MM-DD')} ${values.end_time}`, 'YYYY-MM-DD HH-mm')

                        console.log(startTime)
                        console.log(endTime)

                        if (startTime.isAfter(endTime)) {
                            errors.start_time = 'Your start time cant be after the end time'
                        }
                        if (endTime.isBefore(startTime)) {
                            errors.start_time = 'Your end time cant be before the start time'
                        }
                        return errors
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                        setSubmitting(true)
                        api.post('/calendar/task/edit', {
                            id,
                            title: values.title,
                            description: values.description,
                            day: values.day,
                            start_time: `${values.start_time}:00`,
                            end_time: `${values.end_time}:00`,
                        })
                            .then((response) => {
                                closeModal()
                                location.reload()
                            })
                            .catch((error) => {
                                console.log(error)
                                setError(error.response.data.message)
                            })
                        setSubmitting(false)
                    }}
                >
                    {({ values, isSubmitting }) => (
                        <Form className="flex flex-col w-full mt-4 space-y-4">
                            <div className="flex flex-col">
                                <label className="font-medium" htmlFor="title">
                                    Title
                                </label>
                                <Field
                                    className="form-input"
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="A nice descriptive task title"
                                    required
                                />
                            </div>

                            <div className="flex flex-col mt-6">
                                <label className="font-medium" htmlFor="description">
                                    Description
                                </label>
                                <Field
                                    className="form-input"
                                    as="textarea"
                                    type="text"
                                    name="description"
                                    id="description"
                                    required
                                />
                            </div>

                            <div className="flex flex-col mt-6">
                                <label className="font-medium" htmlFor="day">
                                    Date
                                </label>
                                <Field className="form-input" type="date" name="day" id="day" required />
                            </div>

                            <div className="flex justify-between mt-6">
                                <div className="flex flex-col w-1/3">
                                    <label className="font-medium" htmlFor="start_time">
                                        Start Time
                                    </label>
                                    <Field
                                        className="form-input"
                                        type="time"
                                        name="start_time"
                                        id="start_time"
                                        min="9:00"
                                        max="18:00"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col w-1/3">
                                    <label className="font-medium" htmlFor="end_time">
                                        End Time
                                    </label>
                                    <Field
                                        className="form-input"
                                        type="time"
                                        name="end_time"
                                        id="end_time"
                                        min="9:00"
                                        max="18:00"
                                        required
                                    />
                                </div>
                            </div>

                            <ErrorMessage name="start_time">
                                {(msg) => <div className="form-error">{msg}</div>}
                            </ErrorMessage>
                            <ErrorMessage name="end_time">
                                {(msg) => <div className="form-error">{msg}</div>}
                            </ErrorMessage>
                            {error.length > 0 && <p className="form-error">{error}</p>}
                            <button
                                className="w-full h-12 mt-8 font-medium text-white rounded cursor-pointer bg-brand hover:bg-blue-500 disabled:bg-blue-300 disabled:cusor-not-allowed"
                                disabled={isSubmitting}
                                type="submit"
                            >
                                Edit Task
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </ModalHOC>
    )
}
