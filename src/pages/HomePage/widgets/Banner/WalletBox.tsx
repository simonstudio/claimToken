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
import { log } from '../../../../std';
import { connect } from 'react-redux';
import store from '../../../../store';
import { connectWeb3 } from '../../../../store/Web3';
import { loadSetting } from '../../../../store/Settings';
import { Action } from '@reduxjs/toolkit';

type Props = I18n & {
  [name: string]: any,
}

type State = {
  isConnect: boolean;
}

class WalletBox extends Component<Props, State> {
  state: State = { isConnect: false };
  componentDidMount(): void {
    this.connectWeb3.bind(this)()
  }

  connectWeb3(e?: any): void {
    let { connectWeb3 } = this.props;
    connectWeb3().then((r: { payload: { web3: any, chainId: BigInt } }) => {
      let { web3 } = r.payload
      if (web3) {
        this.setState({ isConnect: true })
      }
    })
  }

  render(): ReactNode {

    const { t } = this.props;

    return (<>
      <Box className='wallet-box'>
        <Box className='wallet-box-header' color={'white'}>
          <Text textAlign={'center'} fontSize={'18px'}>{t?.('banner.title')}</Text>
          <Countdown
            date={new Date(moment().add(23, 'day').valueOf())}
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
              }}>1 WSM = 0000</Divider>
              <Box className='eth-container'><img height={'23px'} src={ETHICon} /> ETH</Box>
              <Box p={0} display={'flex'} gap={'12px'} width={'100%'} >
                <Box>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Text fontSize={'12px'}>{t?.('banner.label_pay')}</Text>
                    <Text fontSize={'12px'} fontWeight={600}>{t?.('banner.label_max')}</Text>
                  </Box>

                  <InputOutlinedStyled
                    endAdornment={<InputAdornment position="end"><img height={'24px'} src={ETHICon} /> </InputAdornment>} placeholder='0' />
                </Box>
                <Box>
                  <Text fontSize={'12px'}>{t?.('banner.label_amount')} <span style={{ fontWeight: 600 }}>WSM</span> {t?.('banner.label_receive')}</Text>
                  <InputOutlinedStyled
                    endAdornment={<InputAdornment position="end"><img height={'24px'} src={'https://wallstmemes.com/assets/images/svg-icons/wall-street.svg'} /> </InputAdornment>} placeholder='0' />
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
  settings: state.Settings.settings,
});

export default connect(mapStateToProps, {
  connectWeb3: connectWeb3,
  loadSetting: loadSetting,
})(withTranslation('homepage')(WalletBox));