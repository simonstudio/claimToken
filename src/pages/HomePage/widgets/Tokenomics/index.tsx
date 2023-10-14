import styled from '@emotion/styled';
import { Box, Grid, List, ListItem, Theme } from '@mui/material';
import { Component, ReactNode } from 'react';
import Text from '../../../../components/atom/Text';
import TokenomicsImage from './../../../../assets/image/tokenomics/tokonomics.svg';
import ImageFluid from '../../../../components/atom/Image/ImageFluid';
import { COLOR_SECONDARY } from '../../../../assets/color';
import { theme } from '../../../../HOCs/useDetachScreen';
import { I18n } from '../../../../i18';
import { withTranslation } from 'react-i18next';


class Tokenomics extends Component<I18n> {

  
  render(): ReactNode {

    const {t} = this.props;
    const items = [
      {
        color: '#1C5AF9',
        percent: '50%',
        label: t?.('tokenomics.marketing')
      },
      {
        color: '#CA8AFC',
        percent: '30%',
        label: t?.('tokenomics.community')
      },
      {
        color: '#F0434D',
        percent: '10%',
        label: t?.('tokenomics.cex')
      },
      {
        color: '#72FF5C',
        percent: '10%',
        label: t?.('tokenomics.dex')
      },
    ];
    return (
      <TokenomicsStyled theme={theme}>
        <Text variant='h2' textAlign={'center'}>{t?.('tokenomics.title')}</Text>
        <Grid className='token-content' container spacing={2}>
            <Grid item xs={8}>
              <ImageFluid className='teko-image-sm' style={{display: 'none'}} src='https://wallstmemes.com/assets/images/svg-icons/tekenomics-sm.svg' />
              <ImageFluid className='teko-image-lg' src={TokenomicsImage}/>
            </Grid>
            <Grid className='token-content-description' sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'baseline',
            }} item xs={4} alignItems={'center'}>
              <List>
                {items.map((o, index) => (
                  <ListItem key={index} sx={{
                    gap: '8px',
                    padding: '8px 0px'
                  }}>
                    <Box width={'35px'} height={'23px'} borderRadius={'12px'} bgcolor={o.color}></Box>
                    <Text fontWeight={700}>{o.percent}</Text>
                    <Text color={COLOR_SECONDARY} fontWeight={700}>{o.label}</Text>
                  </ListItem>
                ))}
              </List>
              <Text fontSize={'20px'}>{t?.('tokenomics.subtitle')}</Text>
            </Grid>
        </Grid>
      </TokenomicsStyled>
    );
  }
}

export default withTranslation('homepage')(Tokenomics);

const TokenomicsStyled = styled(Box)<{theme: Theme}>`

  ${props => props.theme.breakpoints.down('sm')} {
      .teko-image-sm {
        margin-left: 18px;
        display: block !important;
        max-width: 130%;
      }

      .teko-image-lg {
        display: none;
      }
  }


  ${props => props.theme.breakpoints.down('md')} {

 

    .token-content {
      flex-direction: column-reverse;
      text-align: center;
    }
    .token-content-description {
      padding: 16px 16px 16px 60px;
      flex-direction: column-reverse;
      text-align: center;
      max-width: 100%;
    }
  }
`;