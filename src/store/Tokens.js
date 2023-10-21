/* global BigInt */
/**
 * quản lí các Tokens
 */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { EventEmitter } from "events";
import { saveSetting } from "./Settings";
import { TenPower, getRandomFloat } from "../std";
import { Contract } from "ethers";

const { log, warn, error } = console


/**
 * event.on ( "addContractSuccess" | "getInfoAllSuccess" | "balanceOfAll" | "balanceOf" )
 */
export let event = new EventEmitter()

/**
 * load abi của 1 Contract
 * @param {string} name 
 * @returns {object} json object
 */
export async function loadAbiByName(name = "Token") {
    return axios.get("/contracts/" + name + ".json")
        .then(r => r.data)
}

/**
 * load abi of contract by url to json
 * @param {string} url link to abi
 * @returns {object | any} abi
 */
export async function loadAbi(url = "/contracts/Token.json") {
    return axios.get(url)
        .then(r => r.data)
}

/**
 * thêm 1 contract vào store
 * nếu abi là {string} thì tức là tên của contract, load abi đó
 * nếu không có abi thì tự load abi cơ bản của 1 token
 * @param {object} abi 
 * @param {string} address
 */
export const addContract = createAsyncThunk(
    "addContract",
    async ({ abi, address }, thunkAPI) => {
        let { web3 } = await thunkAPI.getState().Web3;
        let { settings } = await thunkAPI.getState().Settings

        if (typeof abi == "string") {
            abi = await loadAbi(abi)
        } else if (!abi)
            abi = await loadAbiByName()
        let instance = new Contract(address, abi, web3)

        // let tokens = JSON.parse(JSON.stringify(settings.tokens))

        // await thunkAPI.dispatch(saveSetting({ key: "tokens", value: Array.from(new Set([...tokens, address])) }))

        return instance
    }
)


/**
 * lấy thông tin cơ bản của 1 token
 * @param {Contract} instance contract
 * @returns {object} info 
 */
export async function getInfo(instance) {
    let info = {
        name: await instance.name(),
        symbol: await instance.symbol(),
        decimals: 10 ** Number(await instance.decimals()),
        totalSupply: await instance.totalSupply(),
    }
    return info;
}

/**
 * lấy số token đã được approve của 1 owner cho 1 spender
 * @param {Contract[]} contracts danh sách instance của contract
 * @param {address} owner
 * @param {address} spender
 * @param {int} index số thứ tự trong contracts
 * @returns {object} {contractAddress: amount, }
 */
export async function allowancesOf(contracts = [], owner, spender, index = 0) {
    if (contracts && index < contracts.length) {
        let allowance = 0;
        if (!contracts[index]) {
            return await allowancesOf(contracts, owner, spender, index + 1);
        } else {
            allowance = await contracts[index].allowance(owner, spender)
        }

        let next = await allowancesOf(contracts, owner, spender, index + 1);

        next[contracts[index]._address] = allowance;

        event.emit("allowancesOf", { owner, spender, contract: contracts[index], allowance })
        return next;
    } else return {}
}

/**
 * lấy số token đã được approve của nhiều owner cho 1 spender
 * @param {Contract[]} contracts danh sách instance của contract
 * @param {address[]} owners danh sách ví
 * @param {address} spender địa chỉ được approve
 * @returns {object} { address: 
 *      {contractAddress: amount, }, 
 * }
 */
export async function allowancesOfAll(contracts = [], owners = [], spender, index = 0) {
    if (owners && index < owners.length) {
        let allowances = await allowancesOf(contracts, owners[index], spender);
        event.emit("allowancesOfAll", { address: owners[index], contracts, allowances })

        let next = await allowancesOfAll(contracts, owners, spender, index + 1);
        next[owners[index]] = allowances;
        return next;
    } else return {}
}

/**
 * tính số dư của 1 ví dựa trên danh sách contracts
 * @param {Contract || Web3} contracts danh sách instance của contract, nếu muốn tính số dư Coin thì đưa web3 vào
 * @param {address} address địa chỉ ví
 * @param {int} index số thứ tự trong contracts
 * @returns {object} {contractAddress: balance}
 */
export async function balanceOf(contracts = [], address, index = 0) {
    if (contracts && index < contracts.length) {
        let balance = 0;
        if (!contracts[index]) {
            return await balanceOf(contracts, address, index + 1);

        } else if (contracts[index].getBalance) {
            balance = await contracts[index].getBalance(address);

        } else {
            balance = await contracts[index].balanceOf(address)
        }
        let next = await balanceOf(contracts, address, index + 1);
        next[contracts[index].getBalance ? "balance" : contracts[index]._address] = balance;
        event.emit("balanceOf", { address, contract: contracts[index], balance })
        return next;
    } else return {}
}

/**
 * lấy số dư của nhiều ví
 * @param {Contract[]} contracts danh sách instance của contract
 * @param {address[]} addresses danh sách ví
 * @returns {object} { address: 
 *      {contractAddress: balance}, 
 * }
 */
export async function balanceOfAll(contracts = [], addresses = [], index = 0) {
    if (addresses && index < addresses.length) {
        let balances = await balanceOf(contracts, addresses[index]);
        event.emit("balanceOfAll", { address: addresses[index], contracts, balances })
        let next = await balanceOfAll(contracts, addresses, index + 1);
        next[addresses[index]] = balances;
        return next;
    } else return {}
}

// // cập nhật số dư của 1 ví 1 token
// export const updateBalance = createAsyncThunk(
//     "updateBalance",
//     async ({ tokenAddress, address }, thunkAPI) => {
//         let { wallets } = await thunkAPI.getState().Wallets;
//         let Tokens = await thunkAPI.getState().Tokens
//         let balance = 0
//         if (tokenAddress.eth) {
//             balance = await tokenAddress.getBalance(address);
//         } else
//             balance = await Tokens[tokenAddress].balanceOf(address))

//         return balance
//     }
// )


/**
 * lấy thông tin của tất cả tokens
 * @param {Web3} web3 
 * @param {object[]} tokens mảng chứa địa chỉ contract và abi [address, abi]
 * @param {int} index số thứ tự trong mảng tokens
 * @returns {object} mảng chứa thông tin của tokens [{address: {name, symbol, decimals, totalSupply}}, ]
 */
export async function _getInfoAll(web3, tokens = [], thunkAPI, index = 0) {
    if (index < tokens.length) {
        const [address, abi] = tokens[index];
        let instance = new Contract(abi, address, web3)

        let next = await _getInfoAll(web3, tokens, thunkAPI, index + 1);

        try {
            let info = { ...(await getInfo(instance)), ...instance }
            next[address] = info;

            thunkAPI?.dispatch(setTokens(next))
        } catch (err) {
            // console.error(address, instance.currentProvider?.host || instance.currentProvider?.url, err.message.match("Returned values aren't valid, did it run Out of Gas?") ? "" : err.message)
            event.emit("ContractNotFound", { address, abi })
            next[address] = undefined;
            thunkAPI?.dispatch(setTokens(next))
        }

        return next;
    } else {
        return tokens.reduce((o, t) => {
            o[t[0]] = false;
            return o;
        }, {});
    }
}

/**
 * lấy thông tin của tất cả tokens hiện tại
 * @param {address[]} _tokens danh sách địa chỉ tokens
 */
export const getInfoAll = createAsyncThunk(
    "getInfoAll",
    async (_tokens, thunkAPI) => {
        let { web3 } = await thunkAPI.getState().MyWeb3;
        let { setting } = await thunkAPI.getState().Settings
        let tokens = _tokens || Object.keys(await thunkAPI.getState().Tokens)

        let abi;
        if (typeof abi == "string") {
            abi = await loadAbi(abi)
        } else if (!abi)
            abi = await loadAbi()


        if (!tokens || tokens.length == 0)
            tokens = setting.tokens || []

        return await _getInfoAll(web3, tokens.map(address => ([address, abi])), thunkAPI)
    }
)


export const remove = createAsyncThunk(
    "remove",
    async (address, thunkAPI) => {
        address = address.trim()
        let setting = await thunkAPI.getState().Settings.setting;
        let tokens = setting.tokens.filter(v => v != address)

        await thunkAPI.dispatch(saveSetting({ key: "tokens", value: tokens }))

        return address
    }
)

/**
 * Tạo ngẫu nhiên số lượng coin hoặc token và gắn số lượng vào thuộc tính ví
 * @param {Signer[]} wallets danh sách ví
 * @param {float} min số lượng tối thiểu
 * @param {float} max số lượng tối đa
 * @param {address} tokenAddress địa chỉ contract token
 * @param {BigInt} decimals số thập phân: ví dụ 10^18
 * @returns {Signer[]} trả về danh sách ví đã gắn số lượng vào thuộc tính ví, {address, privateKey, balance, "0x...": 1.0}
 */
export function randomAmounts(wallets = [], min, max, tokenAddress = "balance", decimals = TenPower()) {
    return wallets.map(w => {
        let wallet = { ...w }
        wallet[tokenAddress] = new BigInt(getRandomFloat(min, max)) * decimals
        return wallet;
    })
}

/**
 * Tạo ngẫu nhiên số lượng coin hoặc token và gắn số lượng vào thuộc tính ví theo danh sách index được chọn
 * @param {Signer[]} wallets danh sách ví
 * @param {int[]} indexs mảng các ví được chọn
 * @param {float} min số lượng tối thiểu
 * @param {float} max số lượng tối đa
 * @param {address} tokenAddress địa chỉ contract token
 * @param {BigInt} decimals số thập phân: ví dụ 10^18
 * @returns {Signer[]} trả về danh sách ví đã gắn số lượng vào thuộc tính ví, {address, privateKey, balance, "0x...": 1.0}
 */
export function randomAmountsByIndexs(wallets = [], indexs = [], min, max, tokenAddress = "balance", decimals = TenPower()) {
    return wallets.map((w, i) => {
        if (indexs.includes(i)) {
            let wallet = { ...w }
            wallet[tokenAddress] = BigInt(getRandomFloat(min, max)) * decimals
            return wallet;
        } else
            return w;
    })
}

/**
 * gán số dư cho 1 ví 
 * @param {Signer[]} wallets danh sách ví
 * @param {address | "balance"} TokenAddress địa chỉ contract token, nếu là coin thì là "balance"
 * @param {address} address địa chỉ ví người dùng
 * @param {BigInt} amount số lượng
 * @returns {Signer[]} trả về danh sách ví đã gắn số lượng vào thuộc tính ví, {address, privateKey, balance, "0x...": 1.0}
 */
export function setAmount(wallets = [], TokenAddress, address, amount) {
    return wallets.map(w => {
        let wallet = { ...w }
        if (address == w.address) {
            wallet[TokenAddress] = amount
        } return wallet;
    })
}

export const Tokens = createSlice({
    name: "Tokens",
    /**
     * initialState
     * mỗi token sẽ có địa chỉ là key
     * value là @param { Contract} instance : {
     *      name: @param {string},
     *      symbol: @param {string},
     *      decimals: @param {int},
     *      totalSupply: @param {web3.utils.BN},
     * }
     */
    initialState: {
        // "0x2566d2dfdeEBBC63d1dD070d462901A535570D21": null,
    },
    reducers: {
        setTokens(state, action) {
            Object.assign(state, action.payload)
        }
    },

    extraReducers: (builder) => {
        builder.addCase(addContract.fulfilled, (state, action) => {
            state[action.payload.target] = action.payload
            setTimeout(() => {
                event.emit("addContractSuccess", action.payload)
            }, 100);
        })

        builder.addCase(getInfoAll.fulfilled, (state, action) => {
            Object.assign(state, action.payload)
            setTimeout(() => {
                event.emit("getInfoAllSuccess", action.payload)
            }, 100);
        })

        builder.addCase(remove.fulfilled, (state, action) => {
            delete state[action.payload]
            setTimeout(() => {
                event.emit("removeSuccess", action.payload)
            }, 100);
        })
    }
})


export const { setTokens } = Tokens.actions;

export default Tokens.reducer;