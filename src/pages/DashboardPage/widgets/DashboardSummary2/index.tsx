import styled from '@emotion/styled';
import { Box, Grid } from '@mui/material';
import { Component, ReactNode } from 'react';
import BoxOutlineSecondary from '../../../../components/atom/Box/BoxOutlineSecondary';
import { withTranslation } from 'react-i18next';
import Text from '../../../../components/atom/Text';
import ButtonOutline from '../../../../components/atom/Button/ButtonOutline';
import { I18n } from '../../../../i18';
import ImageFluid from '../../../../components/atom/Image/ImageFluid';

class DashboardSummary extends Component<I18n> {
  render(): ReactNode {


    const { t } = this.props;

    const gridItemPros = {
      xs: 12,
      sm: 4,
      md: 4,
      lg: 4,
    };

    const cardContent: string[] = [
      t?.('group_2.card_2.content_1') ?? '',
      t?.('group_2.card_2.content_2') ?? '',
      t?.('group_2.card_2.content_3') ?? ''
    ];

    return (
      <>
        <Text style={{
          marginBottom: 20
        }} variant='h3'>{t?.('group_2.title')}</Text>
        <DashboardSummaryStyled container spacing={{ xs: 2, md: 3 }}>
          <Grid item {...gridItemPros}>
            <BoxOutlineSecondary>
              <Text>{t?.('group_2.card_1.title')}</Text>
              <Text variant='h3'>0 <sup>TSC</sup></Text>
              <ButtonOutline sx={{
                margin: '0 auto',
              }}>{t?.('group_2.card_1.button_label')}</ButtonOutline>
              <Text>{t?.('group_2.card_1.content')}</Text>
              <Text variant='h3'>0 <sup>TSC</sup></Text>
              <ButtonOutline sx={{
                margin: '0 auto',
              }}>&nbsp;&nbsp;{t?.('group_2.card_1.button_label2')}&nbsp;&nbsp;</ButtonOutline>
            </BoxOutlineSecondary>
          </Grid>

          {/* card 2 */}
          <Grid item {...gridItemPros}>
            <BoxOutlineSecondary>
              <Box className='content'>
                <Text>MIN</Text>
                <Text variant='h3'>{t?.('group_2.card_2.min')}</Text>
                <Text>MAX</Text>
                <Text variant='h3'>{t?.('group_2.card_2.max')}</Text>
              </Box>
              <Text>&nbsp;</Text>
              <Box display={'flex'} flexDirection={'column'} gap={0.5}>
                {cardContent.map((s, index) => (
                  <SubText key={index} text={s} />))}
              </Box>
              <Text>&nbsp;</Text>
              <ButtonOutline sx={{
                margin: '0 auto',
              }}>{t?.('group_2.card_2.button_label')}</ButtonOutline>
            </BoxOutlineSecondary>
            <Text>&nbsp;</Text>
          </Grid>

          {/* Card 3 */}
          <Grid item {...gridItemPros}>
            <BoxOutlineSecondary>
              <Box className='content'>
                <Text>{t?.('group_2.card_3.title')}</Text>
                <Text variant='h3'>0 <sup>ETH</sup></Text>
              </Box>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
              }}>
                <ButtonOutline sx={{
                  margin: '0 auto',
                }}>{t?.('group_2.card_3.button_label_1')}</ButtonOutline>
                <div style={{
                  marginTop: 20
                }}></div>
                {
                  t?.('group_2.card_3.button_label_2') &&
                  <ButtonOutline sx={{
                    margin: '0 auto',
                  }}>{t?.('group_2.card_3.button_label_2')}</ButtonOutline>
                }
              </div>
            </BoxOutlineSecondary>
          </Grid>
        </DashboardSummaryStyled>
      </>
    );
  }
}

export default withTranslation('dashboard_page')(DashboardSummary);

const DashboardSummaryStyled = styled(Grid)`
  /* display: flex;
  justify-content: space-between;
  gap: 12px; */
`;

class SubText extends Component<{ text: string }> {
  render(): ReactNode {
    return (
      <Box display={'flex'} gap={1} >
        {/* <ImageFluid src='https://wallstmemes.com/assets/images/svg-icons/ani-arrow.svg' /> */}
        <Text fontSize={'10px'} color={'#535353'} fontWeight={500}>{this.props.text}</Text>
      </Box>
    );
  }
}

