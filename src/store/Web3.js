/**
 * quản lí web3 từ trình duyệt
 */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ethers, } from "ethers";
import { notification } from 'antd';
import { log, logwarn, logerror } from "../std"
import { EventEmitter } from "events";

export var Web3Event = new EventEmitter();

const dev = {
    TEST: 'TEST',
    MAINNET: 'MAINNET'
}

function numberToHex(number) {
    return "0x" + number.toString(16)
}

export const CHAINS = {
    1337: {
        id: 1337,
        nativeCurrency: {
            name: 'Ether test', decimals: 18, symbol: 'ETH'
        },
        chainId: numberToHex(1337),
        icon: "eth.svg",
        rpcUrls: ['HTTP://127.0.0.1:8545'],
        chainName: 'Local',
        blockExplorerUrls: "http://localhost:8545/",
        dev: dev.TEST,
    },
    31337: {
        id: 31337,
        nativeCurrency: {
            name: 'Ether test', decimals: 18, symbol: 'ETH'
        },
        chainId: numberToHex(31337),
        icon: "eth.svg",
        rpcUrls: ['http://127.0.0.1:8545/'],
        chainName: 'Local',
        blockExplorerUrls: "http://127.0.0.1:8545/",
        dev: dev.TEST,
    },
    5777: {
        id: 5777,
        nativeCurrency: {
            name: 'Ether test', decimals: 18, symbol: 'ETH'
        },
        chainId: numberToHex(5777),
        icon: "eth.svg",
        rpcUrls: ['HTTP://127.0.0.1:7545'],
        chainName: 'Local',
        blockExplorerUrls: "http://localhost:8545/",
        dev: dev.TEST,
    },
    1: {
        id: 1,
        nativeCurrency: {
            name: 'Ethereum', decimals: 18, symbol: 'ETH'
        },
        chainId: numberToHex(1),
        icon: "eth.svg",
        rpcUrls: ['wss://mainnet.infura.io/v3/d41e02ee7f344eb6ba4b9239f853de51'],
        chainName: 'Ethereum',
        blockExplorerUrls: ['https://etherscan.io/'],
        dev: dev.MAINNET
    },
    5: {
        id: 5,
        nativeCurrency: {
            name: 'Ethereum', decimals: 18, symbol: 'ETH'
        },
        chainId: numberToHex(5),
        icon: "eth.svg",
        rpcUrls: ['https://goerli.infura.io/v3/d41e02ee7f344eb6ba4b9239f853de51'],
        chainName: 'Goerli',
        blockExplorerUrls: ['https://goerli.etherscan.io/'],
        dev: dev.TEST
    },
    97: {
        id: 97,
        nativeCurrency: {
            name: 'tBNB', decimals: 18, symbol: 'tBNB'
        },
        icon: "bnb.svg",
        chainId: numberToHex(97),
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
        chainName: 'Binance Smart Chain Testnet',
        blockExplorerUrls: ['https://testnet.bscscan.com/'],
        iconUrls: "https://testnet.bscscan.com/images/svg/brands/bnb.svg",
        dev: dev.TEST,
    },
    56: {
        id: 56,
        nativeCurrency: {
            name: 'BNB', decimals: 18, symbol: 'BNB'
        },
        chainId: numberToHex(56),
        icon: "bnb.svg",
        rpcUrls: ['https://bsc-dataseed1.binance.org'],
        chainName: 'Binance Smart Chain',
        blockExplorerUrls: ['https://bscscan.com/'],
        iconUrls: "https://bscscan.com/images/svg/brands/bnb.svg",
        dev: dev.MAINNET,
    },
    137: {
        id: 137,
        nativeCurrency: {
            name: 'Polygon', decimals: 18, symbol: 'MATIC'
        },
        chainId: numberToHex(137),
        icon: "bnb.svg",
        rpcUrls: ['https://polygonscan.com'],
        chainName: 'Polygon',
        blockExplorerUrls: ['https://polygonscan.com/'],
        iconUrls: "https://bscscan.com/images/svg/brands/bnb.svg",
        dev: dev.MAINNET,
    },

    arbitrum: {
        id: 42161,
        nativeCurrency: {
            name: 'Arbitrum', decimals: 18, symbol: 'ARB'
        },
        chainId: numberToHex(42161),
        rpcUrls: ['https://arb-mainnet.g.alchemy.com/v2/QSuJnN440-D76zeC9srLgjq1oOahYxjj'],
        chainName: 'Arbitrum',
        blockExplorerUrls: ['https://arbiscan.io/'],
        iconUrls: "https://testnet.arbiscan.io/images/svg/brands/arbitrum.svg",
        dev: dev.MAINNET,
    },
    arbitrumTest: {
        id: 421613,
        nativeCurrency: {
            name: 'Arbitrum Test', decimals: 18, symbol: 'ARB'
        },
        chainId: numberToHex(421613),
        rpcUrls: ['https://arb-goerli.g.alchemy.com/v2/GCDxJ9D1qG3ywdPTz5xTh-5INI6GT-uw'],
        chainName: 'Arbitrum Test',
        blockExplorerUrls: ['https://arbiscan.io/'],
        iconUrls: "https://testnet.arbiscan.io/images/svg/brands/arbitrum.svg",
        dev: dev.TEST,
    },
    "tron": {
        id: "tron",
        nativeCurrency: {
            name: 'Tron', decimals: 18, symbol: 'TRX'
        },
        chainId: numberToHex("tron"),
        icon: "tron.svg",
        rpcUrls: ['https://api.trongrid.io'],
        chainName: 'Tron',
        blockExplorerUrls: ['https://tronscan.org/'],
        iconUrls: "https://static.tronscan.org/production/logo/trx.png",
        dev: dev.MAINNET,
    },
    80001: {
        id: 80001,
        nativeCurrency: {
            name: 'MATIC', decimals: 18, symbol: 'MATIC'
        },
        chainId: numberToHex(80001),
        rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
        chainName: 'Polygon Testnet',
        blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
        dev: dev.TEST
    },
    43113: {
        id: 43113,
        nativeCurrency: {
            name: 'AVAX', decimals: 18, symbol: 'AVAX'
        },
        chainId: numberToHex(43113),
        rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
        chainName: 'Avalanche Testnet',
        blockExplorerUrls: ['https://testnet.snowtrace.io/'],
        dev: dev.TEST,
    },
    43114: {
        id: 43114,
        nativeCurrency: {
            name: 'AVAX', decimals: 18, symbol: 'AVAX'
        },
        chainId: numberToHex(43114),
        rpcUrls: ['https://avalanche.public-rpc.com'],
        chainName: 'Avalanche',
        blockExplorerUrls: ['https://snowtrace.io/'],
        dev: dev.MAINNET,
    },
    59140: {
        id: 59140,
        nativeCurrency: {
            name: 'linea goerli', decimals: 18, symbol: 'ETH'
        },
        chainId: numberToHex(59140),
        rpcUrls: ['https://linea-goerli.infura.io/v3/7b758e41cdea45c1a32f547d039b66ed'],
        chainName: 'linea goerli',
        blockExplorerUrls: ['https://snowtrace.io/'],
        dev: dev.MAINNET,
    },


    getParamsById: (id) => {
        //copy params
        let params = { ...Object.values(CHAINS).find(item => item.id === id) };
        const listParams = ['nativeCurrency', 'chainId', 'rpcUrls', 'chainName', 'blockExplorerUrls'];
        Object.keys(params).map(v => {
            if (!listParams.includes(v)) delete params[v];
        });
        return params;
    },
}

// if (window.ethereum)
//     window.ethereum.on('chainChanged', (_chainId) => window.location.reload());

export const connectWeb3 = createAsyncThunk(
    'connectWeb3',
    async (url, thunkAPI) => {
        // Wait for loading completion to avoid race conditions with web3 injection timing.
        // Modern dapp browsers...
        let web3 = null;
        let chainId = 0;

        try {
            if (url) {
                web3 = new ethers.JsonRpcProvider(url);
                log("connectWeb3:", url)

            } else if (window.ethereum) {
                web3 = new ethers.BrowserProvider(window.ethereum);
                log("connectWeb3: window.ethereum");

            } else {
                web3 = ethers.getDefaultProvider()
                log("getDefaultProvider", web3);

            }
            chainId = (await web3.getNetwork()).chainId;
        } catch (error) {
            throw error;
        }
        window.web3 = web3;
        window.thunk = thunkAPI;
        return { web3, chainId };
    }
)

export const getSigner = createAsyncThunk(
    'getSigner',
    async (args, thunkAPI) => {
        return await thunkAPI.getState().Web3.web3.getSigner()
    }
)

let _switchChain;

export const switchChain = createAsyncThunk(
    "switchChain",
    _switchChain = async (args, thunkAPI) => {

        let chainId = parseInt(args);
        if (chainId === 1337) chainId = 5777;

        let web3 = await thunkAPI.getState().Web3.web3;
        if (chainId == window.ethereum.networkVersion) return chainId
        if (!isNaN(chainId) && chainId != parseInt(window.ethereum.networkVersion)) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: web3.utils.toHex(chainId) }]
                })
                return window.ethereum.networkVersion;
            } catch (error) {
                // if chain was not added, add chain
                if (error.code === 4902 || error.code === -32603) {
                    let params = CHAINS.getParamsById(chainId);
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [params]
                        })
                        notification.success(["add chain " + params.chainName + " success"])
                        return _switchChain(args, thunkAPI);
                    } catch (error) {
                        console.error(error);
                        notification.error(error.message)
                    }
                } else {
                    console.error("chain error ", error)
                    notification.error(error.message)
                }
            }
        }
    }
)

export async function addTokenToMetamask(tokenAddress, tokenSymbol, tokenDecimals, tokenImage) {
    try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: tokenAddress, // The address that the token is at.
                    symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                    decimals: tokenDecimals, // The number of decimals in the token
                    image: tokenImage, // A string url of the token logo
                },
            },
        });

        if (wasAdded) {
            console.log('Thanks for your interest!');
        } else {
            console.log('Your loss!');
        }
    } catch (err) {
        console.log(err);
    }
}


export const web3Slice = createSlice({
    name: "web3",
    initialState: {
        web3: null,
        accounts: [],
        chainId: 5777,
        chainName: "web3"
    },
    reducers: {
        updateAccounts: (state, action) => {
            state.accounts = action.payload;
        },
        updateChain: (state, action) => {
            state.chainId = action.payload[0];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(connectWeb3.fulfilled, (state, action) => {
            state.web3 = action.payload.web3;

            if (CHAINS[action.payload.chainId]) {
                state.chainId = action.payload.chainId;
                state.chainName = CHAINS[action.payload.chainId].chainName;
            };

            if (window.ethereum) {
                // detect Metamask account change
                window.ethereum.on('accountsChanged', function (accounts) {
                    console.log('accountsChanges', accounts);
                    window.location.reload();
                });

                // detect Network account change
                window.ethereum.on('networkChanged', function (networkId) {
                    console.log('networkChanged', networkId);
                    window.location.reload();
                });

                window.ethereum.on('chainChanged', (_chainId) => {
                    log(_chainId)
                    window.location.reload()
                });

            }
            setTimeout(() => {
                Web3Event.emit("changed", action.payload.web3)
            }, 100);
        });

        builder.addCase(getSigner.fulfilled, (state, action) => {
            state.accounts = [action.payload]
        })

        builder.addCase(switchChain.fulfilled, (state, action) => {
            state.chainId = parseInt(action.payload)
            log('switched Chain: ', action.payload)
        })
    },
})


export const { updateAccounts, updateChain } = web3Slice.actions;
// log("actions", web3Slice)

export default web3Slice.reducer;