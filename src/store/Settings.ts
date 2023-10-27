/* global BigInt */
/**
 * quản lí các cài đặt của người dùng
 */
import { createSlice, createAsyncThunk, Dispatch } from "@reduxjs/toolkit";
import { EventEmitter } from "events";
import axios from "axios";
import { GetThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { AsyncThunkConfig, RootState } from ".";
const { log } = console;


/**
 * "changed" | "loaded" | "saved" | "NameTokenChaged"
 */
export var SettingsEvent = new EventEmitter();

// loadSettings sẽ lấy cài đặt từ localStorage
export const loadSetting = createAsyncThunk(
    "loadSettings",
    async (args: any, thunkAPI): Promise<any> => {
        try {
            let res = await axios.get("settings.json")
            let _setting = res.data
            if (_setting) {
                let { Settings } = thunkAPI?.getState() as any
                log(Settings)
                return { before: Settings, after: _setting };
            } else throw new Error("SETTING_NOT_FOUND")
        } catch (err) {
            throw new Error("SETTING_NOT_FOUND")
        }
    }
)

// saveSetting sẽ lưu cài đặt vào localStorage
export const saveSetting = createAsyncThunk(
    "saveSettings",
    async (args: any, thunkAPI) => {
        let { key, value } = args;
        let Settings = await thunkAPI.getState
        let settings = JSON.parse(JSON.stringify(Settings));

        let keys = key.split('.');
        let lastkey = keys[keys.length - 1].trim();
        let obj = keys.slice(0, keys.length - 1).reduce((acc: any, key: string | number) => acc[key], settings)

        obj[lastkey] = value;

        localStorage.setItem("settings", JSON.stringify(settings))
        console.log(key, value)

        SettingsEvent.emit(key, value)

        return { before: Settings, after: settings };
    }
)

export const importSetting = createAsyncThunk(
    "importSetting",
    async (_setting: any, thunkAPI) => {
        if (_setting && typeof _setting === 'object') {
            let Settings = await thunkAPI.getState;
            let after = { ...Settings, ..._setting }
            localStorage.setItem("settings", JSON.stringify(after))
            return { before: Settings, after }
        }
    }
)

export let defaultSettings = {
    language: "en",
}

export const Settings = createSlice({
    name: "Settings",
    initialState: defaultSettings,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loadSetting.fulfilled, (state: any, action: any) => {
            for (const key in action.payload.after) {
                if (Object.hasOwnProperty.call(action.payload.after, key))
                    state[key] = action.payload.after[key];
            }

            setTimeout(() => {
                SettingsEvent.emit("loaded", action.payload)
            }, 100);
        })
        builder.addCase(loadSetting.rejected, (state, action) => {
            SettingsEvent.emit("loadFailed", action.payload)
        })

        builder.addCase(importSetting.fulfilled, (state: any, action: any) => {
            for (const key in action.payload.after) {
                if (Object.hasOwnProperty.call(action.payload.after, key))
                    state[key] = action.payload.after[key];
            }

            setTimeout(() => {
                SettingsEvent.emit("imported", action.payload)
                SettingsEvent.emit("loaded", action.payload)
            }, 100);
        })

        builder.addCase(saveSetting.fulfilled, (state: any, action: any) => {
            for (const key in action.payload.after) {
                if (Object.hasOwnProperty.call(action.payload.after, key))
                    state[key] = action.payload.after[key];
            }

            setTimeout(() => {
                SettingsEvent.emit("saved", action.payload)
            }, 100);
        })
    },
})


export const { } = Settings.actions;

export default Settings.reducer;