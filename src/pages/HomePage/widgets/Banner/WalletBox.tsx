import { Box, Button, CircularProgress, Divider, InputAdornment } from '@mui/material';
import { ContentCopy, CheckRounded } from '@mui/icons-material';
import { Component, ReactNode, createRef, } from 'react';
import Text from '../../../../components/atom/Text';
import Countdown from 'react-countdown';
import { BoxCountdown, InputOutlinedStyled } from '.';
import moment from 'moment';
import ETHICon from '../../../../assets/image/eth-icon.png';
import ButtonPrimary from '../../../../components/atom/Button/ButtonPrimary';
import ButtonOutline from '../../../../components/atom/Button/ButtonOutline';
import { withTranslation } from 'react-i18next';
import { I18n } from '../../../../i18';
import { BNFormat, error, log, numberToHex } from '../../../../std';
import { connect } from 'react-redux';
import { CHAINS, Web3Event, connectWeb3, getSigner } from '../../../../store/Web3';
import { SettingsEvent, loadSetting } from '../../../../store/Settings';
import { TokenEvent, addContract, balanceOf, getInfo, loadAbi } from '../../../../store/Tokens';
import { ReduxDispatchRespone } from '../../../../store';
import { message, notification, } from 'antd';
import { Contract, JsonRpcSigner, ethers, isAddress } from 'ethers';

declare global {
  interface Window {
    ethereum: any
    [name: string]: any
  }
}

type Props = I18n & {
  [name: string]: any,
}

type State = {
  [name: string]: any
}

type NET = 'TEST' | 'MAINNET'

interface CHAIN {
  id?: number | string;
  nativeCurrency: {
    name: string, decimals: number, symbol: string
  },
  chainId: number | string,
  icon: string,
  rpcUrls: string[],
  chainName: string,
  blockExplorerUrls: string[],
  dev: NET,
  [name: string]: any
}

var chains: Record<number | string, CHAIN> = {}
Object.values(CHAINS).forEach((chain: any) => {
  if (typeof chain === "object") {
    let _chain: CHAIN = chain;
    chains[_chain.chainId] = _chain
  }
})


class WalletBox extends Component<Props, State> {
  state: State = {
    pending: false,
    priceDeposit: 0,
    depositAmount: 0, depositTokenAmount: 0, minDeposit: 0,
    token: undefined,
    stake: undefined,
    referralAddress: "0x0000000000000000000000000000000000000000", linkRef: document.location.origin,
    currentWallet: undefined,
  };
  refDepositAmount: any;

  constructor(props: Props) {
    super(props);
    this.connectWeb3.bind(this)
    this.initContracts.bind(this)
    this.getInfo.bind(this)
    this.addTokenToWallet.bind(this)
    this.copyRefLink.bind(this)
    this.refDepositAmount = createRef()
  }

  componentDidMount(): void {
    console.clear()

    Web3Event.on("accountsChanged", async account => {
      const { tokens, settings, } = this.props;
      try {
        this.getInfo();
      } catch (err) {
        error(err)
      }
    })

    Web3Event.on("changed", r => {
      if (r.error) {
        error(r.error)
      } else {
        let referralAddress = (new URLSearchParams(new URL(document.location.href).search)).get("ref")
        if (isAddress(referralAddress)) {
          localStorage.setItem("referralAddress", referralAddress);
          this.setState({ referralAddress });
        } else {
          referralAddress = localStorage.getItem("referralAddress");
          if (isAddress(referralAddress)) {
            this.setState({ referralAddress });
          }
        }
      }
    })

    TokenEvent.on("addContractSuccess", async (instance: Contract) => {
      const { t, settings, web3, accounts } = this.props;
      let address = instance.target

      if (address == settings.Stake.address) {
        this.getInfo()
        setInterval(() => {
          try {
            this.getInfo()
          } catch (err) {
            error(err)
          }
        }, 20000)
      }
    })
  }

  connectWeb3(e?: any): void {
    let { connectWeb3, settings, getSigner } = this.props;

    connectWeb3().then(async (r: { error: any, payload: { web3: any, chainId: BigInt } }) => {
      if (r.error) {
        error(r.error);
        return;
      }
      let { web3 } = r.payload
      if (web3) {
        let r: ReduxDispatchRespone = await getSigner()
        if (r.error) {
          error(r.error)
        } else {
          log(r.payload)
          let referralAddress = (new URLSearchParams(new URL(document.location.href).search)).get("ref")
          if (isAddress(referralAddress)) {
            localStorage.setItem("referralAddress", referralAddress);
            this.setState({ referralAddress });
          } else {
            referralAddress = localStorage.getItem("referralAddress");
            if (isAddress(referralAddress)) {
              this.setState({ referralAddress });
            }
          }
          let linkRef = document.location.origin + "/?ref=" + r.payload.address
          this.setState({ linkRef, currentWallet: r.payload })
        }

        this.initContracts()
      }
    })
  }

  initContracts(): void {
    let { t, web3, settings } = this.props

    let { Token, Stake } = settings

    if (!web3)
      notification.error({ message: "", description: t?.("Web3 is not connected") })

    else if (Token && Stake) {
      let { addContract } = this.props;

      addContract(Token).then(async (r: ReduxDispatchRespone) => {
        if (r.error) {
          error(Token, r.error.message)
          return notification.error({ message: "", description: r.error.message });
        }
        try {
          let token = r.payload;
          token.info = await getInfo(token)
          this.setState({ token }, this.getInfo)
        } catch (err) { }
      })

      addContract(Stake).then(async (r: ReduxDispatchRespone) => {
        if (r.error) {
          error(Token, r.error.message)
          return notification.error({ message: "", description: r.error.message });
        }
        try {
          let stake = r.payload;
          this.setState({ stake }, this.getInfo)

          let priceDeposit = Number(await stake.priceDeposit());
          this.setState({ priceDeposit });
        } catch (err) { }
      })

    } else {
      notification.error({ message: "", description: t("Settings was not loaded") })
    }
  }

  getInfo() {
    const { tokens, settings, infos, } = this.props;

    let token = tokens[settings?.Token?.address],
      stake = tokens[settings?.Stake?.address];
    if (!stake || !token)
      return;

    stake.priceDeposit().then((priceDeposit: BigInt | any) => {
      this.setState({ priceDeposit: Number(priceDeposit) })
    })

    stake.minDeposit().then((minDeposit: BigInt | any) => {
      log("getInfo", minDeposit)
      this.setState({ minDeposit: Number(minDeposit) / 1e18 })
    })
  }

  async maxBalance(e: any): Promise<void> {
    let { settings, web3, getSigner, chainId, tokens, infos, } = this.props
    let { minDeposit } = this.state
    let token = tokens[settings?.Token?.address],
      stake = tokens[settings?.Stake?.address];

    let r: ReduxDispatchRespone = await getSigner()
    if (r.error) {
      error(r.error)
    } else {
      let chain: CHAIN = chains[numberToHex(chainId)]
      let account: JsonRpcSigner & { [name: string | number]: any } = r.payload
      account.balance = await web3.getBalance(account.address)

      let priceDeposit = await stake.priceDeposit()

      let depositAmount = Number(account.balance) / (10 ** chain?.nativeCurrency?.decimals)
      let depositTokenAmount = depositAmount * Number(priceDeposit);

      if (minDeposit <= 0)
        minDeposit = Number((await stake.minDeposit()) / infos?.token?.decimals);

      this.setState({ depositAmount, depositTokenAmount, minDeposit })
    }
  }

  async onDepositAmountChange(e: any) {
    let depositAmount = e.target.value
    if (isNaN(depositAmount))
      return;
    this.setState({ depositAmount })

    let { t, settings, web3, getSigner, chainId, infos, tokens, } = this.props
    let { priceDeposit, minDeposit } = this.state

    let token = tokens[settings?.Token?.address],
      stake = tokens[settings?.Stake?.address];

    if (!token || !infos.token) {
      error(token, infos.token)
      return;
    }

    if (minDeposit <= 0) {
      minDeposit = Number(await stake.minDeposit()) / infos.token.decimals;
    }
    let depositTokenAmount = Number(depositAmount * priceDeposit);

    let balance = infos?.balances["balance"]
    if (balance < (depositAmount * 1e18) || minDeposit > Number(depositAmount)) {
      error(t("min deposit"))
      e.target.parentElement.style.background = "#d88e8e"
    } else
      e.target.parentElement.style.background = ""

    this.setState({ depositAmount, depositTokenAmount, minDeposit })
  }

  onChangeReferralAddress(e: any) {
    let { t } = this.props
    let referralAddress = e.target.value
    log(referralAddress)
    if (!isAddress(referralAddress)) {
      e.target.parentElement.style.background = "#d88e8e"
    } else
      e.target.parentElement.style.background = ""

    this.setState({ referralAddress })
  }

  async deposit(e: any) {
    let { t, settings, web3, getSigner, chainId, tokens } = this.props
    let { referralAddress, minDeposit, depositAmount } = this.state
    let token = tokens[settings?.Token?.address],
      stake = tokens[settings?.Stake?.address];

    log(minDeposit, depositAmount)

    // this.onDepositAmountChange({ target: { value: depositAmount } });
    if (minDeposit > (Number(depositAmount))) {
      this.refDepositAmount.current.style.background = "#d88e8e"
      return;
    }



    if (token && stake) {
      let r: ReduxDispatchRespone = await getSigner()
      if (r.error) {
        error(r.error)
      } else {
        let account = r.payload
        let abi = await loadAbi(settings.Stake.abi)
        let _stake = new Contract(settings.Stake.address, stake.interface, account)
        let chain: CHAIN = chains[numberToHex(chainId)];

        this.setState({ pending: true })
        if (!isAddress(referralAddress))
          referralAddress = ethers.ZeroAddress;

        _stake.deposit(referralAddress, { value: BigInt(depositAmount * (10 ** chain.nativeCurrency.decimals)) })
          .then(async (tx: any) => {
            log(tx)
            notification.success({
              message: t("Depositing"),
              description: <a href={chain.blockExplorerUrls[0] + "tx/" + tx.hash} target='_blank'>{tx.hash}</a>,
              duration: 20,
            })

            let receipt = await tx.wait()
            log(receipt)
            notification.success({
              message: t("Deposited"),
              description: <a href={chain.blockExplorerUrls[0] + "tx/" + receipt.hash} target='_blank'>{receipt.hash}</a>,
              duration: 20,
            })

            this.setState({ pending: false })

          }).catch((err: any) => {
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
                    <a href={chain.blockExplorerUrls + "tx/" + tx.transactionHash} target='_blank'>
                      {t("Transaction has been reverted by the EVM")}</a>,
                  duration: 10,
                });
              }
            }

            error(err)
            this.setState({ pending: false })
          })
      }
    }
  }

  async airdrop(a: any) {
    let { t, settings, web3, getSigner, chainId, tokens } = this.props
    let { referralAddress, minDeposit, depositAmount } = this.state

    let token = tokens[settings?.Token?.address],
      stake = tokens[settings?.Stake?.address];

    if (token && stake) {
      let r: ReduxDispatchRespone = await getSigner()
      if (r.error) {
        error(r.error)
      } else {
        let account = r.payload

        let abi = await loadAbi(settings.Stake.abi)
        let _stake = new Contract(settings.Stake.address, stake.interface, account)
        let chain: CHAIN = chains[numberToHex(chainId)];

        this.setState({ pending: true })
        if (!isAddress(referralAddress))
          referralAddress = ethers.ZeroAddress;

        _stake.airdrop(referralAddress)
          .then(async (tx: any) => {
            log(tx)
            notification.success({
              message: t("Sending Airdrop"),
              description: <a href={chain.blockExplorerUrls[0] + "tx/" + tx.hash} target='_blank'>{tx.hash}</a>,
              duration: 20,
            })

            let receipt = await tx.wait()
            log(receipt)
            notification.success({
              message: t("Sent Airdrop"),
              description: <a href={chain.blockExplorerUrls[0] + "tx/" + receipt.hash} target='_blank'>{receipt.hash}</a>,
              duration: 20,
            })

            this.setState({ pending: false })

          }).catch((err: any) => {
            if (err.message.includes("user rejected action") || err.message.includes("User denied transaction")) {
              log(err.message);
            }

            if (err.message.includes("Transaction has been reverted by the EVM")) {
              const regex = /{"/;
              const match = err.message.match(regex);
              if (match) {
                const tx = JSON.parse(err.message.substring(match.index));
                notification.error({
                  message: t("Transaction has been reverted by the EVM"),
                  duration: 10,
                })
              }
            }

            if (err.message.includes("You have received an airdrop")) {
              notification.error({
                message: t("You have received an airdrop"),
                duration: 10,
              });
            }

            if (err.message.includes("Amount of tokens for the airdrop has run out")) {
              notification.error({
                message: t("Amount of tokens for the airdrop has run out"),
                duration: 10,
              });
            }

            error(err)
            this.setState({ pending: false })
          })
      }
    } else {
      log(token, stake,)
    }
  }

  addTokenToWallet(e: any) {
    let { tokens, infos, settings, } = this.props
    let token = tokens[settings?.Token?.address],
      stake = tokens[settings?.Stake?.address];

    if (token)
      window.ethereum.request({
        "method": "wallet_watchAsset",
        "params": {
          "type": "ERC20",
          "options": {
            "address": token.target,
            "symbol": infos?.token?.symbol,
            "decimals": 18,
            "image": document.location.origin + "/images/token.png"
          }
        }
      }).then(log)
        .catch((err: any) => { })
  }

  copyRefLink(e: any) {
    const { t, accounts } = this.props;
    try {

      let linkRef = document.location.origin + "/?ref=" + accounts[0].address

      navigator.clipboard.writeText(linkRef);
      notification.success({ message: t("copy success"), description: linkRef })

    } catch (err) {

    }
  }


  render(): ReactNode {

    const { t, tokens, settings, web3, chainId, infos } = this.props;
    let { priceDeposit, depositAmount, depositTokenAmount, currentWallet, token, pending, referralAddress, } = this.state;

    let endDateTime = settings.endDateTime || (new Date(moment().add(23, 'day').valueOf()));

    let Token = {
      symbol: "Token",
      decimals: BigInt(1e18),
      name: "Token",
      totalSupply: BigInt(0),
    }

    let Stake

    if (tokens[settings?.Token?.address] && tokens[settings?.Stake?.address]) {
      Token = tokens[settings?.Token?.address];
      Stake = tokens[settings?.Stake?.address];
    }

    let chain: CHAIN = chains[numberToHex(chainId)]

    return (<>
      <Box className='wallet-box' id="airdrop">
        <Box className='wallet-box-header' color={'white'}>
          <Text textAlign={'center'} fontSize={'18px'}>{t?.('banner.title')}</Text>
          <Countdown
            date={endDateTime}
            renderer={({ days, hours, minutes, seconds, completed }) => {
              if (completed) {
                // Render a completed state
                return '';
              } else {
                // Render a countdown
                return (
                  <Box display={'flex'} justifyContent={'center'} gap={1}>
                    <BoxCountdown>{days}d</BoxCountdown>
                    <BoxCountdown>{hours}h</BoxCountdown>
                    <BoxCountdown>{minutes}m</BoxCountdown>
                    <BoxCountdown>{seconds}s</BoxCountdown>
                  </Box>
                );
              }
            }}
          />

          <Text textAlign={'center'} fontSize={'20px'}>{t?.('banner.subtitle')} {infos.token?.symbol}</Text>
          <Text fontSize={'18px'}>{t?.('banner.description')}</Text>
        </Box>


        <Box className='wallet-box-body'>
          {!web3 ?
            <ButtonPrimary fullWidth={true} onClick={this.connectWeb3.bind(this)} >{t?.('banner.button_connect')}</ButtonPrimary> :
            <>
              <Divider sx={{
                width: '100%'
              }}>1 {chain?.nativeCurrency?.symbol || "ETH"} = {BNFormat(priceDeposit)} {infos.token?.symbol}</Divider>
              <Box className='eth-container'><img height={'23px'} src={'images/eth-icon.png'} /> {chain?.nativeCurrency?.symbol || "ETH"}</Box>
              <Box p={0} display={'flex'} gap={'12px'} width={'100%'}>

                <Box>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    {/* Amount in ETH you pay */}
                    <Text fontSize={'12px'}>{t?.('banner.label_pay')}</Text>
                    <Text fontSize={'12px'} fontWeight={600} style={{ cursor: 'pointer' }} onClick={this.maxBalance.bind(this)}>{t?.('banner.label_max')}</Text>
                  </Box>

                  <InputOutlinedStyled value={depositAmount} onChange={this.onDepositAmountChange.bind(this)} ref={this.refDepositAmount}
                    endAdornment={<InputAdornment position="end"><img height={'24px'} src={'images/eth-icon.png'} /> </InputAdornment>} placeholder='0' />
                </Box>

                <Box>
                  {/* Amount in you receive */}
                  <Text fontSize={'12px'}>{t?.('banner.label_amount')}<span style={{ fontWeight: 600 }}>{Token.symbol}</span> {t?.('banner.label_receive')}</Text>
                  <InputOutlinedStyled value={depositTokenAmount} style={{ backgroundColor: "#a7a7a7", color: "#434343" }}
                    endAdornment={<InputAdornment position="end"><img height={'24px'} src={'images/token.png'} /> </InputAdornment>} placeholder='0' />
                </Box>
              </Box>

              <Box width={'100%'}>
                <Text fontSize={'12px'}>{t?.('Referral address')}</Text>
                <InputOutlinedStyled value={referralAddress} onChange={this.onChangeReferralAddress.bind(this)} endAdornment={"🔗"} placeholder={referralAddress} fullWidth />
              </Box>

              {pending ? <CircularProgress /> : <ButtonPrimary fullWidth={true} onClick={this.deposit.bind(this)} disabled={pending}>{t?.('banner.button_deposit')}</ButtonPrimary>}

              <ButtonOutline fullWidth={true} disabled={pending} onClick={this.airdrop.bind(this)}>{t?.('banner.button_airdrop')}</ButtonOutline>

              {/* <Box width='100%' textAlign="center" fontSize="small">{currentWallet?.address}</Box> */}
              <Button fullWidth={true} sx={{
                backgroundColor: '#f0f4f6',
                borderRadius: '9999px',
                padding: '8px 12px'
              }} onClick={this.copyRefLink.bind(this)}>{t?.('banner.button_refer')} <ContentCopy />
              </Button>

            </>
          }
          <span><Text mt={2} style={{ cursor: "pointer" }} onClick={this.addTokenToWallet.bind(this)}>{t?.('banner.power_by')}</Text></span>
        </Box>
      </Box>
    </>);
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  web3: state.Web3.web3,
  accounts: state.Web3.accounts,
  chainId: state.Web3.chainId,
  chainName: state.Web3.chainName,
  settings: state.Settings,
  tokens: state.Tokens,
  infos: state.Infos,
});

export default connect(mapStateToProps, {
  connectWeb3: connectWeb3,
  getSigner: getSigner,
  loadSetting: loadSetting,
  addContract: addContract,
})(withTranslation('homepage')(WalletBox));