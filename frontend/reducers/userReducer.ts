import { USER_LOGIN_FAILURE, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS } from '../actions/actionTypes'

interface UserState {
    loading: boolean;
    loggedIn: boolean;
    error: string | null;
    username: string;
    accessToken: string;
    refreshToken: string;
}

const initialState: UserState = {
    loading: false,
    loggedIn: false,
    error: null,
    username: 'Saranyan Kugapiragasam',
    accessToken: '',
    refreshToken: '',
}

const userReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { ...state, loading: true, error: null }
        case USER_LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                loggedIn: true,
                username: action.payload.username,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
            }
        case USER_LOGIN_FAILURE:
            console.log(action)
            return { ...state, loading: false, error: action.payload.error }
        default:
            return state
    }
}

export default userReducer
