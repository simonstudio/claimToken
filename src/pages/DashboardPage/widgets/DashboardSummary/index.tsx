import styled from '@emotion/styled';
import { Box, Grid, InputAdornment, TextField } from '@mui/material';
import { Component, ReactNode } from 'react';
import BoxOutlineSecondary from '../../../../components/atom/Box/BoxOutlineSecondary';
import { withTranslation } from 'react-i18next';
import Text from '../../../../components/atom/Text';
import ButtonOutline from '../../../../components/atom/Button/ButtonOutline';
import { I18n } from '../../../../i18';
import ImageFluid from '../../../../components/atom/Image/ImageFluid';
import { Web3Event, connectWeb3, getSigner } from '../../../../store/Web3';
import { loadSetting } from '../../../../store/Settings';
import { TokenEvent, addContract, balanceOf, getInfo } from '../../../../store/Tokens';
import { connect } from 'react-redux';
import { ReduxDispatchRespone } from '../../../../store';
import { notification } from 'antd';
import { Contract, JsonRpcSigner } from 'ethers';
import { InputOutlinedStyled } from '../../../HomePage/widgets/Banner';
import { setInfo } from '../../../../store/Infos';
import "../dash.scss";

const { log, error, } = console;

type Props = I18n & {
  [name: string]: any,
}

type State = {
  [name: string]: any
}

function mapResult(result: any) {
  return {
    principal: Number(result[0]),
    timeFirstStake: Number(result[1]),
    timeStart: Number(result[2]),
    accumulated_interest: Number(result[3]),
    _timestamp: Number(result[4]) * 1000,
  }
}

class DashboardSummary extends Component<Props> {

  state: State = {
    stake_info: {
      Staking1_min: 0,
      Staking1_max: 0,
      Staking1_max_token_interest: 0,
      Staking1_period: 0,
      Staking1_period_interest: 0,
      Staking1_min_time_withdraw: 0,
      principal: 0,
      timeFirstStake: 0,
      timeStart: 0,
      accumulated_interest: 0,
      _timestamp: 0,
    },
    stake: {
      amount: 0, error: false,
      allowance: 0,
    },
  }

  constructor(props: Props) {
    super(props);
    this.getStakeInfo.bind(this)
  }

  componentDidMount(): void {
    TokenEvent.on("addContractSuccess", async (instance: Contract) => {
      const { t, settings, web3, accounts } = this.props;
      let address = instance.target
      window.instance = instance
      if (address == settings.Stake.address) {
        this.getStakeInfo(instance);

      }
    })
  }

  async addStake(e: any): Promise<void> {
    const { t, web3, tokens, settings, connectWeb3 } = this.props;
    let { } = this.state;
    if (!web3)
      return connectWeb3()
    let stake = tokens?.[settings?.Stake?.address]
    this.getStakeInfo(stake);
  }

  async getStakeInfo(instance: Contract): Promise<any> {
    let { t, web3, tokens, settings, connectWeb3, accounts, getSigner } = this.props;
    let { stake_info, stake, } = this.state;
    if (!web3) {
      return connectWeb3()
    }
    if (!accounts || accounts.length == 0) {
      try {
        let r: ReduxDispatchRespone = await getSigner()
        return
      } catch (err) { error(err); return; }
    }
    accounts = this.props.accounts
    stake_info = {
      "Staking1_min": Number(await instance.Staking1_min()),
      "Staking1_max": Number(await instance.Staking1_max()),
      "Staking1_max_token_interest": Number(await instance.Staking1_max_token_interest()),
      "Staking1_period": Number(await instance.Staking1_period()),
      "Staking1_period_interest": Number(await instance.Staking1_period_interest()),
      "Staking1_min_time_withdraw": Number(await instance.Staking1_min_time_withdraw()),
      // "Staking1_total": Number(await instance.Staking1_total()),
    }

    try {
      stake_info = { ...stake_info, ...mapResult(await instance.getStaking1(accounts[0].address)), }
    } catch (err) { }

    let token = tokens[settings.Token.address]
    if (token) {
      stake.allowance = Number(await token.allowance(instance.target, accounts[0].address))
    }

    this.setState({ stake_info, stake })

    return stake_info;
  }

  onStakeAmount(e: any) {
    let { stake, stake_info, } = this.state;
    let { t, settings, infos } = this.props;
    let { value } = e.target
    stake.amount = value
    value = Number(value) * 1e18
    let balance = infos?.balances?.[settings?.Token?.address] || undefined

    if ((value) < stake_info.Staking1_min) {
      stake.error = t?.("You can't deposit less than ") + stake_info.Staking1_min / 1e18
    }

    else if ((value) > stake_info.Staking1_max) {
      stake.error = t?.("You can't deposit more than ") + stake_info.Staking1_max / 1e18
    }

    else if (balance >= 0 && balance < value) {
      stake.error = t?.("You can't deposit more than your balance")
    }
    else {
      stake.error = false
    }
    this.setState({ stake })
  }


  render(): ReactNode {
    const { t, tokens, settings, infos } = this.props;
    let { stake, stake_info } = this.state;
    let contracts = {
      token: tokens?.[settings?.Token?.address],
      stake: tokens?.[settings?.Stake?.address],
    }

    const gridItemPros = {
      xs: 12,
      sm: 4,
      md: 4,
      lg: 4,
    };

    const cardContent: string[] = [
      t?.('group_1.card_2.content_1') ?? '',
      t?.('group_1.card_2.content_2') ?? '',
      t?.('group_1.card_2.content_3') ?? ''
    ];

    return (
      <>
        <Text style={{
          marginBottom: 20
        }} variant='h3'>{t?.('group_1.title')}</Text>
        <DashboardSummaryStyled container spacing={{ xs: 2, md: 3 }}>
          <Grid item {...gridItemPros}>
            <BoxOutlineSecondary>
              <Text>{t?.('group_1.card_1.title')}</Text>
              <Text variant='h3'>{stake_info?.principal / 1e18}<sup>{infos?.token?.symbol}</sup></Text>

              <ButtonOutline sx={{
                margin: '0 auto',
              }} onClick={this.addStake.bind(this)}>{t?.('group_1.card_1.button_label')}</ButtonOutline>
              <Text>{t?.('group_1.card_1.content')}</Text>

              <Text variant='h3'>{stake?.Staking1_total / 1e18}<sup>{infos?.token?.symbol}</sup></Text>

              <ButtonOutline sx={{
                margin: '0 auto',
              }}>&nbsp;&nbsp;{t?.('group_1.card_1.button_label2')}&nbsp;&nbsp;</ButtonOutline>

            </BoxOutlineSecondary>
          </Grid>

          {/* card 2 */}
          <Grid item {...gridItemPros}>
            <BoxOutlineSecondary>
              <Box className='content'>
                <Text>MIN</Text>
                <Text variant='h3'>{stake_info?.Staking1_min / 1e18} {infos?.token?.symbol}</Text>
                <Text>MAX</Text>
                <Text variant='h3'>{stake_info?.Staking1_max / 1e18} {infos?.token?.symbol}</Text>
              </Box>
              <Text>&nbsp;</Text>
              <Box display={'flex'} flexDirection={'column'} gap={0.5}>
                {cardContent.map((s, index) => (
                  <SubText key={index} text={s} />))}
              </Box>

              {/* stake Amount */}
              <Box style={{ width: '100%', margin: "4px 0px 4px 0px" }}>
                <TextField value={stake.amount} placeholder={t?.("staking amount")} type='number' fullWidth={true} className='amountInput'
                  onChange={this.onStakeAmount.bind(this)}
                  error={stake.error} helperText={stake.error} />
              </Box>

              <ButtonOutline sx={{
                margin: '0 auto',
              }}>{t?.('group_1.card_2.button_label')}</ButtonOutline>
            </BoxOutlineSecondary>
            <Text>&nbsp;</Text>
          </Grid>

          {/* Card 3 */}
          <Grid item {...gridItemPros}>
            <BoxOutlineSecondary>
              <Box className='content'>
                <Text>{t?.('group_1.card_3.title')}</Text>
                <Text variant='h3'>0 <sup>{infos?.token?.symbol}</sup></Text>
              </Box>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
              }}>
                <ButtonOutline sx={{
                  margin: '0 auto',
                }}>{t?.('group_1.card_3.button_label_1')}</ButtonOutline>
                <div style={{
                  marginTop: 20
                }}></div>
                {
                  t?.('group_1.card_3.button_label_2') &&
                  <ButtonOutline sx={{
                    margin: '0 auto',
                  }}>{t?.('group_1.card_3.button_label_2')}</ButtonOutline>
                }
              </div>
            </BoxOutlineSecondary>
          </Grid>
        </DashboardSummaryStyled>
      </>
    );
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
  setInfo: setInfo,
})(withTranslation('dashboard_page')(DashboardSummary));


const DashboardSummaryStyled = styled(Grid)`
  /* display: flex;
  justify-content: space-between;
  gap: 12px; */
`;

class SubText extends Component<{ text: string }> {
  render(): ReactNode {
    return (
      <Box display={'flex'} gap={1} >
        {/* <ImageFluid src='https://wallstmemes.com/assets/images/svg-icons/ani-arrow.svg' /> */}
        <Text fontSize={'10px'} color={'#535353'} fontWeight={500}>{this.props.text}</Text>
      </Box>
    );
  }
}

