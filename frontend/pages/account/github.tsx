import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUserSSO } from 'actions/auth/userActions'
import { RootState } from 'reducers/indexReducer'

export default function SSOFallback() {
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user)

    const router = useRouter()
    const { name, refreshToken, accessToken } = router.query
    useEffect(() => {
        console.log(router.query)
        //If there is a query with a name and tokens then we can log the user in for redux purposes
        if (name && refreshToken && accessToken && user.loggedIn === false) {
            console.log('Logging the user in with SSO')
            dispatch(loginUserSSO(name, refreshToken, accessToken))
            // router.push('/dashboard')
        }
    }, [router.query])

    return (
        <Layout title="Github Sign In" contained>
            <section className="my-4">
                <h2 className="text-xl">
                    Welcome to Deliberate <span className="font-bold">{name}</span>
                </h2>

                <div className="grid grid-cols-12 mt-6 gap-x-4">
                    <div className="col-span-4">
                        <form className="mt-4" action="">
                            <fieldset>
                                <legend>
                                    <h3 className="text-lg font-bold text-brand">Repositories</h3>
                                    <p className="text-gray-600">
                                        Select the repositories want Deliberate to track and automate for you
                                    </p>
                                </legend>
                                <div className="mt-4 space-y-4">
                                    <RepositorySelection
                                        name="Repository 1"
                                        description="The description of the repository here what happens if it gets really long i'd ideally like it to truncate right?"
                                        imageUrl="https://via.placeholder.com/50"
                                    />
                                    <RepositorySelection
                                        name="Repository 1"
                                        description="The description of the repository here what happens if it gets really long i'd ideally like it to truncate right?"
                                        imageUrl="https://via.placeholder.com/50"
                                    />
                                    <RepositorySelection
                                        name="Repository 1"
                                        description="The description of the repository here what happens if it gets really long i'd ideally like it to truncate right?"
                                        imageUrl="https://via.placeholder.com/50"
                                    />
                                </div>
                            </fieldset>
                        </form>
                    </div>
                    <div className="col-span-7"></div>
                </div>
            </section>
            <div className="mt-8 space-x-3">
                <button className="px-3 py-2 text-white bg-gray-400 border border-gray-200 rounded">Cancel</button>
                <button className="px-3 py-2 text-white bg-green-400 border border-gray-200 rounded">Continue</button>
            </div>
        </Layout>
    )
}

type RepositorySelectionProps = {
    name: string
    imageUrl: string
    description: string
}

function RepositorySelection({ name, imageUrl, description }: RepositorySelectionProps) {
    const [selected, setSelected] = useState(false)
    return (
        <div className="w-10/12 ml-3 text-sm">
            <label
                htmlFor="repository-1"
                className={`flex items-center p-4 space-x-4 border bg-white rounded shadow cursor-pointer hover:bg-gray-50 hover:shadow-md focus:ring-blue-500 ${
                    selected ? 'border-blue-500' : 'border-gray-200'
                }`}
            >
                <input
                    id="repository-1"
                    name="repository-1"
                    type="checkbox"
                    checked={selected}
                    onChange={() => {
                        setSelected(!selected)
                        console.log(selected)
                    }}
                    className="w-5 h-5 rounded border-gra-300 text-brands s"
                />
                <div className="flex items-center space-x-3">
                    <img className="rounded-md shadow" src={imageUrl} alt="Repository 1" />
                    <div>
                        <span className="font-medium text-gray-700">{name}</span>
                        <p className="w-8/12 font-normal text-gray-500 truncate">{description}</p>
                    </div>
                </div>
            </label>
        </div>
    )
}
