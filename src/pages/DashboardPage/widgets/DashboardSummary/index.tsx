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
      md: 3,
      lg: 2.4,
    };

    const cardContent: string[] = [
      t?.('card_3.content_1') ?? '',
      t?.('card_3.content_2') ?? '',
      // t?.('card_3.content_3') ?? '',
    ];

    return (
      <DashboardSummaryStyled container spacing={{ xs: 2, md: 3 }}>
        <Grid item {...gridItemPros}>
          <BoxOutlineSecondary>
            <Text>{t?.('card_1.title')}</Text>
            <Text variant='h3'>0 <sup>WSM</sup></Text>
            <ButtonOutline sx={{
              margin: '0 auto',
            }}>{t?.('card_1.button_label')}</ButtonOutline>
            <Text>{t?.('card_1.content')}</Text>
            <Text variant='h3'>0 <sup>WSM</sup></Text>
          </BoxOutlineSecondary>
        </Grid>

        {/* card 2 */}
        <Grid item {...gridItemPros}>

          <BoxOutlineSecondary>
            <Box className='content'>
              <Box display={'flex'} gap={1}>
                <Text>{t?.('card_2.title')}</Text>
                <ImageFluid src='https://wallstmemes.com/assets/images/svg-icons/info-icon.svg' />
              </Box>
              <Text variant='h3'>0%</Text>
              <Text>{t?.('card_2.subtitle')}</Text>
              <Text variant='h3'>0%</Text>
            </Box>
          </BoxOutlineSecondary>
        </Grid>

        {/* card 3 */}
        <Grid item {...gridItemPros}>
          <BoxOutlineSecondary>
            <Box className='content'>
              <Text>{t?.('card_3.title')}</Text>
              <Text variant='h3'>45%</Text>
            </Box>

            <Box display={'flex'} flexDirection={'column'} gap={0.5}>
              {cardContent.map((s, index) => (
                <SubText key={index} text={s} />))}
            </Box>
          </BoxOutlineSecondary>
        </Grid>

        {/* Card 4 */}
        <Grid item {...gridItemPros}>
          <BoxOutlineSecondary>
            <Box className='content'>
              <Text>{t?.('card_4.title')}</Text>
              <Text variant='h3'>75 <sup>{t?.('card_4.per_block')}</sup></Text>
            </Box>
          </BoxOutlineSecondary>
        </Grid>


        {/* Card 5 */}
        <Grid item {...gridItemPros}>
          <BoxOutlineSecondary>
            <Box className='content'>
              <Text>{t?.('card_5.title')}</Text>
              <Text variant='h3'>0 <sup>WSM</sup></Text>
            </Box>
            <ButtonOutline sx={{
              margin: '0 auto',
            }}>{t?.('card_5.button_label')}</ButtonOutline>
          </BoxOutlineSecondary>
        </Grid>
      </DashboardSummaryStyled>
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
        <ImageFluid src='https://wallstmemes.com/assets/images/svg-icons/ani-arrow.svg' />
        <Text fontSize={'10px'} color={'#535353'} fontWeight={500}>{this.props.text}</Text>
      </Box>
    );
  }
}

