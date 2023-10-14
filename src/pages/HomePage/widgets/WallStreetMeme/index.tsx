import { Box, Grid, Theme } from '@mui/material';
import { Component, ReactNode } from 'react';
import LogoIcon from '../../../../assets/icon/LogoIcon';
import Text from '../../../../components/atom/Text';

import Avatar1 from '../../../../assets/image/WallStreeMeme/avatar-1.png';
import Avatar2 from '../../../../assets/image/WallStreeMeme/avatar-2.png';
import Avatar3 from '../../../../assets/image/WallStreeMeme/avatar-3.png';
import styled from '@emotion/styled';
import WallStreetMemeItem, { WallStreetMemeItemProps } from './WallStreetMemeItem';
import ButtonSecondary from '../../../../components/atom/Button/ButtonSecondary';
import { theme } from '../../../../HOCs/useDetachScreen';
import { I18n } from '../../../../i18';
import { withTranslation } from 'react-i18next';

class WallStreetMeme extends Component<I18n> {

  
  render(): ReactNode {

    const { t } = this.props;

    const wallStreetData: WallStreetMemeItemProps[] = [
      {
        index: 1,
        speechUrl: 'https://wallstmemes.com/bubble-1.6b77430bbd02b07a.svg',
        avatarUrl: Avatar1,
        content: t?.('wall_meme.speech_1') ?? '',
        isReverse: false,
      },
      {
        index: 2,
        speechUrl: 'https://wallstmemes.com/bubble-2.d835f0152d803db1.svg',
        avatarUrl: Avatar2,
        content: t?.('wall_meme.speech_2') ?? '',
        isReverse: true,
      },
      {
        index: 3,
        speechUrl: 'https://wallstmemes.com/bubble-3.01971bdad5588e73.svg',
        avatarUrl: Avatar3,
        content: t?.('wall_meme.speech_3') ?? '',
        isReverse: true,
      }
    ];
    return (
      <WallStreetMemeStyled theme={theme} overflow={'hidden'} mt={1} gap={3} display={'flex'} alignItems={'center'} flexDirection={'column'} justifyContent={'center'}>
        <LogoIcon width={75} height={75}/>
        <Text variant='h2'>{t?.('wall_meme.title')}</Text>
        <Text >{t?.('wall_meme.subtitle')}</Text>
        <Grid className='meme-speech' sx={{
          flexFlow: 'nowrap',
        }} container spacing={2}>
          {wallStreetData.map((o) => (
            <WallStreetMemeItem key={o.index} {...o} />
          ))}
        </Grid>
        <ButtonSecondary sx={{
          margin: '100px 0px'
        }}>{t?.('wall_meme.button_helper')}</ButtonSecondary>
      </WallStreetMemeStyled>
    );
  }
}

export default withTranslation('homepage')(WallStreetMeme);


const WallStreetMemeStyled = styled(Box)<{theme: Theme}>`
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