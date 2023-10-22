import styled from '@emotion/styled';
import { Box, Grid, Theme } from '@mui/material';
import { Component, ReactNode } from 'react';
import Text from '../../../../components/atom/Text';
import ImageFluid from '../../../../components/atom/Image/ImageFluid';
import { theme } from '../../../../HOCs/useDetachScreen';
import { I18n } from '../../../../i18';
import { withTranslation } from 'react-i18next';

class WSMInTheMedia extends Component<I18n> {



  render(): ReactNode {

    const { t } = this.props;

    const data = [
      {
        image: require('../../../../assets/image/banner-1.webp'),
        title: t?.('wsm_media.content_1')
      },
      {
        image: require('../../../../assets/image/banner-2.webp'),
        title: t?.('wsm_media.content_2')
      },
      {
        image: require('../../../../assets/image/banner-3.webp'),
        title: t?.('wsm_media.content_3')
      },
    ];

    return (
      <WSMInTheMediaStyled theme={theme} px={4} id='media'>
        <Text mt={20} mb={8} textAlign={'center'} variant='h2'>{t?.('wsm_media.title')}</Text>
        <Grid className='wsm_media-content' container spacing={3}>
          {data.map((o, index) => (
            <Grid className='wsm_media-content-item' item key={index} xs={4}>
              <ImageFluid className='wsm_media-content-item-img' style={{
                borderRadius: '12px',
              }} src={o.image} />
              <Text fontSize={'20px'} fontWeight={700}>{o.title}</Text>
            </Grid>
          ))}
        </Grid>
      </WSMInTheMediaStyled>
    );
  }
}

export default withTranslation('homepage')(WSMInTheMedia);

const WSMInTheMediaStyled = styled(Box) <{ theme: Theme }>`
  ${props => props.theme.breakpoints.down('lg')} {
    .wsm_media-content {
      max-width: 120%;
      flex-direction: column;

      &-item {
        max-width: 100%;
        &-img {
          width: 100%;

        }
      }
    }

  }
`;