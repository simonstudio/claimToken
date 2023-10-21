import { Component, ReactNode } from 'react';
import Text from '../../../../components/atom/Text';
import { Box } from '@mui/material';
import styled from '@emotion/styled';
import ImageFluid from '../../../../components/atom/Image/ImageFluid';
import { I18n } from '../../../../i18';
import { withTranslation } from 'react-i18next';


class WSMAirDrop extends Component<I18n> {
  render(): ReactNode {

    const { t } = this.props;

    return (
      <WSMAirDropStyled display={'flex'} flexDirection={'column'} alignItems={'center'} gap={3} px={4}>
        <Text textAlign={'center'} variant='h2'>{t?.('wsm_airdrop.title')}</Text>
        <Text fontSize={'24px'} textAlign={'center'}>{t?.('wsm_airdrop.subtitle')}</Text>
        <ImageFluid style={{ marginTop: 40 }} width={'100px'} src={require('../../../../assets/icon/logo.png')} />
      </WSMAirDropStyled>
    );
  }
}

export default withTranslation('homepage')(WSMAirDrop);

const WSMAirDropStyled = styled(Box)`

`;
