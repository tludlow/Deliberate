import { useMemo } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import reducer from '../reducers/indexReducer'
import thunkMiddleware from 'redux-thunk'

let store: any

//The structure of the store with its default values included
// const exampleInitialState = {
//     user: {
//         username: '',
//     },
// }

//JSON Object of the keys we want to store in the local storage, add additional ones to the whitelist
//Storage is localStorage of the user browser
const persistConfig = {
    key: 'deliberate',
    storage,
    whitelist: ['user'], // place to select which state you want to persist
}

const bindMiddleware = (middleware: any) => {
    if (process.env.NODE_ENV !== 'production') {
        return composeWithDevTools(applyMiddleware(...middleware))
    }
    return applyMiddleware(...middleware)
}

//A reducer which is stored locally for persisting state between closing the app and opening again
const persistedReducer = persistReducer(persistConfig, reducer)

function makeStore(initialState: any) {
    return createStore(persistedReducer, bindMiddleware([thunkMiddleware]))
}

export const initializeStore = (preloadedState: any) => {
    let _store = store ?? makeStore(preloadedState)

    // After navigating to a page with an initial Redux state, merge that state
    // with the current state in the store, and create a new store
    if (preloadedState && store) {
        _store = makeStore({
            ...store.getState(),
            ...preloadedState,
        })
        // Reset the current store
        store = undefined
    }

    // For SSG and SSR always create a new store
    if (typeof window === 'undefined') return _store
    // Create the store once in the client
    if (!store) store = _store

    return _store
}

export function useStore(initialState: any) {
    const store = useMemo(() => initializeStore(initialState), [initialState])
    return store
}
