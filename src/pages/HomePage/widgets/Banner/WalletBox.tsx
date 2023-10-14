import { Box, Button, Divider, InputAdornment } from '@mui/material';
import { Component, ReactNode, } from 'react';
import Text from '../../../../components/atom/Text';
import Countdown from 'react-countdown';
import { BoxCountdown, InputOutlinedStyled } from '.';
import moment from 'moment';
import ETHICon from '../../../../assets/image/eth-icon.png';
import ButtonPrimary from '../../../../components/atom/Button/ButtonPrimary';
import ButtonOutline from '../../../../components/atom/Button/ButtonOutline';
import { withTranslation } from 'react-i18next';
import { I18n } from '../../../../i18';
import { error, log, numberToHex } from '../../../../std';
import { connect } from 'react-redux';
import { CHAINS, connectWeb3, getSigner } from '../../../../store/Web3';
import { SettingsEvent, loadSetting } from '../../../../store/Settings';
import { addContract, balanceOf, getInfo, loadAbi } from '../../../../store/Tokens';
import { ReduxDispatchRespone } from '../../../../store';
import { message, notification, } from 'antd';
import { JsonRpcSigner } from 'ethers';

type Props = I18n & {
  [name: string]: any,
}

type State = {
  isConnect: boolean
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


var count = 0;

class WalletBox extends Component<Props, State> {
  state: State = {
    isConnect: false,
    priceDeposit: 1_500_000,
    depositAmount: 0, depositTokenAmount: 0, minDeposit: 0,
    token: undefined,
    stake: undefined
  };

  constructor(props: Props) {
    super(props);
    this.connectWeb3.bind(this)
    this.initContracts.bind(this)
    this.getInfo.bind(this)
  }

  componentDidMount(): void {
    count++
    if (count > 1) {
      console.clear()
      let { settings } = this.props;
      SettingsEvent.on("loaded", ({ after }) => {
        this.connectWeb3()
      })
    }
  }

  connectWeb3(e?: any): void {
    let { connectWeb3, settings } = this.props;

    connectWeb3().then((r: { payload: { web3: any, chainId: BigInt } }) => {
      let { web3 } = r.payload
      if (web3) {
        this.setState({ isConnect: true })

        this.initContracts()
      }
    })
  }

  initContracts(): void {
    let { t, web3, settings } = this.props

    let { Token, Stake } = settings

    if (!web3)
      notification.error({ message: "", description: t("Web3 is not connected") })

    else if (Token && Stake) {
      let { addContract } = this.props;

      addContract(Token).then(async (r: ReduxDispatchRespone) => {
        if (r.error) {
          error(Token, r.error.message)
          return notification.error({ message: "", description: r.error.message });
        }
        let token = r.payload;
        token.info = await getInfo(token)
        this.setState({ token }, this.getInfo)
      })

      addContract(Stake).then(async (r: ReduxDispatchRespone) => {
        if (r.error) {
          error(Token, r.error.message)
          return notification.error({ message: "", description: r.error.message });
        }
        let stake = r.payload;
        this.setState({ stake }, this.getInfo)
        let priceDeposit = Number(await stake.priceDeposit());
        this.setState({ priceDeposit });
      })
    } else {
      notification.error({ message: "", description: t("Settings was not loaded") })
    }
  }

  getInfo() {
    const { token, stake } = this.state;
    if (!stake || !token)
      return;

    stake.priceDeposit().then((priceDeposit: BigInt | any) => {
      this.setState({ priceDeposit: Number(priceDeposit) })
    })

    stake.minDeposit().then((minDeposit: BigInt | any) => {
      this.setState({ minDeposit: Number(minDeposit) / token.info.decimals })
    })
  }


  async maxBalance(e: any): Promise<void> {
    let { settings, web3, getSigner, chainId, tokens } = this.props
    let { stake, token, minDeposit } = this.state
    let r: ReduxDispatchRespone = await getSigner()
    if (r.error) {
      error(r.error)
    } else {
      let chain: CHAIN = chains[numberToHex(chainId)]
      let account: JsonRpcSigner & { [name: string | number]: any } = r.payload
      account.balance = await web3.getBalance(account.address)

      let priceDeposit = await stake.priceDeposit()

      let depositAmount = Number(account.balance) / (10 ** chain?.nativeCurrency?.decimals)
      let depositTokenAmount = Number(account.balance * priceDeposit);
      if (minDeposit <= 0)
        minDeposit = Number((await stake.minDeposit()) / token.info.decimals);

      this.setState({ depositAmount, depositTokenAmount, minDeposit })
    }
  }

  async onDepositAmountChange(e: any) {
    let depositAmount = e.target.value
    if (isNaN(depositAmount))
      return;
    this.setState({ depositAmount })

    let { t, settings, web3, getSigner, chainId, tokens } = this.props
    let { stake, token, priceDeposit, minDeposit } = this.state

    if (minDeposit <= 0) {
      minDeposit = Number(await stake.minDeposit()) / token.info.decimals;
      log(minDeposit)
    }
    let depositTokenAmount = Number(depositAmount * priceDeposit);

    if (minDeposit > depositAmount) {
      error(t("min deposit"))
    }

    this.setState({ depositAmount, depositTokenAmount, minDeposit })
  }

  render(): ReactNode {

    const { t, tokens, settings, chainId } = this.props;
    let { priceDeposit, depositAmount, depositTokenAmount, minDeposit } = this.state;

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
      <Box className='wallet-box'>
        <Box className='wallet-box-header' color={'white'}>
          <Text textAlign={'center'} fontSize={'18px'}>{t?.('banner.title')}</Text>
          <Countdown
            date={endDateTime}
            renderer={({ days, hours, minutes, seconds, completed }) => {
              if (completed) {
                // Render a completed state
                return 'Finished';
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

          <Text textAlign={'center'} fontSize={'20px'}>{t?.('banner.subtitle')}</Text>
          <Text fontSize={'18px'}>{t?.('banner.description')}</Text>
        </Box>


        <Box className='wallet-box-body'>
          {!this.state.isConnect ?
            <ButtonPrimary fullWidth={true} onClick={this.connectWeb3.bind(this)} >{t?.('banner.button_connect')}</ButtonPrimary> :
            <>
              <Divider sx={{
                width: '100%'
              }}>1 {chain?.nativeCurrency?.symbol || "ETH"} = {priceDeposit}</Divider>
              <Box className='eth-container'><img height={'23px'} src={ETHICon} /> {chain?.nativeCurrency?.symbol || "ETH"}</Box>
              <Box p={0} display={'flex'} gap={'12px'} width={'100%'} >

                <Box>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Text fontSize={'12px'}>{t?.('banner.label_pay')}</Text>
                    <Text fontSize={'12px'} fontWeight={600} style={{ cursor: 'pointer' }} onClick={this.maxBalance.bind(this)}>{t?.('banner.label_max')}</Text>
                  </Box>

                  <InputOutlinedStyled value={depositAmount} onChange={this.onDepositAmountChange.bind(this)}
                    endAdornment={<InputAdornment position="end"><img height={'24px'} src={ETHICon} /> </InputAdornment>} placeholder='0' />
                </Box>

                <Box>
                  <Text fontSize={'12px'}>{t?.('banner.label_amount')}<span style={{ fontWeight: 600 }}>{Token.symbol}</span> {t?.('banner.label_receive')}</Text>
                  <InputOutlinedStyled value={depositTokenAmount}
                    endAdornment={<InputAdornment position="end"><img height={'24px'} src={'images/wall-street.svg'} /> </InputAdornment>} placeholder='0' />
                </Box>

              </Box>

              <ButtonPrimary fullWidth={true}>{t?.('banner.button_deposit')}</ButtonPrimary>
              <ButtonOutline fullWidth={true}>{t?.('banner.button_airdrop')}</ButtonOutline>
              <Button fullWidth={true} sx={{
                backgroundColor: '#f0f4f6',
                borderRadius: '9999px',
                padding: '8px 12px'
              }}>{t?.('banner.button_refer')}</Button>
            </>

          }
          <span><Text mt={2}>{t?.('banner.power_by')}</Text></span>
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
  tokens: state.Tokens
});

export default connect(mapStateToProps, {
  connectWeb3: connectWeb3,
  getSigner: getSigner,
  loadSetting: loadSetting,
  addContract: addContract,
})(withTranslation('homepage')(WalletBox));