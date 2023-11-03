/* global BigInt */
/**
 * quản lí các thông tin chung thay state
 */
import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import { EventEmitter } from "events";
import { AsyncThunkConfig, RootState } from ".";
const { log } = console;


/**
 * "changed" | "loaded" | "saved"
 */
export var SettingsEvent = new EventEmitter();


export const Infos = createSlice({
    name: "Infos",
    initialState: {},
    reducers: {
        setInfo(state: any, action) {
            Object.entries(action.payload).forEach(([key, value]) => {
                state[key] = value
            })
        }
    },

    extraReducers: (builder) => {
        // builder.addCase(loadSetting.fulfilled, (state: any, action: any) => {
        // })
    }
})


export const { setInfo } = Infos.actions;

export default Infos.reducer;