import styled from '@emotion/styled';
import { Box, Grid } from '@mui/material';
import { Component, ReactNode } from 'react';
import BoxOutlineSecondary from '../../../../components/atom/Box/BoxOutlineSecondary';
import { withTranslation } from 'react-i18next';
import Text from '../../../../components/atom/Text';
import ButtonOutline from '../../../../components/atom/Button/ButtonOutline';
import { I18n } from '../../../../i18';
import ImageFluid from '../../../../components/atom/Image/ImageFluid';
import { Web3Event, connectWeb3, getSigner } from '../../../../store/Web3';
import { loadSetting } from '../../../../store/Settings';
import { addContract, getInfo } from '../../../../store/Tokens';
import { connect } from 'react-redux';
import { ReduxDispatchRespone } from '../../../../store';
import { notification } from 'antd';
import { Contract, JsonRpcSigner } from 'ethers';

const { log, error, } = console;

type Props = I18n & {
  [name: string]: any,
}

type State = {
  [name: string]: any
}


class DashboardSummary extends Component<Props> {

  state: State = {
    token_info: {
      symbol: "Token",
      decimals: BigInt(1e18),
      name: "Token",
      totalSupply: BigInt(0),
    },

    stake_info: {
      Staking1_min: 0,
      Staking1_max: 0,
      Staking1_max_token_interest: 0,
      Staking1_period: 0,
      Staking1_period_interest: 0,
      Staking1_min_time_withdraw: 0,
    }
  }

  constructor(props: Props) {
    super(props);
    this.getStakeInfo.bind(this)
  }

  componentDidMount(): void {
    const { t, settings } = this.props;
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    if (prevProps.tokens !== this.props.tokens) {
      let { address } = this.props.settings.Token
      let { Stake } = this.props.settings
      if (this.props.tokens[address] !== prevProps.tokens[address])
        this.getInfo(this.props.tokens[address]).then((info: any) => {
          this.setState({ token_info: info })
        })
      let stake = this.props.tokens[Stake.address]
      if (stake !== prevProps.tokens[Stake.address]) {
        this.getStakeInfo(stake);
        this.props.web3.getSigner().then(async (signer: JsonRpcSigner) => {
          let result = await stake.getStaking1(signer.address)
          log(result)
          window.result = result
        })
      }
    }
  }

  async getInfo(instance: Contract): Promise<any> {
    let info = {
      name: await instance.name(),
      symbol: await instance.symbol(),
      decimals: 10 ** Number(await instance.decimals()),
      totalSupply: await instance.totalSupply(),
    }
    return info;
  }

  async getStakeInfo(instance: Contract): Promise<any> {
    let stake_info = {
      "Staking1_min": Number(await instance.Staking1_min()) / 1e18,
      "Staking1_max": Number(await instance.Staking1_max()) / 1e18,
      "Staking1_max_token_interest": Number(await instance.Staking1_max_token_interest()) / 1e18,
      "Staking1_period": Number(await instance.Staking1_period()),
      "Staking1_period_interest": Number(await instance.Staking1_period_interest()),
      "Staking1_min_time_withdraw": Number(await instance.Staking1_min_time_withdraw()),
    }
    this.setState({ stake_info })
    return stake_info;
  }



  addStake(e: any): void {
    const { t, tokens, settings } = this.props;
    let token = tokens?.[settings?.Token?.address]
    let stake = tokens?.[settings?.Stake?.address]
  }

  render(): ReactNode {
    const { t, tokens, settings } = this.props;
    const { token_info, stake_info } = this.state;
    let token = tokens?.[settings?.Token?.address]
    let stake = tokens?.[settings?.Stake?.address]

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
              <Text variant='h3'>0 <sup>{token?.info?.symbol}</sup></Text>

              <ButtonOutline sx={{
                margin: '0 auto',
              }} onClick={this.addStake.bind(this)}>{t?.('group_1.card_1.button_label')}</ButtonOutline>
              <Text>{t?.('group_1.card_1.content')}</Text>

              <Text variant='h3'>0 <sup>{token?.info?.symbol}</sup></Text>

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
                <Text variant='h3'>{stake_info.Staking1_min} {token?.info?.symbol}</Text>
                <Text>MAX</Text>
                <Text variant='h3'>{stake_info.Staking1_max} {token?.info?.symbol}</Text>
              </Box>
              <Text>&nbsp;</Text>
              <Box display={'flex'} flexDirection={'column'} gap={0.5}>
                {cardContent.map((s, index) => (
                  <SubText key={index} text={s} />))}
              </Box>
              <Text>&nbsp;</Text>
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
                <Text variant='h3'>0 <sup>{token?.info?.symbol}</sup></Text>
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
  tokens: state.Tokens
});

export default connect(mapStateToProps, {
  connectWeb3: connectWeb3,
  getSigner: getSigner,
  loadSetting: loadSetting,
  addContract: addContract,
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

