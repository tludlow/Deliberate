import Layout from '@/components/Layout'
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

                <p className="mt-6 font-bold text-xl">Team type</p>
                <span className="text-gray-600">How many people are going to be in your team?</span>
                <form className="mt-2 flex items-center space-x-5" action="">
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
                </form>
            </section>
        </Layout>
    )
}
