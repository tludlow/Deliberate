import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
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
        }
    }, [router.query])

    return (
        <Layout title="Github Sign In" contained>
            <p>Welcome {name} </p>
        </Layout>
    )
}
