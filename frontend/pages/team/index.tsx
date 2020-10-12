import Layout from '../../components/Layout'
import { RightArrowIcon, MapIcon } from '../../components/icons/index'
import { useState } from 'react'

export default function Team() {
    return (
        <Layout title="Team Page" showSearch>
            <div className="grid grid-cols-12">
                {/* Col 1 */}
                <div className="hidden md:flex p-3 flex-col items-center col-span-2 h-within thin-scrollbar bg-white">
                    <h3>Something</h3>
                </div>
                {/* Col 2 */}
                <div className="hidden md:block relative col-span-2 h-within thin-scrollbar bg-gray-100">
                    <div className="h-16 absolute inset-x-0 top-0 bg-gradient-to-b from-gray-50 to-transparent"></div>
                    <h3>Action options and list of actions</h3>
                    <div className="h-16 absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-50 to-transparent"></div>
                </div>
                {/* Col 3 */}
                <div className="col-span-12 md:col-span-6 h-within thin-scrollbar bg-white">
                    <h3>Big activities boy</h3>
                </div>
                {/* Col 4 - Calendar / Time tracking */}
                <div className="hidden md:block col-span-2 p-2 h-within thin-scrollbar bg-gray-100">
                    <h3>Team management and calendar</h3>
                    <div className="h-32 w-full relative pl-5 py-2 bg-white overflow-hidden rounded">
                        <div className="h-full w-2 absolute inset-y-0 left-0 bg-purple-600"></div>
                        <h4 className="font-semibold">Daily Scrum</h4>
                        <span className="flex items-center text-gray-600 text-sm">
                            9:15 AM
                            <span>
                                <RightArrowIcon className="h-4 w-4 mx-2 text-gray-600" />
                            </span>{' '}
                            9:35 AM
                        </span>
                        <span className="mt-2 flex items-center text-sm">
                            <MapIcon className="h-5 w-5 mr-2 text-gray-600" />
                            Room 2.25
                        </span>
                        <button className="my-2 px-2 py-1 rounded border border-gray-600 text-gray-600 text-sm">
                            Can't attend?
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
