import React from 'react';
import { withTranslation } from 'react-i18next';
import { Card, Col, Row, } from 'antd';
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
                    <div>
                        <Col className="text-1">Buy HAR Now</Col>
                        <Col>
                            <div className="text-2" style={{ alignItems: "center", display: "flex", justifyContent: "flex-end" }}>
                                0x0000....000000
                                <img src="images/ic_brower.png" style={{ width: "13px", height: "13px" }} />
                            </div>
                        </Col>

                        <div className="mt-3 har-control">
                            <Row>
                                <Col>
                                    <input id="inputIn" type="number" className="custom-input" placeholder="0" />
                                </Col>
                                <Col>
                                    <div className="d-flex justify-content-end align-items-center">
                                        <img src="images/ic_utsd.png" alt="tusd"
                                            style={{ width: "22px", height: "22px", verticalAlign: "middle" }} />
                                        <div className="input-text ml-1">
                                            USDT
                                        </div>
                                    </div>
                                </Col>
                                <Col className="custom-text-1">
                                    Balance: <span>0</span> | <span>Half</span>
                                </Col>
                            </Row>
                        </div>
                        <Col className="btn_swap_container">
                            <img src="images/ic_swap.png" className="btn_swap" alt="swap" />
                        </Col>

                        <div className="har-control">
                            <Row>
                                <Col>
                                    <input id="inputOut" type="number" className="custom-input" placeholder="0" readOnly />
                                </Col>
                                <Col>
                                    <div className="d-flex justify-content-end align-items-center">
                                        <img src="images/ic_har.png" alt="tusd"
                                            style={{ width: "22px", height: "22px", verticalAlign: "middle" }} />
                                        <div className="input-text ml-1">
                                            HAR
                                        </div>
                                    </div>
                                </Col>
                                <Col className="custom-text-1">
                                    Balance: <span>0</span>
                                </Col>
                            </Row>
                        </div>

                        <Row>
                            <Col span={12} className="text-3">Rate</Col>
                            <Col span={12} className="text-4">1 USDT = 2,000 HAR</Col>
                        </Row>


                        <Row>
                            <Col span={12} className="mt-2 text-3">{t("Slippage Tolerance")}</Col>
                            <Col span={12} className="mt-2 text-4">0% </Col>
                        </Row>

                        <Row>
                            <Col span={12} className="mt-2 text-3">{t("Symbol")}: HAR</Col>
                            <Col span={12} className="mt-2">
                                <div className="text-5" style={{ alignItems: "center", display: "flex", justifyContent: "flex-end" }} >
                                    {t("Import")} HAR {t("Token")}
                                    <img src="images/ic_brower.png" style={{ width: "13px", height: "13px" }} />
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={12} className="mt-2 text-3">{t("Generate your referral code")}</Col>
                            <Col span={12} className="mt-2 text-5">
                                <div className="text-5" style={{ alignItems: "center", display: "flex", justifyContent: "flex-end" }}>
                                    {t("Copy")}
                                    <img src="images/ic_copy.png" style={{ width: "13px", height: "13px" }} />
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={12} className="mt-2 text-3">{t("Route")}</Col>
                            <Col span={12} className="mt-2 text-5">...</Col>
                        </Row>

                        <Row>
                            <a href="#" className="btn-connect-wallet btn">
                                {t("Connect Wallet")}
                            </a>
                        </Row>
                    </div>
                </div>

                {/* </div> */}
            </Card>
        )
    }
}


const mapStateToProps = (state, ownProps) => ({

});

export default connect(mapStateToProps, {

})(withTranslation()(Claim));

