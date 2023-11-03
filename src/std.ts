// import Web3 from 'web3';
import { notification } from 'antd';
import BigNumber from 'bignumber.js';
import ethers, { formatEther } from 'ethers';
import React, { createElement } from 'react';

declare global {
    interface Window {
        ethereum: any
        [name: string]: any
    }
}

const CryptoJS = require('crypto-js');

const log = console.log
const warn = console.warn
const error = console.error
const tab = "	";
const enter = "\n";

export function numberToHex(number: Number) {
    return "0x" + number.toString(16)
}

function encryptString(content = "", password = "Secret Passphrase") {
    return CryptoJS.AES.encrypt(content, password).toString();
}

function decryptString(ciphertext = "", password = "Secret Passphrase") {
    return CryptoJS.AES.decrypt(ciphertext, password).toString(CryptoJS.enc.Utf8);
}

function copyText(text: string, callback: () => {}) {
    try {
        const input = document.createElement('input');
        input.setAttribute('readonly', 'readonly');
        input.setAttribute('value', text);
        document.body.appendChild(input);
        input.setSelectionRange(0, 9999);
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            if (callback) {
                callback();
            }
        }
        document.body.removeChild(input);
    } catch (err: any) {
        notification.error({ message: err.message });
    }
}

function randomString(e: number) {
    e = e || 32;
    var t = "ABCDEFGHIZKLMNOPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}

function randomNum(Min: number, Max: number) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
}

/**
 * 
 * @param time timestamp in seconds
 * @returns 
 */
function getTimeString(time: number) {
    //var date = new Date(time);
    var date = new Date(time * 1000);
    var year = date.getFullYear() + '-';
    var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var dates = date.getDate() + ' ';
    var hour = date.getHours() + ':';
    var min = date.getMinutes() + ':';
    var second = date.getSeconds();
    return year + month + dates + hour + min + second;
}

function getDomainName(hostName: string) {
    return hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".") - 1) + 1);
}

function getShortAddress(address = "0x", start = 2, end = 3) {
    return address.slice(0, start) + "..." + address.slice(address.length - end)
}

function cropLongString(string = "") {
    return string.substring(0, 4) + " ... " + string.substring(string.length - 3)
}

// function getOS() {
//     log(window.navigator)
//     var userAgent = window.navigator.userAgent,
//         platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
//         macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
//         windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
//         iosPlatforms = ['iPhone', 'iPad', 'iPod'],
//         os = null;

//     if (macosPlatforms.indexOf(platform) !== -1) {
//         os = 'Mac OS';
//     } else if (iosPlatforms.indexOf(platform) !== -1) {
//         os = 'iOS';
//     } else if (windowsPlatforms.indexOf(platform) !== -1) {
//         os = 'Windows';
//     } else if (/Android/.test(userAgent)) {
//         os = 'Android';
//     } else if (/Linux/.test(platform)) {
//         os = 'Linux';
//     }

//     return os;
// }

function hash(input: string) {
    return CryptoJS.SHA256('sha256').update(input).digest('hex');
}

function isUrl(url: string) {
    try {
        new URL(url)
        return true
    } catch (err: any) {
        return false;
    }
}

/**
 * tạo ngẫu nhiên 1 số trong khoảng min - max
 * @param {float} min 
 * @param {float} max 
 * @param {int} decimals số thập phân sau dấu chấm
 * @returns {float}
 */

let x: String = "12312323"
function getRandomFloat(min: String | Number, max: Number | String, decimals = 0) {
    if (typeof min === "string") min = Number(min)
    if (typeof max === "string") max = Number(max)

    if (min > max) {
        let m = max
        max = min
        min = m
    }
    if (!decimals) {
        let min_d = 0, max_d = 0;

        try { min_d = min.toString().split(".")[1].length } catch (err: any) { }
        try { max_d = max.toString().split(".")[1].length } catch (err: any) { }

        decimals = min_d > max_d ? min_d : max_d;
    }
    const str = ""// (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}

/**
 * chuyển số BigNumber thành số đơn vị thập phân, rút gọn số thập phân 4, xóa các số 0 ở cuối
 * @param {string | number} number số đầu vào
 * @param {string | number} decimals số thập phân
 * @returns {number} 
 */
function BNToNumber(number: string | number, decimals = 18) {
    let _number = new BigNumber(number)
    let _decimals = (new BigNumber(10)).pow(decimals)
    return _number.div(_decimals)
}

/**
 * tạo số BigNumber: 10^18
 * @param {int} decimals số thập phân
 * @returns {BigNumber}
 */
function TenPower(decimals = 18) {
    return new BigNumber(10).pow(decimals)
}

function formatNumberWithCommas(n: number) {
    const reversedNumber = parseInt(Math.abs(n).toString()).toString().split('').reverse().join('');
    let formattedNumber = '';
    for (let i = 0; i < reversedNumber.length; i++) {
        formattedNumber += reversedNumber[i];
        if ((i + 1) % 3 === 0 && i + 1 !== reversedNumber.length) {
            formattedNumber += ',';
        }
    }
    return (n < 0 ? "-" : "") + formattedNumber.split('').reverse().join('');
}

/**
 * '0.0000000001900000' => 0.0<sub>8</sub>19
 * '1514546320.0000000001900000' => 1,514,546,320.0<sub>8</sub>19
 * @param {BigNumber} bigNumber 
 * @returns {string}
 */
function BNFormat(_number: bigint | number, decimals = 3) {
    if (isNaN(Number(_number)))
        return "";

    let n = _number.toString();
    let integerPart = parseInt(n);
    let decimalPart = Number(n) - integerPart;

    let int = formatNumberWithCommas(integerPart);  // integerPart.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    if (decimals === 0) {
        return int
    }

    if (decimalPart) {
        let decimalPart_string = decimalPart.toString().slice(2)
        let d = parseInt(decimalPart_string).toString();
        let sub = decimalPart_string.length - d.length - 1;

        // let d_length = decimals
        // if (integerPart.length > 4)
        //     d_length = 2
        // if (integerPart.length == 4)
        //     d_length = 3
        // if (integerPart.length == 3)
        //     d_length = 4
        // if (integerPart.length == 2)
        //     d_length = 5
        let d_slice = Number(d.slice(0, decimals) + '.' + d.slice(decimals))
        d = parseFloat('0.' + Math.floor(d_slice)).toString().slice(2)

        if (sub > 0) {
            return createElement("label", null,
                int,
                ".0",
                createElement("sub", null, sub),
                d,
            )
            // return `${int}.0<sub>${sub}</sub>${d}`;

        } else if (sub == 0)
            return `${int}.0${d}`;
        else
            return `${int}.${d}`;
    } else
        return int;
}

function BNFormat_(_number: bigint | number, decimals = 6) {
    if (isNaN(Number(_number)))
        return "0";
    // let n = Math.round(Number(_number) * 10 ** decimals) / 100 ** decimals

    let bn = new BigNumber(_number.toString())
    return bn.toFormat()
}
window.formatEther = formatEther
window.BNFormat = BNFormat
export {
    getShortAddress,
    tab, enter,
    BNToNumber, TenPower,
    log, warn, error,
    encryptString, decryptString,
    copyText, randomNum,
    getTimeString, getDomainName,
    // getOS, 
    cropLongString,
    hash, isUrl,
    getRandomFloat,
    BNFormat,
}
