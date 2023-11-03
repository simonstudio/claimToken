import styled from '@emotion/styled';
import { Box, Grid, Theme } from '@mui/material';
import { Component, ReactNode } from 'react';
import MemeSwiper from './MemeSwiper';
import Text from '../../../../components/atom/Text';
import ImageFluid from '../../../../components/atom/Image/ImageFluid';

import MemeTrollIcon from '../../../../assets/icon/meme/bull-business-1.png';
import MemeManIcon from '../../../../assets/icon/meme/bull-business-2.png';
import WowIcon from '../../../../assets/icon/meme/bull-business-3.png';
import { I18n } from '../../../../i18';
import { withTranslation } from 'react-i18next';
import { theme } from '../../../../HOCs/useDetachScreen';
import BoxSection from '../../../../components/atom/Box/BoxSection';

type TMemeFollower = {
  title: string,
  subtitle: string
}

class MemeBusiness extends Component<I18n> {


  render(): ReactNode {

    const { t } = this.props;

    const follower: TMemeFollower[] = [
      {
        title: '20,000+',
        subtitle: t?.('meme_buss.label_community') ?? '',
      },
      {
        title: '500K+',
        subtitle: t?.('meme_buss.label_impression') ?? ''
      },
      {
        title: t?.('meme_buss.label_unlimited') ?? '',
        subtitle: t?.('meme_buss.label_memes') ?? ''
      },
    ];
    return (
      <MemeBusinessStyled theme={theme} mt={12}>
        <BoxSection>
          <Grid container spacing={2}>
            <Grid className='meme-image' item xs={2}>
              <ImageFluid src={MemeTrollIcon} />
            </Grid>
            <Grid item xs={12} md={8}>
              <Box className='meme-container' px={9} justifyContent={'center'} alignItems={'center'} flexWrap={'nowrap'} display={'flex'} flexDirection={'column'}>
                <Text textAlign={'center'} fontSize={'35px'} fontWeight={700}>{t?.('meme_buss.title')}</Text>
                <Grid className='meme-content' sx={{
                  maxWidth: '75%',
                }} container spacing={2} mt={3}>
                  {follower.map((o, index) => (
                    <Grid key={index} item xs={5} sm={4} md={4}>
                      <MemeFollowerItem {...o} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
            <Grid className='meme-image' item xs={2}>
              <ImageFluid src={MemeManIcon} />
            </Grid>
          </Grid>
          <Box display={'flex'} justifyContent={'center'} my={4}>
            <ImageFluid style={{
              width: 200
            }} src={WowIcon} />
          </Box>
        </BoxSection>


        <MemeSwiper />
      </MemeBusinessStyled>
    );
  }
}

export default withTranslation('homepage')(MemeBusiness);

const MemeBusinessStyled = styled(Box) <{ theme: Theme }>`
  ${props => props.theme.breakpoints.down('lg')} {
    /* margin-top: 500px; */
    .meme-content {
      justify-content: center;
      flex-wrap: wrap;
      max-width: 100% !important;
      /* padding: 0; */


    }
    .meme-image {
      display: none;
    }

    .meme-container {
      padding: 6px;
    }
  }
`;

class MemeFollowerItem extends Component<TMemeFollower> {
  render(): ReactNode {
    return (
      <Box>
        <Text textAlign={'center'} fontSize={'25px'} fontWeight={'700'} variant='h3'>{this.props.title}</Text>
        <Text textAlign={'center'} fontSize={'13px'} color={'#717d85'}>{this.props.subtitle}</Text>
      </Box>
    );
  }
}