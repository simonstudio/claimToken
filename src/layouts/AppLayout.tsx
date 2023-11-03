import { Box, ThemeProvider, createTheme } from '@mui/material';
import { Component } from 'react';
import moment from 'moment';
import { Outlet } from 'react-router-dom';
import { COLOR_PRIMARY } from '../assets/color';
import Header from '../components/template/Header';
import Countdown from 'react-countdown';
import Footer from '../components/template/Footer';
import FooterBanner from '../pages/HomePage/widgets/Footer';
import storage from '../utils/storage';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { connect } from 'react-redux';
import { loadSetting } from '../store/Settings';


type Props = {
  t?: TFunction<'translation', undefined>
  [name: string]: any,
};
type State = {};

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
    let { t, settings } = this.props
    !storage.lang.get() && storage.lang.set('en');

    let endDateTime = settings.endDateTime || (new Date(moment().add(23, 'day').valueOf()));

    return (<>
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
                  {t("Next exchange listing in")} {days}d {hours}h {minutes}m {seconds}s
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
      </ThemeProvider >
    </>);
  }
}



const mapStateToProps = (state: any, ownProps: any) => ({
  settings: state.Settings,
});

export default connect(mapStateToProps, {
  loadSetting: loadSetting,
})(withTranslation('homepage')(AppLayout));
