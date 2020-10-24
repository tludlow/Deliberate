import { USER_LOGIN_FAILURE, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS } from '../actionTypes'
import api from 'lib/api'
import { AxiosError, AxiosResponse } from 'axios'

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
}
