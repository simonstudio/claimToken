import React from 'react';
import { withTranslation } from 'react-i18next';
import { Col, Row, } from 'antd';
import { connect } from 'react-redux';
import "./Claim.scss"

const style = {
};


class Claim extends React.Component {
    state = {
    }

    componentDidMount() {
        let { t, i18n } = this.props;
        i18n.changeLanguage("vi");
    }

    render() {
        let { t } = this.props

        return (
            <Row>
                <Col span={12} offset={6}>
                    <div style={style}>
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
                            <div className="row">
                                <div className="col-6 text-1">Buy HAR Now</div>
                                <div className="col-6">
                                    <div className="text-2" style={{ alignItems: "center", display: "flex", justifyContent: "flex-end" }}>
                                        0x0000....000000
                                        <img src="images/ic_brower.png" alt="Hình ảnh" style={{ width: "13px", height: "13px" }} />
                                    </div>
                                </div>

                                <div className="mt-3 har-control">
                                    <div className="row">
                                        <div className="col-8">
                                            <input id="inputIn" type="number" className="custom-input" placeholder="0" />
                                        </div>
                                        <div className="col-4">
                                            <div className="d-flex justify-content-end align-items-center">
                                                <img src="images/ic_utsd.png" alt="tusd"
                                                    style={{ width: "22px", height: "22px", verticalAlign: "middle" }} />
                                                <div className="input-text ml-1">
                                                    USDT
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 custom-text-1">
                                            Balance: <span>0</span> | <span>Half</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 btn_swap_container">
                                    <img src="images/ic_swap.png" className="btn_swap" alt="swap" />
                                </div>
                                <div className="har-control">
                                    <div className="row">
                                        <div className="col-8">
                                            <input id="inputOut" type="number" className="custom-input" placeholder="0" readOnly />
                                        </div>
                                        <div className="col-4">
                                            <div className="d-flex justify-content-end align-items-center">
                                                <img src="images/ic_har.png" alt="tusd"
                                                    style={{ width: "22px", height: "22px", verticalAlign: "middle" }} />
                                                <div className="input-text ml-1">
                                                    HAR
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 custom-text-1">
                                            Balance: <span>0</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-3 mt-2 text-3">Rate</div>
                                <div className="col-9 mt-2 text-4">1 USDT = 2,000 HAR</div>

                                <div className="col-6 mt-2 text-3">Slippage Tolerance</div>
                                <div className="col-6 mt-2 text-4">0% </div>

                                <div className="col-5 mt-2 text-3">Symbol: HAR</div>
                                <div className="col-7 mt-2">
                                    <div className="text-5" style={{ alignItems: "center", display: "flex", justifyContent: "flex-end" }} >
                                        Import HAR Token
                                        <img src="images/ic_brower.png" alt="Hình ảnh" style={{ width: "13px", height: "13px" }} />
                                    </div>
                                </div>

                                <div className="col-8 mt-2 text-3">Generate your referral code</div>
                                <div className="col-4 mt-2 text-5">
                                    <div className="text-5" style={{ alignItems: "center", display: "flex", justifyContent: "flex-end" }}>
                                        Copy
                                        <img src="images/ic_copy.png" alt="Hình ảnh" style={{ width: "13px", height: "13px" }} />
                                    </div>
                                </div>

                                <div className="col-8 mt-2 text-3">Route</div>
                                <div className="col-4 mt-2 text-5"></div>

                                <div className="col-12 ">
                                    <a href="#" className="btn-conenct-wallet btn">
                                        Connect Wallet
                                    </a>
                                </div>
                            </div>
                        </div>


                    </div>
                </Col>
            </Row >
        )
    }
}


const mapStateToProps = (state, ownProps) => ({

});

export default connect(mapStateToProps, {

})(withTranslation()(Claim));

