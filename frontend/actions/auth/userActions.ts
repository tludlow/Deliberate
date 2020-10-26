import {
    USER_LOGIN_ERROR_CLEAR,
    USER_LOGIN_FAILURE,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
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
            console.log('response: ', response)
            dispatch({ type: USER_LOGIN_SUCCESS, payload: {} })
        })
        .catch((error: AxiosError) => {
            console.log('error: ', error.response?.data)
            dispatch({ type: USER_LOGIN_FAILURE, payload: { error: error.response?.data.message } })
        })
    dispatch({ type: USER_LOGIN_ERROR_CLEAR })
}

/**
 * Clears login errors, used mainly for page load
 */
export const clearLoginErrors = () => {
    return { type: USER_LOGIN_ERROR_CLEAR }
}

export const logoutUser = () => {
    //Redirect the user
    router.push('/')
    return { type: USER_LOGOUT }
}
