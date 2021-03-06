import Router from 'next/router'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'reducers/indexReducer'
import Layout from '@/components/Layout'
import LoadingSpinner from '@/components/LoadingSpinner'

//HOC wrapping authenticated routes/pages so that only logged in users can have acces
//Found here - https://github.com/vercel/next.js/discussions/14945

const withAuthentication = (WrappedComponent: any) => {
    const RequiresAuthentication = (props: any) => {
        // get user role from redux state
        const user = useSelector((state: RootState) => state.user)

        useEffect(() => {
            // if a there isn't a logged in user and their role has been set to "guest"
            // then redirect them to "/signin"

            //Dont do anything when the state hasnt loaded from localstorage, this is the default user state template, probably a better way to do this
            // if (user.loading === false && user.loggedIn === false && user.error === null && user.username === '') {
            //     return
            // }

            if (!user.loggedIn) Router.push('/account/sign-in')
        }, [user])

        // if there's a loggedInUser, show the wrapped page, otherwise show a loading indicator
        return user && user.loggedIn ? (
            <WrappedComponent {...props} />
        ) : (
            <Layout>
                <div className="flex justify-center w-full mt-6">
                    <LoadingSpinner className="w-12 h-12 text-brand" />
                </div>
            </Layout>
        )
    }

    return RequiresAuthentication
}

export default withAuthentication
