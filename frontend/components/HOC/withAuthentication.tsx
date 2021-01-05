import Router from 'next/router'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'reducers/indexReducer'

//HOC wrapping authenticated routes/pages so that only logged in users can have acces
//Found here - https://github.com/vercel/next.js/discussions/14945

const withAuthentication = (WrappedComponent: any) => {
    const RequiresAuthentication = (props: any) => {
        // get user role from redux state
        const user = useSelector((state: RootState) => state.user)

        useEffect(() => {
            // if a there isn't a logged in user and their role has been set to "guest"
            // then redirect them to "/signin"

            //Default user redux state means user probably not logged in
            if (user.loading === false && user.loggedIn === false && user.error === null && user.username === '') {
                Router.push('/account/sign-in')
            }

            // console.log(user)

            // if (!user?.loggedIn) Router.push('/account/sign-in')
        }, [user])

        // if there's a loggedInUser, show the wrapped page, otherwise show a loading indicator
        return user && user.loggedIn ? (
            <WrappedComponent {...props} />
        ) : (
            <div className="text-3xl font-bold text-brand">Loading...</div>
        )
    }

    return RequiresAuthentication
}

export default withAuthentication
