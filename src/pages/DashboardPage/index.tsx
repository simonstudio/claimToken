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
// import { withRouter } from 'react-router';

class DashboardPage extends Component<I18n> {


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
          <Box mt={4}>
            <DashboardSummary4 />
          </Box>
        </BoxSection>
      </DashboardPageStyled>
    );
  }
}

export default withTranslation('dashboard_page')(DashboardPage);

const DashboardPageStyled = styled(Box)`
  

`;