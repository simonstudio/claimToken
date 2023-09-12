import { configureStore } from '@reduxjs/toolkit'
import SettingsReducer from './Settings'
import Web3Reducer from './Web3'
// import WssReducer from './WebSocket'
import TokensReducer from './Tokens'
// import ContractReducer from './Contract'


export default configureStore({
    reducer: {
        Web3: Web3Reducer,
        // WebSocket: WssReducer,
        Settings: SettingsReducer,
        Tokens: TokensReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})
