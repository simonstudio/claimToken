import styled from '@emotion/styled';
import { Box, Theme } from '@mui/material';
import { Component, ReactNode } from 'react';
import Text from '../../../../components/atom/Text';
import { withTranslation } from 'react-i18next';
import { I18n } from '../../../../i18';
import ButtonPrimary from '../../../../components/atom/Button/ButtonPrimary';
import { theme } from '../../../../HOCs/useDetachScreen';

class StakeWith extends Component<I18n> {
  render(): ReactNode {

    const { t } = this.props;

    return (
      <StakeWithStyled theme={theme}>
          <Box display={'flex'} flexDirection={'column'} gap={0.5} maxWidth={'700px'}>
            <Text variant='h3'> {t?.('title')} </Text>
            <Text> {t?.('subtitle')} </Text>
          </Box>
          <ButtonPrimary sx={{
            minWidth: '250px'
          }}><Text fontSize={'14px'} py={1} variant='h3'>{t?.('button_label')}</Text></ButtonPrimary>
      </StakeWithStyled>
    );
  }
}

const StakeWithStyled = styled(Box)<{theme: Theme}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  ${props => props.theme.breakpoints.down('md')} {
    flex-direction: column;
    align-items: flex-start;
    
  }

`;

export default withTranslation('dashboard_page')(StakeWith);