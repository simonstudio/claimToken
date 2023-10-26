import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Component, ReactNode } from 'react';
import StakeWith from './widgets/StakeWith';
import DashboardSummary from './widgets/DashboardSummary';
import DashboardSummary2 from './widgets/DashboardSummary2';
import DashboardSummary3 from './widgets/DashboardSummary3';
import DashboardSummary4 from './widgets/DashboardSummary4';
import BoxSection from '../../components/atom/Box/BoxSection';
import { I18n } from '../../i18';
import { withTranslation } from 'react-i18next';
import storage from '../../utils/storage';
import { Web3Event, connectWeb3, getSigner } from '../../store/Web3';
import { loadSetting } from '../../store/Settings';
import { addContract, getInfo, } from '../../store/Tokens';
import { connect } from 'react-redux';
import { notification } from 'antd';
import { ReduxDispatchRespone } from '../../store';

const { log, error, } = console;

type Props = I18n & {
  [name: string]: any,
}

type State = {
  [name: string]: any
}

class DashboardPage extends Component<Props> {

  state: State = {
    token: undefined, stake: undefined,

  }

  constructor(props: I18n) {
    super(props);
    const { i18n } = props;


    // const lang = window.location.href.split('/')[3];

    i18n?.changeLanguage(storage.lang.get());
  }

  componentDidMount(): void {
    const { t, settings } = this.props;
    Web3Event.on("changed", web3 => {
      this.initContracts()
    })
  }

  initContracts(): void {
    let { t, web3, settings, } = this.props

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




  render(): ReactNode {

    return (
      <DashboardPageStyled mt={10} px={3}>
        <BoxSection px={5}>
          <StakeWith />
          <Box mt={4}>
            <DashboardSummary />
          </Box>
          <Box mt={4}>
            <DashboardSummary2 />
          </Box>
          <Box mt={4}>
            <DashboardSummary3 />
          </Box>
          <Box mt={4}>
            <DashboardSummary4 />
          </Box>
        </BoxSection>
      </DashboardPageStyled>
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
})(withTranslation('dashboard_page')(DashboardPage));


const DashboardPageStyled = styled(Box)`
  

`;