/**
 * quản lí các cài đặt của người dùng
 */
import BigNumber from "bignumber.js";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { EventEmitter } from "events";
const { log, warn, error } = console

/**
 * "changed" | "loaded" | "saved" | "NameTokenChaged"
 */
export var SettingsEvent = new EventEmitter();

// loadSettings sẽ lấy cài đặt từ localStorage
export const loadSetting = createAsyncThunk(
    "loadSettings",
    async (args, thunkAPI) => {
        let _setting = JSON.parse(localStorage.getItem("setting"))
        if (_setting) {
            _setting.AmountCoinMin = new BigNumber(_setting.AmountCoinMin)
            _setting.AmountCoinMax = new BigNumber(_setting.AmountCoinMax)

            let { setting } = await thunkAPI.getState().Settings
            return { before: setting, after: _setting };
        } else throw new Error("SETTING_NOT_FOUND")
    }
)

// saveSetting sẽ lưu cài đặt vào localStorage
export const saveSetting = createAsyncThunk(
    "saveSettings",
    async ({ key, value }, thunkAPI) => {
        let { setting } = await thunkAPI.getState().Settings
        let _setting = JSON.parse(JSON.stringify(setting));

        let keys = key.split('.');
        let lastkey = keys[keys.length - 1].trim();
        let obj = keys.slice(0, keys.length - 1).reduce((acc, key) => acc[key], _setting)

        obj[lastkey] = value;

        localStorage.setItem("setting", JSON.stringify(_setting))
        console.log(key, value)

        SettingsEvent.emit(key, value)

        return { before: setting, after: _setting };
    }
)

export const importSetting = createAsyncThunk(
    "importSetting",
    async (_setting, thunkAPI) => {
        if (_setting && typeof _setting === 'object') {
            let { setting } = await thunkAPI.getState().Settings
            let after = { ...setting, ..._setting }
            localStorage.setItem("setting", JSON.stringify(after))
            return { before: setting, after }
        }
    }
)

export const defaultSettings = {
}

export const Settings = createSlice({
    name: "Settings",
    initialState: { setting: defaultSettings },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loadSetting.fulfilled, (state, action) => {
            state.setting = action.payload.after
            setTimeout(() => {
                SettingsEvent.emit("loaded", action.payload)
            }, 100);
        })

        builder.addCase(importSetting.fulfilled, (state, action) => {
            state.setting = action.payload.after
            setTimeout(() => {
                SettingsEvent.emit("imported", action.payload)
                SettingsEvent.emit("loaded", action.payload)
            }, 100);
        })

        builder.addCase(saveSetting.fulfilled, (state, action) => {
            state.setting = action.payload.after
            setTimeout(() => {
                SettingsEvent.emit("saved", action.payload)
            }, 100);
        })
    },
})


export const { } = Settings.actions;

export default Settings.reducer;