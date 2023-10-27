/* global BigInt */
/**
 * quản lí các Tokens
 */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { EventEmitter } from "events";
import { saveSetting } from "./Settings";
import { TenPower, getRandomFloat } from "../std";
import { Contract, JsonRpcSigner, Provider } from "ethers";
import { AsyncThunkConfig, RootState } from ".";
import { GetThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";

const { log, warn, error } = console


/**
 * TokenEvent.on ( "addContractSuccess" | "getInfoAllSuccess" | "balanceOfAll" | "balanceOf" )
 */
export let TokenEvent = new EventEmitter()


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
    async (args: any, thunkAPI): Promise<Contract> => {
        let { abi, address } = args
        let { web3 } = (await thunkAPI.getState() as RootState).Web3;

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
export async function getInfo(instance: Contract) {
    let info = {
        name: await instance.name(),
        symbol: await instance.symbol(),
        decimals: 10 ** Number(await instance.decimals()),
        totalSupply: Number(await instance.totalSupply()),
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
export async function allowancesOf(contracts: Contract[] = [], owner: string, spender: string, index = 0): Promise<{ [name: string]: any }> {
    if (contracts && index < contracts.length) {
        let allowance = 0;
        if (!contracts[index]) {
            return await allowancesOf(contracts, owner, spender, index + 1);
        } else {
            allowance = await contracts[index].allowance(owner, spender)
        }

        let next = await allowancesOf(contracts, owner, spender, index + 1);
        let address: string = contracts[index].address as unknown as string
        next[address] = allowance;

        TokenEvent.emit("allowancesOf", { owner, spender, contract: contracts[index], allowance })
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
export async function allowancesOfAll(contracts = [], owners = [], spender: string, index = 0): Promise<any> {
    if (owners && index < owners.length) {
        let allowances = await allowancesOf(contracts, owners[index], spender);
        TokenEvent.emit("allowancesOfAll", { address: owners[index], contracts, allowances })

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
export async function balanceOf(contracts: Contract[], address: string, index = 0): Promise<any> {
    if (contracts && index < contracts.length) {
        let balance = 0;
        if (!contracts[index]) {
            return await balanceOf(contracts, address, index + 1);

        } else if (contracts[index].getBalance) {
            balance = Number(await contracts[index].getBalance(address));

        } else {
            balance = Number(await contracts[index].balanceOf(address))
        }
        let next = await balanceOf(contracts, address, index + 1);
        let id = contracts[index].getBalance ? "balance" : contracts[index].target as string
        next[id] = balance;
        TokenEvent.emit("balanceOf", { address, contract: contracts[index], balance })
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
export async function balanceOfAll(contracts = [], addresses = [], index = 0): Promise<any> {
    if (addresses && index < addresses.length) {
        let balances = await balanceOf(contracts, addresses[index]);
        TokenEvent.emit("balanceOfAll", { address: addresses[index], contracts, balances })
        let next = await balanceOfAll(contracts, addresses, index + 1);
        next[addresses[index]] = balances;
        return next;
    } else return {}
}

/**
 * lấy thông tin của tất cả tokens
 * @param {Provider} web3 
 * @param {object[]} tokens mảng chứa địa chỉ contract và abi [address, abi]
 * @param {int} index số thứ tự trong mảng tokens
 * @returns {object} mảng chứa thông tin của tokens [{address: {name, symbol, decimals, totalSupply}}, ]
 */
type addressAbi = { address: string, abi: any }
export async function _getInfoAll(web3: Provider, tokens: addressAbi[], thunkAPI: GetThunkAPI<AsyncThunkConfig>, index = 0): Promise<any> {
    if (index < tokens.length) {
        const { address, abi } = tokens[index];
        let instance = new Contract(abi, address, web3)

        let next = await _getInfoAll(web3, tokens, thunkAPI, index + 1);

        try {
            let info = { ...(await getInfo(instance)), ...instance }
            next[address] = info;

            thunkAPI?.dispatch(setTokens(next))
        } catch (err) {
            // console.error(address, instance.currentProvider?.host || instance.currentProvider?.url, err.message.match("Returned values aren't valid, did it run Out of Gas?") ? "" : err.message)
            TokenEvent.emit("ContractNotFound", { address, abi })
            next[address] = undefined;
            thunkAPI?.dispatch(setTokens(next))
        }

        return next;
    } else {
        let init: { [name: string]: any } = {}
        tokens.forEach(({ address, abi }) => {
            init[address] = false;
        });
        return init;
    }
}

/**
 * lấy thông tin của tất cả tokens hiện tại
 * @param {address[]} _tokens danh sách địa chỉ tokens
 */
export const getInfoAll = createAsyncThunk(
    "getInfoAll",
    async (_tokens: string[], thunkAPI) => {
        let { web3 } = (await thunkAPI.getState() as any).MyWeb3;
        let { setting } = (await thunkAPI.getState() as any).Settings
        let tokens = _tokens || Object.keys((await thunkAPI.getState() as any).Tokens)

        let abi: any;
        if (typeof abi == "string") {
            abi = await loadAbi(abi)
        } else if (!abi)
            abi = await loadAbi()


        if (!tokens || tokens.length == 0)
            tokens = setting.tokens || []

        return await _getInfoAll(web3, tokens.map(address => ({ address, abi })), thunkAPI)
    }
)

export const remove = createAsyncThunk(
    "remove",
    async (address: string, thunkAPI) => {
        address = address.trim()
        let { Settings } = (await thunkAPI.getState() as any);

        let tokens = Settings.tokens.filter((v: string) => v != address)

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
export function randomAmounts(wallets: JsonRpcSigner[], min: Number, max: Number, tokenAddress = "balance", decimals = 1e18) {
    return wallets.map(w => {
        let wallet: { [name: string]: any } = { ...w }
        wallet[tokenAddress] = getRandomFloat(min, max) * decimals
        return wallet;
    })
}

/**
 * Tạo ngẫu nhiên số lượng coin hoặc token và gắn số lượng vào thuộc tính ví theo danh sách index được chọn
 * @param {JsonRpcSigner[]} wallets danh sách ví
 * @param {int[]} indexs mảng các ví được chọn
 * @param {float} min số lượng tối thiểu
 * @param {float} max số lượng tối đa
 * @param {address} tokenAddress địa chỉ contract token
 * @param {BigInt} decimals số thập phân: ví dụ 10^18
 * @returns {JsonRpcSigner[]} trả về danh sách ví đã gắn số lượng vào thuộc tính ví, {address, privateKey, balance, "0x...": 1.0}
 */
export function randomAmountsByIndexs(wallets: JsonRpcSigner[] = [], indexs: Number[] = [], min: Number, max: Number, tokenAddress = "balance", decimals = 1e18) {
    return wallets.map((w, i) => {
        if (indexs.includes(i)) {
            let wallet: { [name: string]: any } = { ...w }
            wallet[tokenAddress] = getRandomFloat(min, max) * decimals
            return wallet;
        } else
            return w;
    })
}

/**
 * gán số dư cho 1 ví 
 * @param {JsonRpcSigner[]} wallets danh sách ví
 * @param {address | "balance"} TokenAddress địa chỉ contract token, nếu là coin thì là "balance"
 * @param {address} address địa chỉ ví người dùng
 * @param {Number} amount số lượng
 * @returns {JsonRpcSigner[]} trả về danh sách ví đã gắn số lượng vào thuộc tính ví, {address, privateKey, balance, "0x...": 1.0}
 */
export function setAmount(wallets: JsonRpcSigner[] = [], TokenAddress: string, address: string, amount: Number) {
    return wallets.map(w => {
        let wallet: { [name: string]: any } = { ...w }
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
        builder.addCase(addContract.fulfilled, (state: any, action) => {
            let address = action.payload.target
            state[address.toString()] = action.payload as Contract
            setTimeout(() => {
                TokenEvent.emit("addContractSuccess", action.payload)
            }, 100);
        })

        builder.addCase(getInfoAll.fulfilled, (state, action) => {
            Object.assign(state, action.payload)
            setTimeout(() => {
                TokenEvent.emit("getInfoAllSuccess", action.payload)
            }, 100);
        })

        builder.addCase(remove.fulfilled, (state: any, action) => {
            delete state[action.payload]
            setTimeout(() => {
                TokenEvent.emit("removeSuccess", action.payload)
            }, 100);
        })
    }
})


export const { setTokens } = Tokens.actions;

export default Tokens.reducer;