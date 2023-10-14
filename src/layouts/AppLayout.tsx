import { Box, ThemeProvider, createTheme } from '@mui/material';
import { Component } from 'react';
import { Outlet } from 'react-router-dom';
import { COLOR_PRIMARY } from '../assets/color';
import Header from '../components/template/Header';
import Countdown from 'react-countdown';
import moment from 'moment';
import Footer from '../components/template/Footer';
import FooterBanner from '../pages/HomePage/widgets/Footer';
import storage from '../utils/storage';
import { connect } from 'react-redux';
import { connectWeb3, getSigner } from '../store/Web3';
import { loadSetting } from '../store/Settings';
import { addContract } from '../store/Tokens';
import { withTranslation } from 'react-i18next';


type Props = {
  [name: string]: any,
};
type State = {
  [name: string]: any,
};

class AppLayout extends Component<Props, State> {

  protected theme;


  constructor(props: Props) {
    super(props);
    this.theme = createTheme({

      palette: {
        primary: {
          main: COLOR_PRIMARY
        }
      },
      typography: {
        fontFamily: 'Work Sans,sans-serif',
        h1: {
          fontWeight: 700
        },
        h2: {
          fontSize: '35px',
          fontWeight: 700,
        },
        h3: {
          fontSize: '24px',
          fontWeight: 700,
        },
        subtitle1: {
          fontWeight: 600
        }
      }
    });

  }

  render() {
    let { settings } = this.props
    let endDateTime = settings.endDateTime || (new Date(moment().add(23, 'day').valueOf()));

    !storage.lang.get() && storage.lang.set('en');

    return (
      <ThemeProvider theme={this.theme}>
        <Header />
        <Countdown
          date={endDateTime}
          renderer={({ days, hours, minutes, seconds, completed }) => {
            if (completed) {
              return 'Finished';
            } else {
              return (
                <Box
                  position={'sticky'}
                  top={'80px'}
                  zIndex={1000}
                  color={'white'}
                  fontWeight={600}
                  p={1}
                  bgcolor={COLOR_PRIMARY}
                  display={'flex'}
                  justifyContent={'center'}
                  gap={1}>
                  Next exchange listing in {days}d {hours}h {minutes}m {seconds}s
                </Box>
              );
            }
          }}
        />
        <Outlet />
        <Box mt={14}>
          <FooterBanner />
        </Box>
        <Footer />
      </ThemeProvider>
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
})(withTranslation()(AppLayout));