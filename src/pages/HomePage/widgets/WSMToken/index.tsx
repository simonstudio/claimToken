import { Box, Theme } from '@mui/material';
import { Component, ReactNode } from 'react';
import Text from '../../../../components/atom/Text';

import WSMTokenIcon from '../../../../assets/icon/wsmToken/wsm-meme-bg.svg';
import styled from '@emotion/styled';
import { theme } from '../../../../HOCs/useDetachScreen';
import { withTranslation } from 'react-i18next';
import { I18n } from '../../../../i18';

class WSMToken extends Component<I18n> {
  render(): ReactNode {

    const {t} = this.props;

    return (
      <WSMTokenStyled theme={theme} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Box>
          <Text mb={1} variant='h2'>{t?.('wsm_token.title')}</Text>
          <Text>{t?.('wsm_token.content_1')}</Text>
          <Text my={3}>{t?.('wsm_token.content_2')}</Text>
          <Text>{t?.('wsm_token.content_3')}</Text>
        </Box>
        <Box>
          <img src={WSMTokenIcon}/>
        </Box>
      </WSMTokenStyled>
    );
  }
}

export default withTranslation('homepage')(WSMToken);

const WSMTokenStyled = styled(Box)<{theme: Theme}>`
  padding-left: 24px;
  ${props => props.theme.breakpoints.down('lg')} {
    flex-direction: column;
    text-align: center;
    img {
      width: 100%;
      height: auto;
    }
  }
`;