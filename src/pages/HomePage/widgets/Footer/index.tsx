import { Component, ReactNode } from 'react';
import ImageFluid from '../../../../components/atom/Image/ImageFluid';
import styled from '@emotion/styled';
import { Box } from '@mui/material';

class FooterBanner extends Component {
  render(): ReactNode {
    return (
      <FooterBannerStyled>
        <ImageFluid width={'100%'} src={'https://wallstmemes.com/assets/images/footer-desktop.svg'}/>
      </FooterBannerStyled>
    );
  }
}

export default FooterBanner;

const FooterBannerStyled = styled(Box)`

`;