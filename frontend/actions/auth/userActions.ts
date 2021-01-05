import {
    USER_LOGIN_ERROR_CLEAR,
    USER_LOGIN_FAILURE,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_SSO,
    USER_LOGOUT,
    USER_REGISTER_ERROR_CLEAR,
    USER_REGISTER_FAILURE,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
} from '../actionTypes'
import api from 'lib/api'
import { AxiosError, AxiosResponse } from 'axios'
import router from 'next/router'

/**
 * loginUser - Logs the user in
 * @param email
 * @param password
 */
//Example: Action thunk with types - https://gist.github.com/milankorsos/ffb9d32755db0304545f92b11f0e4beb
export const loginUser = (email: string, password: string) => async (dispatch: any) => {
    dispatch({ type: USER_LOGIN_REQUEST })
    api.post('/user/login', { email, password })
        .then((response: AxiosResponse) => {
            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: {
                    loading: false,
                    error: null,
                    username: response.data.name,
                    loggedIn: true,
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                },
            })
            router.push('/')
        })
        .catch((error: AxiosError) => {
            console.log('error: ', error.response?.data)
            dispatch({ type: USER_LOGIN_FAILURE, payload: { error: error.response?.data.message } })
        })
}

/**
 * Clears login errors, used mainly for page load
 */
export const clearLoginErrors = () => {
    return { type: USER_LOGIN_ERROR_CLEAR }
}
export const clearRegisterErrors = () => {
    return { type: USER_REGISTER_ERROR_CLEAR }
}
export const signUpUser = (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
) => async (dispatch: any) => {
    dispatch({ type: USER_REGISTER_REQUEST })
    api.post('/user/register', {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
    })
        .then((response: AxiosResponse) => {
            console.log('response', response)
            dispatch({
                type: USER_REGISTER_SUCCESS,
                payload: {
                    loading: false,
                    error: null,
                    username: response.data.name,
                    loggedIn: true,
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                },
            })
            router.push('/')
        })
        .catch((error: AxiosError) => {
            console.log('error registering', error.response?.data)
            dispatch({ type: USER_REGISTER_FAILURE, payload: { error: error.response?.data.message } })
        })
}

export const loginUserSSO = (
    name: string | string[],
    refreshToken: string | string[],
    accessToken: string | string[]
) => {
    return { type: USER_LOGIN_SSO, payload: { name, refreshToken, accessToken } }
}

export const logoutUser = () => {
    //Redirect the user
    router.push('/account/sign-in')
    return { type: USER_LOGOUT }
}

export const refreshUserUnauth = () => {
    router.push({ pathname: '/account/sign-in', query: { auth: '401' } })
    return { type: USER_LOGOUT }
}
