import Layout from '@/components/Layout'
import { WarningIcon } from '../../components/icons/index'
export default function CreateTeam() {
    //Custom radio button:
    //https://codepen.io/ig_design/pen/dLNKgM
    return (
        <Layout title="Create A Team" contained>
            <section className="my-6 bg-white p-4 rounded">
                <h3 className="text-2xl font-bold">Create a team</h3>
                <p className="text-gray-600">
                    Provide us with some information about your team so we can get you set right up
                </p>

                <form className="mt-2 flex flex-col" action="">
                    {/* Team name */}
                    <div className="flex flex-col">
                        <label className="mt-6 font-bold text-xl" htmlFor="team-name">
                            Team name
                        </label>
                        <span className="text-gray-600">How do you want people to know your team?</span>
                        <span className="mt-1 flex items-center text-red-500">
                            <WarningIcon className="h-5 w-5 mr-2" />
                            This team name is taken
                        </span>
                        <input className="mt-2 form-input w-4/12" type="text" name="team-name" id="team-name" />
                    </div>

                    {/* Team type */}
                    <p className="mt-6 font-bold text-xl">Team type</p>
                    <span className="text-gray-600">How many people are going to be in your team?</span>
                    <div className="mt-2 flex items-center space-x-5">
                        <div>
                            <input className="radio-team" type="radio" id="team-radio-solo" name="team-type" />
                            <label
                                className="flex items-center px-3 py-3 rounded border border-gray-400 cursor-pointer"
                                htmlFor="team-radio-solo"
                            >
                                <span>
                                    <svg viewBox="0 0 20 20" fill="currentColor" className="user w-6 h-6 mr-2">
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
                            <input className="radio-team" type="radio" id="team-radio-team" name="team-type" />
                            <label
                                className="flex items-center px-3 py-3 rounded border border-gray-400 cursor-pointer"
                                htmlFor="team-radio-team"
                            >
                                <span>
                                    <svg viewBox="0 0 20 20" fill="currentColor" className="user-group w-6 h-6 mr-2">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                    </svg>
                                </span>
                                Group
                            </label>
                        </div>
                    </div>
                </form>
            </section>
        </Layout>
    )
}
