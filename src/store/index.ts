/* global BigInt */

import { configureStore } from '@reduxjs/toolkit'
import SettingsReducer from './Settings'
import Web3Reducer from './Web3'
import TokensReducer from './Tokens'


export default configureStore({
    reducer: {
        Web3: Web3Reducer,
        Settings: SettingsReducer,
        Tokens: TokensReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})


export type ReduxDispatchRespone = {
    meta: any,
    payload: any,
    type: string,
    error?: any
}