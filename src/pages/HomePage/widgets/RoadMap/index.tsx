import styled from '@emotion/styled';
import { Box, Theme } from '@mui/material';
import { Component, ReactNode } from 'react';
import Text from '../../../../components/atom/Text';
import ImageFluid from '../../../../components/atom/Image/ImageFluid';

import CarImage from '../../../../assets/image/roadmap/Car.png';
import RoadMapPhase from './RoadMapPhase';
import { theme } from '../../../../HOCs/useDetachScreen';
import { withTranslation } from 'react-i18next';
import { I18n } from '../../../../i18';

class RoadMap extends Component<I18n> {


  render(): ReactNode {
    const { t } = this.props;
    return (
      <RoadMapStyled
        theme={theme}
        px={6}
        display={'flex'}
        justifyContent={'center'}
        alignContent={'center'}
        gap={2}
        flexDirection={'column'}

      >
        <Text textAlign={'center'} variant='h2'>{t?.('roadmap.title')}</Text>
        <Text fontSize={'24px'} textAlign={'center'}>{t?.('roadmap.subtitle')}</Text>
        <Box maxHeight={'250px'} display={'flex'} justifyContent={'center'}>
          <ImageFluid style={{
            width: 600
          }} src={CarImage} />
        </Box>
        <RoadMapPhase />
      </RoadMapStyled>
    );
  }
}

const RoadMapStyled = styled(Box) <{ theme: Theme }>`
  ${props => props.theme.breakpoints.down('lg')} {
    flex-direction: column;
  }
`;

export default withTranslation('homepage')(RoadMap);