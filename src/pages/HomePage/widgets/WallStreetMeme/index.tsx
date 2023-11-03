import { Box, Grid, Theme } from '@mui/material';
import React, { Component, ReactNode } from 'react';
import LogoIcon from '../../../../assets/icon/logo.png';
import Text from '../../../../components/atom/Text';

import Avatar1 from '../../../../assets/icon/meme/bull-business-4.png';
import Avatar2 from '../../../../assets/icon/meme/bull-business-5.png';
import Avatar3 from '../../../../assets/icon/meme/bull-business-6.png';
import styled from '@emotion/styled';
import WallStreetMemeItem, { WallStreetMemeItemProps } from './WallStreetMemeItem';
import WallStreetMemeItem1 from './WallStreetMemeItem1';
import ButtonSecondary from '../../../../components/atom/Button/ButtonSecondary';
import { theme } from '../../../../HOCs/useDetachScreen';
import { I18n } from '../../../../i18';
import { withTranslation } from 'react-i18next';

//icon
import step1 from '../../../../assets/image/meme/chat-box-2.svg';
import step2 from '../../../../assets/image/meme/chat-box-3.svg';
import step3 from '../../../../assets/image/meme/chat-box-1.svg';

class WallStreetMeme extends Component<I18n> {


  render(): ReactNode {

    const { t } = this.props;

    const wallStreetData: WallStreetMemeItemProps[] = [
      {
        index: 2,
        speechUrl: step2,
        avatarUrl: Avatar2,
        content: t?.('wall_meme.speech_2') ?? '',
        isReverse: true,
      },
      {
        index: 3,
        speechUrl: step3,
        avatarUrl: Avatar3,
        content: t?.('wall_meme.speech_3') ?? '',
        isReverse: true,
      }
    ];

    const wallStreetData2: WallStreetMemeItemProps[] = [{
      index: 1,
      speechUrl: step1,
      avatarUrl: Avatar1,
      content: t?.('wall_meme.speech_1') ?? '',
      isReverse: false,
    }]

    const openPdfLink = () => {
      window.open(process.env.PUBLIC_URL + '/whitepaper.pdf', '_blank');
    };

    return (
      <WallStreetMemeStyled theme={theme} overflow={'hidden'} mt={1} gap={3} display={'flex'} alignItems={'center'} flexDirection={'column'} justifyContent={'center'} id='howtobuy'>
        <img style={{ marginTop: 100 }} src={LogoIcon} width={70} />
        <Text variant='h2'>{t?.('wall_meme.title')}</Text>
        <Text >{t?.('wall_meme.subtitle')}</Text>
        <Grid className='meme-speech' sx={{
          flexFlow: 'nowrap',
        }} container spacing={2}>
          {wallStreetData2.map((o) => (
            <WallStreetMemeItem1 key={o.index} {...o} />
          ))}
          {wallStreetData.map((o) => (
            <WallStreetMemeItem key={o.index} {...o} />
          ))}
        </Grid>
        <ButtonSecondary onClick={() => openPdfLink()} sx={{
          margin: '180px 0px'
        }}>{t?.('wall_meme.button_helper')}</ButtonSecondary>
      </WallStreetMemeStyled>
    );
  }
}

export default withTranslation('homepage')(WallStreetMeme);


const WallStreetMemeStyled = styled(Box) <{ theme: Theme }>`
  text-align: center;
  ${props => props.theme.breakpoints.down('lg')} {
    .meme-speech {
      flex-direction: column;
      padding: 0px auto;
      justify-content: center;
      align-items: center;
      gap: 110px;

    }
  }

  .speech {
    background-image: url('https://wallstmemes.com/bubble-1.6b77430bbd02b07a.svg');
    width: 100%;
    padding: 33.3% 0;

    background-position: center;
    background-repeat: no-repeat!important;
    background-size: 100% 100%;
    margin: 0 auto;
    text-align: center;
    height: 0;
    box-sizing: content-box;
    line-height: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 30px;
  }
`;