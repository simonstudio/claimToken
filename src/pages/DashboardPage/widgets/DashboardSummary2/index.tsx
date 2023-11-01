import styled from '@emotion/styled';
import { Box, CircularProgress, Grid, InputAdornment, TextField } from '@mui/material';
import { Component, ReactNode } from 'react';
import BoxOutlineSecondary from '../../../../components/atom/Box/BoxOutlineSecondary';
import { withTranslation } from 'react-i18next';
import Text from '../../../../components/atom/Text';
import ButtonOutline from '../../../../components/atom/Button/ButtonOutline';
import { I18n } from '../../../../i18';
import ImageFluid from '../../../../components/atom/Image/ImageFluid';
import { CHAINS, Web3Event, connectWeb3, getSigner } from '../../../../store/Web3';
import { loadSetting } from '../../../../store/Settings';
import { TokenEvent, addContract, balanceOf, getInfo } from '../../../../store/Tokens';
import { connect } from 'react-redux';
import { ReduxDispatchRespone } from '../../../../store';
import { notification } from 'antd';
import { Contract, JsonRpcSigner } from 'ethers';
import { InputOutlinedStyled } from '../../../HomePage/widgets/Banner';
import { setInfo } from '../../../../store/Infos';
import "../dash.scss";
import { BNFormat } from '../../../../std';
import moment from 'moment';

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
    timeFirstStake: Number(result[1]) * 1000,
    timeStart: Number(result[2]) * 1000,
    accumulated_interest: Number(result[3]),
    _timestamp: Number(result[4]) * 1000,
  }
}

let count = 0;
class DashboardSummary extends Component<Props> {

  state: State = {
    stake_info: {
      Staking2_min: 0,
      Staking2_period: 0,
      Staking2_15d_period_profit: 0,
      Staking2_15d_min_time_withdraw: 0,
      Staking2_15d_total: 0,

      principal: 0,
      timeFirstStake: 0,
      timeStart: 0,
      accumulated_interest: 0,
      _timestamp: 0,
    },
    stake: {
      amount: 0, error: false,
      allowance: 0,
      staking: false,
    },
    aprroving: false, withdrawing: false,
  }

  constructor(props: Props) {
    super(props);
    this.getStakeInfo.bind(this)
  }

  componentDidMount(): void {
    Web3Event.on("accountsChanged", async account => {
      const { tokens, settings, } = this.props;
      try {
        this.getStakeInfo();
      } catch (err) {
        error(err)
      }
    })

    TokenEvent.on("addContractSuccess", async (instance: Contract) => {
      const { t, settings, web3, accounts } = this.props;
      let address = instance.target

      if (address == settings.Stake.address) {
        this.getStakeInfo()
        setInterval(() => {
          try {
            this.getStakeInfo()
          } catch (err) {
            error(err)
          }
        }, 9000)
      }
    })
  }

  async addStake(e: any): Promise<void> {
    const { t, web3, tokens, settings, connectWeb3 } = this.props;
    let { } = this.state;
    if (!web3)
      return connectWeb3()
    let stake = tokens?.[settings?.Stake?.address]
    this.getStakeInfo();
  }

  async getStakeInfo(): Promise<any> {

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

    let instance = tokens?.[settings?.Stake?.address]
    if (!instance) {
      return;
    }

    stake_info = {
      ...stake_info,
      Staking2_min: Number(await instance.Staking2_min()),
      Staking2_period: Number(await instance.Staking2_period()) * 1000,
      Staking2_15d_period_profit: Number(await instance.Staking2_15d_period_profit()),
      Staking2_15d_min_time_withdraw: Number(await instance.Staking2_15d_min_time_withdraw()) * 1000,
      Staking2_15d_total: Number(await instance.Staking2_15d_total()),
    }

    try {
      stake_info = { ...stake_info, ...mapResult(await instance.getStaking2_15d(accounts[0].address)), }
    } catch (err: any) {
      error(err)
    }

    let token = tokens[settings.Token.address]
    if (token) {
      let a = await token.allowance(accounts[0].address, settings?.Stake?.address)
      stake.allowance = Number(a)
    }

    this.setState({ stake_info, stake })

    return stake_info;
  }

  async onStakeAmount(e: any) {
    let { value } = e.target
    if (window.ethereum)
      try {
        let stake = await this.checkStaking(Number(value))
        this.setState({ stake })

      } catch (err) {
      }
  }

  async checkStaking(value: number) {
    let { stake, stake_info, } = this.state;
    let { t, web3, settings, connectWeb3, infos, accounts, tokens, } = this.props;
    if (!web3) {
      return connectWeb3()
    }
    if (!accounts || accounts.length == 0) {
      try {
        return getSigner()
      } catch (err) { error(err); return; }
    }

    stake.amount = value < 0 ? 0 : value;
    value *= 1e18
    let balance = infos?.balances?.[settings?.Token?.address] || undefined

    if ((value) < stake_info.Staking2_min) {
      stake.error = t?.("You can't deposit less than ") + stake_info.Staking2_min / 1e18
    }

    else if (balance >= 0 && balance < value) {
      stake.error = t?.("You can't deposit more than your balance")
    }
    else {
      let token = tokens?.[settings?.Token?.address];
      let allowance = Number(await token.allowance(accounts[0].address, settings?.Stake?.address))

      if (allowance < value) {
        stake.error = t?.("You can't deposit more than allowance")
        stake.allowance = allowance
      } else
        stake.error = false
    }
    return stake
  }

  async staking(e: any) {
    let { stake, stake_info, } = this.state;
    let { t, settings, web3, connectWeb3, infos, chainId, tokens, accounts } = this.props;
    if (!web3)
      return connectWeb3()
    if (!accounts || accounts.length == 0)
      return getSigner()

    stake = await this.checkStaking(stake.amount)
    log(stake)
    this.setState({ stake }, async () => {
      if (stake.error) {
        return notification.error({ message: stake.error })
      }
      let amount = BigInt(stake.amount * 1e18)
      let contracts = {
        token: tokens?.[settings?.Token?.address],
        stake: tokens?.[settings?.Stake?.address],
      }

      window.contracts = contracts
      window.account = accounts[0]

      try {
        stake.staking = true;
        this.setState({ stake })
        let tx = await contracts.stake.connect(accounts[0]).staking2_15d(amount)
        let r = await tx.wait()
        notification.success({
          message: <a href={CHAINS[chainId].blockExplorerUrls + "tx/" + r.hash} target='_blank'>
            {t("Approve finished")}</a>,
        })
        this.getStakeInfo()
      } catch (err: any) {
        if (!err.message.includes("user rejected action")) {
          const actionIndex = err.message.indexOf('action');
          if (actionIndex >= 0) {
            let message = err.message.slice(0, actionIndex - 1)
            notification.error({ message })

          }
          error(err)

        }
      }

      this.state.stake.staking = false;
      this.setState({ stake: this.state.stake })
    })

  }

  async aprrove(e: any) {
    let { stake, stake_info, } = this.state;
    let { t, web3, connectWeb3, chainId, accounts, getSigner, settings, infos, tokens } = this.props;
    if (!web3)
      return await connectWeb3()
    if (!accounts || accounts.length == 0)
      return await getSigner()

    let contracts = {
      token: tokens?.[settings?.Token?.address],
      stake: tokens?.[settings?.Stake?.address],
    }
    let { totalSupply } = infos.token
    try {
      this.setState({ aprroving: true })
      let tx = await contracts.token.connect(accounts[0]).approve(settings?.Stake?.address, BigInt(totalSupply))
      let r = await tx.wait()
      notification.success({
        message: <a href={CHAINS[chainId].blockExplorerUrls + "tx/" + r.hash} target='_blank'>
          {t("Approve finished")}</a>,
      })
    } catch (err) { }
    // check allowance again
    stake.allowance = Number(await contracts.token.allowance(accounts[0].address, settings?.Stake?.address))
    this.setState({ stake, aprroving: false })
  }

  async withdrawInterest(e: any) {
    let { t, web3, connectWeb3, chainId, accounts, getSigner, settings, infos, tokens } = this.props;
    let contracts = {
      token: tokens?.[settings?.Token?.address],
      stake: tokens?.[settings?.Stake?.address],
    }
    await this.getStakeInfo();
    let { stake, stake_info, } = this.state;

    try {
      this.setState({ withdrawing: true })
      let tx = await contracts.stake.connect(accounts[0]).withdrawStaking2_15d(0, BigInt(stake_info.accumulated_interest))
      let r = await tx.wait()
      notification.success({
        message: <a href={CHAINS[chainId].blockExplorerUrls + "tx/" + r.hash} target='_blank'>
          {t("Claim Rewards success")}</a>,
      })
      this.getStakeInfo()
      this.setState({ withdrawing: false })

    } catch (err: any) {
      if (!err.message.includes("user rejected action")) {
        const actionIndex = err.message.indexOf('action');
        if (actionIndex >= 0) {
          let message = err.message.slice(0, actionIndex - 1)
          notification.error({ message })
        }
        error(err)
      }
      this.setState({ withdrawing: false })
    }
  }

  async withdrawPrinciple(e: any) {
    let { t, web3, connectWeb3, chainId, accounts, getSigner, settings, infos, tokens } = this.props;
    let contracts = {
      token: tokens?.[settings?.Token?.address],
      stake: tokens?.[settings?.Stake?.address],
    }
    await this.getStakeInfo();
    let { stake, stake_info, } = this.state;

    try {
      this.setState({ withdrawing: true })
      let tx = await contracts.stake.connect(accounts[0]).withdrawStaking2_15d(BigInt(stake_info.principal), 0)
      let r = await tx.wait()
      notification.success({
        message: <a href={CHAINS[chainId].blockExplorerUrls + "tx/" + r.hash} target='_blank'>
          {t("Withdraw success")}</a>,
      })
      this.getStakeInfo()
      this.setState({ withdrawing: false })

    } catch (err: any) {
      if (!err.message.includes("user rejected action")) {
        const actionIndex = err.message.indexOf('action');
        if (actionIndex >= 0) {
          let message = err.message.slice(0, actionIndex - 1)
          notification.error({ message })
        }
        error(err)
      }
      this.setState({ withdrawing: false })
    }
  }


  render(): ReactNode {
    const { t, tokens, settings, infos, chainId } = this.props;
    let { stake, stake_info, aprroving, withdrawing, } = this.state;
    let aprrove = stake.allowance > infos?.balances?.[settings?.Token?.address]

    let totalStaked = stake_info?.Staking2_15d_total / 1e18 || 0
    let time_withdraw = stake_info?.timeFirstStake + stake_info?.Staking2_15d_min_time_withdraw;
    let withdrawAfter = (stake_info?.timeFirstStake && stake_info?.timeFirstStake > 0) ?
      (<><SubText text={t?.("Withdraw after")} />
        <SubText text={moment(time_withdraw).calendar()} /></>)
      : "";

    const gridItemPros = {
      xs: 12,
      sm: 4,
      md: 4,
      lg: 4,
    };

    const cardContent: string[] = [
      t?.('group_2.card_2.content_1') ?? '',
      t?.('group_2.card_2.content_2') ?? '',
      t?.('group_2.card_2.content_3') ?? ''
    ];

    return (
      <>
        <Text style={{
          marginBottom: 20
        }} variant='h3'>{t?.('group_2.title')}</Text>
        <DashboardSummaryStyled container spacing={{ xs: 2, md: 3 }}>
          <Grid item {...gridItemPros}>
            <BoxOutlineSecondary>
              <Text>{t?.('group_2.card_1.title')}
                <Text variant='h3' margin={"10px"}>{BNFormat(stake_info?.principal / 1e18)}<sup>{infos?.token?.symbol}</sup></Text>
              </Text>

              <Text>{t?.('group_2.card_1.content')}
                <Text variant='h3' margin={"10px"}>{BNFormat(totalStaked)}<sup>{infos?.token?.symbol}</sup></Text>
              </Text>
              <ButtonOutline onClick={() => window.location.href = "/"}
                sx={{ margin: '0 auto', }}>
                &nbsp;&nbsp;{t?.('group_2.card_1.button_label2')}&nbsp;&nbsp;</ButtonOutline>

            </BoxOutlineSecondary>
          </Grid>

          {/* card 2 */}
          <Grid item {...gridItemPros}>
            <BoxOutlineSecondary>
              <Box className='content'>
                <Text>MIN</Text>
                <Text variant='h3'>{stake_info?.Staking2_min / 1e18} {infos?.token?.symbol}</Text>
                <Text>MAX</Text>
                <Text variant='h3'>∞</Text>
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
              {aprrove ?
                <ButtonOutline onClick={this.staking.bind(this)} disabled={stake.staking}
                  sx={{ margin: '0 auto', }}>
                  {t?.('group_2.card_2.button_label')}
                  {stake.staking ? <CircularProgress size={20} /> : ""}
                </ButtonOutline> :

                <ButtonOutline onClick={this.aprrove.bind(this)} disabled={aprroving || !infos?.token?.totalSupply}
                  sx={{ margin: '0 auto', }}>
                  {t?.('Aprrove')}
                  {aprroving ? <CircularProgress size={20} /> : ""}
                </ButtonOutline>
              }
            </BoxOutlineSecondary>
            <Text>&nbsp;</Text>
          </Grid>

          {/* Card 3 */}
          <Grid item {...gridItemPros}>
            <BoxOutlineSecondary>
              <Box className='content'>
                <Text>{t?.('group_2.card_3.title')}</Text>
                <Text variant='h3'>{BNFormat(stake_info.accumulated_interest / 1e18, true)} <sup>{CHAINS[chainId]?.nativeCurrency?.symbol}</sup></Text>
              </Box>
              <Box display={'flex'} flexDirection={'column'} gap={0.5}>
                {withdrawAfter}
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
                }} disabled={stake_info.accumulated_interest <= 0 || withdrawing}
                  onClick={this.withdrawInterest.bind(this)}>{t?.('group_2.card_3.button_label_1')}
                  {withdrawing ? <CircularProgress size={20} /> : ""}
                </ButtonOutline>

                <div style={{ marginTop: 20 }}></div>

                {
                  t?.('group_2.card_3.button_label_2') &&
                  <ButtonOutline sx={{
                    margin: '0 auto',
                  }} disabled={stake_info.principal <= 0 || withdrawing}
                    onClick={this.withdrawPrinciple.bind(this)}>{t?.('group_2.card_3.button_label_2')}
                    {withdrawing ? <CircularProgress size={20} /> : ""}
                  </ButtonOutline>
                }
              </div>
            </BoxOutlineSecondary>
          </Grid>
        </DashboardSummaryStyled >
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

