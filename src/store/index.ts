/* global BigInt */

import { Dispatch, configureStore } from '@reduxjs/toolkit'
import SettingsReducer from './Settings'
import Web3Reducer from './Web3'
import TokensReducer from './Tokens'
import Infos from './Infos'


const store = configureStore({
    reducer: {
        Web3: Web3Reducer,
        Settings: SettingsReducer,
        Tokens: TokensReducer,
        Infos: Infos,
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

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AsyncThunkConfig = {
    /** return type for `thunkApi.getState` */
    state?: unknown
    /** type for `thunkApi.dispatch` */
    dispatch?: Dispatch
    /** type of the `extra` argument for the thunk middleware, which will be passed in as `thunkApi.extra` */
    extra?: unknown
    /** type to be passed into `rejectWithValue`'s first argument that will end up on `rejectedAction.payload` */
    rejectValue?: unknown
    /** return type of the `serializeError` option callback */
    serializedErrorType?: unknown
    /** type to be returned from the `getPendingMeta` option callback & merged into `pendingAction.meta` */
    pendingMeta?: unknown
    /** type to be passed into the second argument of `fulfillWithValue` to finally be merged into `fulfilledAction.meta` */
    fulfilledMeta?: unknown
    /** type to be passed into the second argument of `rejectWithValue` to finally be merged into `rejectedAction.meta` */
    rejectedMeta?: unknown,
    getState: () => any,
    [name: string]: any,
}

export default store;