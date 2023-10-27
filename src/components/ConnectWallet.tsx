import { Component, ReactNode } from "react";
import { I18n } from "../i18";
import { connect } from "react-redux";
import { connectWeb3, getSigner } from "../store/Web3";
import { notification } from "antd";
import { loadSetting } from "../store/Settings";
import { addContract } from "../store/Tokens";
import { withTranslation } from "react-i18next";
import ButtonPrimary from "./atom/Button/ButtonPrimary";
import { Dialog, DialogTitle, List, ListItem, ListItemAvatar, Avatar, ListItemButton, ListItemText, } from "@mui/material";
import { blue } from '@mui/material/colors';
const { log } = console;

declare global {
    interface Window {
        ethereum: any
        [name: string]: any
    }
}

type Props = I18n & {
    [name: string | number]: any
}

type State = {
    [name: string]: any
}

class ConnectWallet extends Component<Props> {
    state: State = {
        dialogOpen: false,

        wallets: [{
            id: "metamask",
            name: "Metamask",
            url: "https://metamask.io/download",
            image: "/images/metamask.png"
        }, {
            id: "trust",
            name: "Trust Wallet",
            url: "https://trustwallet.com/download",
            image: "/images/trust.svg"
        }]
    }

    constructor(props: Props) {
        super(props);
        this.connectWeb3.bind(this)
        this.closeDialog.bind(this)
    }
    componentDidMount(): void {
        if (window && !window.ethereum) {
            this.setState({ dialogOpen: true })
        }
    }

    connectWeb3(e: any) {
        if (!window?.ethereum)
            return this.setState({ dialogOpen: true })

        let { t, i18n, web3, connectWeb3 } = this.props;

        connectWeb3()
    }

    closeDialog(e: any) {
        this.setState({ dialogOpen: false })
    };

    handleListItemClick(wallet: any) {
        window?.open?.(wallet.url, "_blank")?.focus();
    };

    render(): ReactNode {
        let { t, i18n, web3, connectWeb3 } = this.props;
        let { dialogOpen, wallets, } = this.state;

        return (<>
            <ButtonPrimary onClick={this.connectWeb3.bind(this)}> {t?.('connect wallet')}</ButtonPrimary>

            <Dialog onClose={this.closeDialog.bind(this)} open={dialogOpen}>
                <DialogTitle>{t?.("Install wallet")}</DialogTitle>
                <List sx={{ pt: 0 }}>
                    {wallets.map((wallet: any) => (
                        <ListItem disableGutters key={wallet.id}>
                            <ListItemButton onClick={() => this.handleListItemClick(wallet)}>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                        <img src={wallet.image} style={{ width: "77%" }} />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={wallet.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        </>)
    }
}

const mapStateToProps = (state: any, ownProps: any) => ({
    web3: state.Web3.web3,
    accounts: state.Web3.accounts,
    chainId: state.Web3.chainId,
    chainName: state.Web3.chainName,
    settings: state.Settings,
    tokens: state.Tokens
});

export default connect(mapStateToProps, {
    connectWeb3: connectWeb3,
    getSigner: getSigner,
    loadSetting: loadSetting,
    addContract: addContract,
})(withTranslation('homepage')(ConnectWallet));

