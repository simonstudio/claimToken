import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Component, ReactNode } from 'react';
import StakeWith from './widgets/StakeWith';
import DashboardSummary from './widgets/DashboardSummary';
import DashboardSummary2 from './widgets/DashboardSummary2';
import DashboardSummary3 from './widgets/DashboardSummary3';
// import DashboardSummary4 from './widgets/DashboardSummary4';
import BoxSection from '../../components/atom/Box/BoxSection';
import { I18n } from '../../i18';
import { withTranslation } from 'react-i18next';
import storage from '../../utils/storage';
import { Web3Event, connectWeb3, getSigner } from '../../store/Web3';
import { loadSetting } from '../../store/Settings';
import { TokenEvent, addContract, balanceOf, getInfo, } from '../../store/Tokens';
import { connect } from 'react-redux';
import { notification } from 'antd';
import { ReduxDispatchRespone } from '../../store';
import { setInfo } from '../../store/Infos';
import { Contract } from 'ethers';

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
          {/* <Box mt={4}>
            <DashboardSummary4 />
          </Box> */}
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
  tokens: state.Tokens,
  infos: state.Infos,
});

export default connect(mapStateToProps, {
  connectWeb3: connectWeb3,
  getSigner: getSigner,
  loadSetting: loadSetting,
  addContract: addContract,
  setInfo: setInfo,
})(withTranslation('dashboard_page')(DashboardPage));


const DashboardPageStyled = styled(Box)`
  

`;