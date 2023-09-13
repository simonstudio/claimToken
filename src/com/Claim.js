import React from 'react';
import { withTranslation } from 'react-i18next';
import { Button, Card, Col, Input, InputNumber, Row, notification, } from 'antd';
import { connect } from 'react-redux';
import { CHAINS, Web3Event, addTokenToMetamask, connectWeb3 } from '../store/Web3';
import { BNFormat, TenPower, error, getShortAddress, log } from '../std';
import { SettingsEvent, loadSetting } from '../store/Settings';
import { loadAbi } from '../store/Tokens';

import "./Claim.scss"
import BtnCopy from './BtnCopy';
import BigNumber from 'bignumber.js';

const style = {
};

let count = 0;

class Claim extends React.Component {
    state = {
        token: undefined, USDT: undefined,
        TokenAmount: 0, USDTAmount: 0,
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
                let { accounts, } = this.props
                let { TokenAddress, USDTAddress } = this.props.settings

                try {
                    let token = await this.loadToken(TokenAddress)
                    token.priceUSD = parseInt(await token.methods.priceUSD().call())
                    let tokenBalance = new BigNumber(await token.methods.balanceOf(accounts[0]).call())
                    this.setState({ token, tokenBalance })
                } catch (err) {
                    error(err)
                    notification.error({ message: "wrong address or chain: " + TokenAddress })
                }

                try {
                    let USDT = await this.loadToken(USDTAddress, "USDT")
                    let USDTBalance = new BigNumber(await USDT.methods.balanceOf(accounts[0]).call())
                    // log(USDTBalance.div(TenPower(await USDT.methods.decimals().call())).toString())
                    this.setState({ USDT, USDTBalance })
                } catch (err) {
                    error(err)
                    notification.error({ message: "wrong address or chain: " + USDTAddress })
                }
            }
        })
        count++;
    }

    async loadToken(address, abi = "Token") {
        let { t, web3, accounts, chainId, chainName, settings } = this.props
        abi = await loadAbi(abi)
        let token = new web3.eth.Contract(abi, address)
        // log(await token.methods.USDAddress().call())
        token.Symbol = await token.methods.symbol().call()
        token.decimals = TenPower(await token.methods.decimals().call())
        return token;
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
        this.props.connectWeb3()
    }

    onUSDTAmountChange(value) {
        let { token, USDTAmount } = this.state;
        if (token && token.priceUSD) {
            let TokenAmount = Math.abs(value) * token.priceUSD
            this.setState({ USDTAmount: Math.abs(value), TokenAmount })
        }
    }

    addTokenToMetamask(e) {
        let { token } = this.state
        if (token) {
            log(token.decimals.e)
            addTokenToMetamask(token._address, token.Symbol, token.decimals.e, document.location.origin + "images/token.png")
        }
    }

    render() {
        let { t, web3, accounts, chainId, chainName, settings } = this.props
        let { token, USDT, USDTBalance, tokenBalance, TokenAmount, USDTAmount } = this.state

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
                                        USDT
                                    </div>
                                </div>
                            } style={{ width: "100%" }} />
                            <Col span={24} className="custom-text-1">
                                Balance: <span>{USDT ? BNFormat(USDTBalance.div(USDT.decimals)) : 0}</span> | <span>Half</span>
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
                                <div onClick={this.addTokenToMetamask.bind(this)} className="text-5" style={{ alignItems: "center", display: "flex", justifyContent: "flex-end" }} >
                                    {t("Import")} {token?.Symbol} {t("Token")} &nbsp;
                                    <img src="images/ic_brower.png" style={{ width: "13px", height: "13px" }} />
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={12} className="mt-2 text-3">{t("Generate your referral code")}</Col>
                            <Col span={12} className="mt-2 text-5">
                                <div onClick={e => { navigator.clipboard.writeText(token?._address); }} className="text-5" style={{ alignItems: "center", display: "flex", justifyContent: "flex-end" }}>
                                    {getShortAddress(token?._address)} &nbsp;
                                    <BtnCopy value={token?._address} />
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={12} className="mt-2 text-3">{t("Route")}</Col>
                            <Col span={12} className="mt-2 text-5">{token ? ("USDT → " + token?.Symbol) : "..."}</Col>
                        </Row>

                        <Row>
                            {web3 ?
                                (<>
                                    <Button type="primary" className="btn-connect-wallet btn">
                                        {t("CLAIM")}
                                    </Button>
                                </>) :
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
    loadSetting: loadSetting,
})(withTranslation()(Claim));

