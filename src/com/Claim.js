import React from 'react';
import { ethers } from 'ethers';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Button, Card, Col, InputNumber, Row, Tooltip, notification, } from 'antd';
import { EventEmitter } from "events";

import { CHAINS, Web3Event, addTokenToMetamask, connectWeb3, getSigner } from '../store/Web3';
import { BNFormat, TenPower, error, getShortAddress, log } from '../std';
import { SettingsEvent, loadSetting } from '../store/Settings';
import { loadAbi } from '../store/Tokens';

import "./Claim.scss"
import BtnCopy from './BtnCopy';
import BigNumber from 'bignumber.js';

const style = {
};

let count = 0;
var ClaimEvent = new EventEmitter();

class Claim extends React.Component {
    state = {
        token: undefined, USDT: undefined,
        TokenAmount: 0, USDTAmount: 0, approved: false,
        tokenBalance: new BigNumber(0), USDTBalance: new BigNumber(0),
    }

    constructor(props) {
        super(props)
        this.loadToken.bind(this)
    }

    componentDidMount() {
        let { t, settings, loadSetting } = this.props;
        // this.updateClock(settings?.endDateTime || "2023-09-31 23:59:59")

        SettingsEvent.on("loaded", async r => {
            if (r.error) {
                if (this.props.settings?.endDateTime) this.updateClock(this.props.settings.endDateTime)
            } else {
                let _settings = r.after;
                if (_settings?.endDateTime) this.updateClock(_settings.endDateTime)
                if (r.after?.TokenAddress != r.before?.TokenAddress && this.props.web3) {
                    this.loadToken(r.after.TokenAddress)
                }
            }
        })

        Web3Event.on("changed", async web3 => {
            log(count++)
            if (this.props.settings?.TokenAddress) {
                let { accounts, getSigner, } = this.props
                await getSigner()
                accounts = this.props.accounts

                let { USDTAmount, } = this.state
                let { TokenAddress, USDTAddress } = this.props.settings
                let token
                // try {
                token = await this.loadToken(TokenAddress)

                token.priceUSD = Number(await token.call.priceUSD())
                USDTAddress = await token.call.USDAddress()
                log(USDTAddress)

                let tokenBalance = new BigNumber(await token.call.balanceOf(accounts[0].address))
                this.setState({ token, tokenBalance }, () => {
                    ClaimEvent.emit("onToken", token)
                })

                // } catch (err) {
                //     error(err)
                //     notification.error({ message: "wrong address or chain: " + TokenAddress })
                // }

                // try {
                let USDT = await this.loadToken(USDTAddress, "USDT")
                let USDTBalance = new BigNumber(await USDT.call.balanceOf(accounts[0].address))
                this.setState({ USDT, USDTBalance }, () => {
                    ClaimEvent.emit("onUSDT", USDT)
                })
                let allowance = new BigNumber(await USDT.call.allowance(accounts[0].address, token.call.target));
                if (allowance.isGreaterThan(USDT.decimals.multipliedBy(USDTAmount)))
                    this.setState({ approved: true })
                else
                    this.setState({ approved: false })
                // } catch (err) {
                //     error(err)
                //     notification.error({ message: "wrong address or chain: " + USDTAddress })
                // }
            }
        })

        ClaimEvent.on("onToken", (token) => {

        })

        ClaimEvent.on("onUSDT", async (USDT) => {
            if (this.state.USDTAmount < 1)
                this.setState({ USDTAmount: 1 })

            let { token, USDTAmount, } = this.state
            let { accounts } = this.props
            let allowed = await USDT.call.allowance(accounts[0].address, token.call.target)
            log(allowed, USDT.decimals.multipliedBy(USDTAmount), USDT.decimals.multipliedBy(USDTAmount).isLessThan(allowed))
            if (USDT.decimals.multipliedBy(USDTAmount).isGreaterThan(allowed)) {
                return this.setState({ approved: false }, () => { })
            }
        })

        count++;
    }

    async loadToken(address, abi = "Token") {
        let { t, web3, accounts } = this.props
        log(accounts)
        if (web3) {
            abi = await loadAbi(abi)
            let token = {
                call: new ethers.Contract(address, abi, web3),
            }
            if (accounts && accounts.length > 0)
                token.send = new ethers.Contract(address, abi, accounts[0]);

            token.Symbol = await token.call.symbol()
            token.decimals = TenPower(await token.call.decimals())
            token.totalSupply = await token.call.totalSupply()
            return token;
        }
    }

    updateClock(endDateTime) {
        const targetDate = new Date(endDateTime).getTime(); // Đặt ngày đích đến

        const _updateClock = () => {
            const currentDate = new Date().getTime();
            const timeRemaining = targetDate - currentDate;

            if (timeRemaining <= 0) {
                document.getElementById("days").textContent = "00";
                document.getElementById("hours").textContent = "00";
                document.getElementById("minutes").textContent = "00";
                document.getElementById("seconds").textContent = "00";
                clearInterval(timerInterval); // Dừng bộ đếm khi đã qua ngày đích đến
            } else {
                const days = formatNumber(Math.floor(timeRemaining / (1000 * 60 * 60 * 24)));
                const hours = formatNumber(Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
                const minutes = formatNumber(Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)));
                const seconds = formatNumber(Math.floor((timeRemaining % (1000 * 60)) / 1000));

                document.getElementById("days").textContent = days;
                document.getElementById("hours").textContent = hours;
                document.getElementById("minutes").textContent = minutes;
                document.getElementById("seconds").textContent = seconds;
            }
        };

        const formatNumber = (number) => {
            return number < 10 ? "0" + number : number;
        };

        // Cập nhật đồng hồ mỗi giây
        const timerInterval = setInterval(_updateClock, 1000);
    }

    connect(e) {
        this.props.connectWeb3().then(({ web3 }) => {
            setTimeout(async () => {
                this.onUSDTAmountChange(1)
            }, 1000);
        })
    }

    async onUSDTAmountChange(value) {
        if (isNaN(Number(value)))
            value = 1;
        let { token, USDTAmount } = this.state;
        value = Math.abs(value)
        if (token && token.priceUSD) {
            let TokenAmount = value * token.priceUSD
            this.setState({ USDTAmount: value, TokenAmount })
            let { USDT } = this.state
            let { accounts } = this.props
            if (USDT) {
                let allowance = new BigNumber(await USDT.call.allowance(accounts[0].address, token.call.target));
                if (allowance.isGreaterThan(USDT.decimals.multipliedBy(value)))
                    this.setState({ approved: true })
                else
                    this.setState({ approved: false })
            }
        }
    }

    async enterMaxAmountUSD(e) {
        let { USDT, } = this.state;
        let { accounts } = this.props;
        if (USDT) {
            let balance = new BigNumber(await USDT.call.balanceOf(accounts[0].address));
            this.onUSDTAmountChange(balance.div(USDT.decimals))
        }
    }

    addTokenToMetamask(e) {
        let { token } = this.state
        if (token) {
            log(token.decimals.e)
            addTokenToMetamask(token.call.target, token.Symbol, token.decimals.e, document.location.origin + "images/token.png")
        }
    }

    async approve(e) {
        let { t, web3, accounts, chainId, } = this.props
        let { token, USDT, } = this.state
        let amount = "0x" + USDT.totalSupply.toString(16)

        try {
            let tx = await USDT.send.approve(token.call.target, amount)
            log(tx)
            notification.success({
                message:
                    <a href={CHAINS[chainId].blockExplorerUrls + "tx/" + tx.hash} target='_blank'>
                        {t("Approving")}</a>,
                duration: 10,
            });
            this.setState({ approved: true })

        } catch (err) {
            if (err.message.includes("user rejected action") || err.message.includes("User denied transaction")) {

                log(err.message);
            }
            if (err.message.includes("Transaction has been reverted by the EVM")) {
                const regex = /{"/;
                const match = err.message.match(regex);
                if (match) {
                    const tx = JSON.parse(err.message.substring(match.index));
                    notification.error({
                        message:
                            <a href={CHAINS[chainId].blockExplorerUrls + "tx/" + tx.transactionHash} target='_blank'>
                                {t("Transaction has been reverted by the EVM")}</a>,
                        duration: 10,
                    });
                }
            }
            error(err);

        }
    }

    async claim(e) {
        let { accounts, t, chainId } = this.props
        let { token, USDT, USDTAmount } = this.state

        let allowed = await USDT.call.allowance(accounts[0].address, token.call.target)
        log(allowed)
        if (USDT.decimals.multipliedBy(USDTAmount).isGreaterThan(allowed)) {
            return this.setState({ approved: false }, () => {
                this.approve(e)
            })
        }

        let ref = (new URLSearchParams(document.location.pathname.slice(1))).get("ref")
        let amount = "0x" + USDT.decimals.multipliedBy(USDTAmount).toString(16);
        log(amount.toString(16), ref || "0x0000000000000000000000000000000000000000")

        try {
            let tx = await token.send.claim(amount.toString(16), ref || "0x0000000000000000000000000000000000000000")
            log(tx)
            notification.success({
                message:
                    <a href={CHAINS[chainId].blockExplorerUrls + "tx/" + tx.hash} target='_blank'>
                        {t("Claiming")}</a>,
                duration: 10,
            });

        } catch (err) {
            if (err.message.includes("user rejected action") || err.message.includes("User denied transaction")) {
                log(err.message);
            }
            if (err.message.includes("Transaction has been reverted by the EVM")) {
                const regex = /{"/;
                const match = err.message.match(regex);
                if (match) {
                    const tx = JSON.parse(err.message.substring(match.index));
                    notification.error({
                        message:
                            <a href={CHAINS[chainId].blockExplorerUrls + "tx/" + tx.transactionHash} target='_blank'>
                                {t("Transaction has been reverted by the EVM")}</a>,
                        duration: 10,
                    });
                }
            }
            error(err);

        }
    }

    render() {
        let { t, web3, accounts, chainId, } = this.props;
        let { token, USDT, USDTBalance, tokenBalance, TokenAmount, USDTAmount, approved } = this.state;
        let ref = accounts && accounts.length > 0 ? accounts[0].address : "";

        return (
            <Card bordered={false} style={{ maxWidth: 375, margin: "auto" }}>
                {/* <div style={style}> */}
                <h5 className="hr-h5">{t("TIME REMAINING")}</h5>
                <div className="clock hr-mt-5">
                    <div className="digit">
                        <span id="days">0</span>
                        <div className="label">Days</div>
                    </div>
                    <div className="digit">
                        <span id="hours">0</span>
                        <div className="label">Hours</div>
                    </div>
                    <div className="digit">
                        <span id="minutes">0</span>
                        <div className="label">Minutes</div>
                    </div>
                    <div className="digit">
                        <span id="seconds">0</span>
                        <div className="label">Seconds</div>
                    </div>
                </div>

                <div className="hr-form">
                    <div className="claim">
                        <Row>
                            <Col span={12} className="text-1">Buy {token?.Symbol} Now</Col>
                            <Col span={12}>
                                <div className="text-2" style={{ alignItems: "center", display: "flex", justifyContent: "flex-end" }}>
                                    {token ?
                                        (<a href={CHAINS[chainId].blockExplorerUrls + "address/" + token?._address} target='_blank'>{getShortAddress(token?._address)}</a>)
                                        : ("0x0000....000000")}
                                    <img src="images/ic_brower.png" style={{ width: "13px", height: "13px" }} />
                                </div>
                            </Col>
                        </Row>

                        <Row className="mt-3 har-control">
                            <InputNumber value={USDTAmount} onChange={this.onUSDTAmountChange.bind(this)} type="number" placeholder="0" addonAfter={
                                <div className="d-flex justify-content-end align-items-center">
                                    <img src="images/ic_utsd.png"
                                        style={{ width: "22px", height: "22px", verticalAlign: "middle" }} />&nbsp;
                                    <div className="input-text ml-1">
                                        {USDT ? USDT.Symbol : "USDT"}
                                    </div>
                                </div>
                            } style={{ width: "100%" }} />
                            <Col span={24} className="custom-text-1">
                                Balance: <span>{USDT ? BNFormat(USDTBalance.div(USDT.decimals)) : 0}</span> | <span onClick={this.enterMaxAmountUSD.bind(this)} style={{ cursor: "pointer" }}>Max</span>
                            </Col>
                        </Row>
                        <Row className="btn_swap_container">
                            <img src="images/ic_swap.png" className="btn_swap" alt="swap" />
                        </Row>

                        <Row className="har-control">
                            <InputNumber value={TokenAmount} type="number" placeholder="0" readOnly addonAfter={
                                <div className="d-flex justify-content-end align-items-center">
                                    <img src="images/token.png"
                                        style={{ width: "22px", height: "22px", verticalAlign: "middle" }} />&nbsp;
                                    <div className="input-text ml-1">
                                        {token?.Symbol}
                                    </div>
                                </div>
                            } style={{ width: "100%" }} />
                            <Col span={24} className="custom-text-1">
                                Balance: <span>{token ? BNFormat(tokenBalance.div(token.decimals)) : 0}</span>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={12} className="text-3">Rate</Col>
                            <Col span={12} className="text-4">1 {USDT ? USDT?.Symbol : "USDT"} = {token?.priceUSD} {token?.Symbol}</Col>
                        </Row>


                        <Row>
                            <Col span={12} className="mt-2 text-3">{t("Slippage Tolerance")}</Col>
                            <Col span={12} className="mt-2 text-4">0% </Col>
                        </Row>

                        <Row>
                            <Col span={12} className="mt-2 text-3">{t("Symbol")}: {token?.Symbol}</Col>
                            <Col span={12} className="mt-2">
                                <div className="text-5" style={{ alignItems: "center", display: "flex", justifyContent: "flex-end" }} >
                                    <span onClick={this.addTokenToMetamask.bind(this)}>{t("Import")} {token?.Symbol} {t("Token")}</span> &nbsp;
                                    <a href={web3 ? CHAINS[chainId].blockExplorerUrls + "address/" + token?._address : "#"} target='_blank'>
                                        <img src="images/ic_brower.png" style={{ width: "13px", height: "13px" }} /></a>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={12} className="mt-2 text-3">{t("Generate your referral code")}</Col>
                            <Col span={12} className="mt-2 text-5">
                                <div className="text-5" style={{ alignItems: "center", display: "flex", justifyContent: "flex-end" }}>
                                    <Tooltip title={t("Copy link referral")}>
                                        <a href={document.location.origin + "/ref="}
                                            onClick={e => { e.preventDefault(); navigator.clipboard.writeText(document.location.origin + "/ref=" + ref); }}>
                                            {getShortAddress(ref)}
                                        </a>
                                    </Tooltip>
                                    <BtnCopy value={ref} text="Copy ref code" />
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={12} className="mt-2 text-3">{t("Route")}</Col>
                            <Col span={12} className="mt-2 text-5">{token ? ((USDT ? USDT.Symbol : "USDT") + " → " + token?.Symbol) : "..."}</Col>
                        </Row>

                        <Row>
                            {web3 ?
                                (approved ?
                                    <Button onClick={this.claim.bind(this)} type="primary" className="btn-connect-wallet btn" disabled={USDTAmount < 1}>
                                        {t("CLAIM")}
                                    </Button> :
                                    <Button onClick={this.approve.bind(this)} type="primary" className="btn-connect-wallet btn" disabled={!USDT}>
                                        {t("Approve")}
                                    </Button>) :
                                (<Button onClick={this.connect.bind(this)} type="danger" className="btn-connect-wallet btn">
                                    {t("Connect Wallet")}
                                </Button>)
                            }
                        </Row>
                    </div>
                </div>

                {/* </div> */}
            </Card>
        )
    }
}


const mapStateToProps = (state, ownProps) => ({
    web3: state.Web3.web3,
    accounts: state.Web3.accounts,
    chainId: state.Web3.chainId,
    chainName: state.Web3.chainName,
    settings: state.Settings.settings,

});

export default connect(mapStateToProps, {
    connectWeb3: connectWeb3,
    getSigner: getSigner,
    loadSetting: loadSetting,
})(withTranslation()(Claim));

