import styled from '@emotion/styled';
import { Box, Grid, List, ListItem, Theme } from '@mui/material';
import { Component, ReactNode } from 'react';
import Text from '../../../../components/atom/Text';
import TokenomicsImage from './../../../../assets/image/tokenomics/tokenomics.webp';
import ImageFluid from '../../../../components/atom/Image/ImageFluid';
import { COLOR_SECONDARY } from '../../../../assets/color';
import { theme } from '../../../../HOCs/useDetachScreen';
import { I18n } from '../../../../i18';
import { withTranslation } from 'react-i18next';


class Tokenomics extends Component<I18n> {


  render(): ReactNode {

    const { t } = this.props;
    const items = [
      {
        color: '#cecece',
        percent: '45%',
        label: t?.('tokenomics.content_1')
      },
      {
        color: '#bcbcbc',
        percent: '5%',
        label: t?.('tokenomics.content_2')
      },
      {
        color: '#8a8b8f',
        percent: '14%',
        label: t?.('tokenomics.content_3')
      },
      {
        color: '#737373',
        percent: '4%',
        label: t?.('tokenomics.content_4')
      },
      {
        color: '#4a4a4c',
        percent: '17%',
        label: t?.('tokenomics.content_5')
      },
      {
        color: '#000000',
        percent: '15%',
        label: t?.('tokenomics.content_6')
      },
    ];
    return (
      <TokenomicsStyled theme={theme} id='tokenomics'>
        <Text variant='h2' textAlign={'center'}>{t?.('tokenomics.title')}</Text>
        <Grid className='token-content' container spacing={2}>
          <Grid item xs={8} sx={{ marginTop: 4, paddingRight: 6 }}>
            <ImageFluid className='teko-image-sm' style={{ display: 'none' }} src={require('../../../../assets/image/tokenomics/tokenomics.webp')} />
            <ImageFluid className='teko-image-lg' src={TokenomicsImage} />
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

const TokenomicsStyled = styled(Box) <{ theme: Theme }>`

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