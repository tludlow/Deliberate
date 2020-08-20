interface UserState {
    username: string;
}

const initialState: UserState = {
    username: '',
}

const userReducer = (state = initialState, action: any) => {
    switch (action.type) {
        default:
            return state
    }
}

export default userReducer
