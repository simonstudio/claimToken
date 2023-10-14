import styled from '@emotion/styled';
import { Box, BoxProps, Theme } from '@mui/material';
import React, { Component, ReactNode } from 'react';
import AmericaFlagIcon from '../../../../assets/icon/Flags/AmericaFlagIcon.svg';
import ButtonPrimary from '../../../atom/Button/ButtonPrimary';
import ItemNav from '../ListNav/ItemNav';
import { TNavItem } from '../ListNav';
import { withTranslation } from 'react-i18next';
import { I18n } from '../../../../i18';
import { theme } from '../../../../HOCs/useDetachScreen';
import storage from '../../../../utils/storage';

class ToolNav extends Component<I18n> {


  
  render(): ReactNode {

    const {t, i18n} = this.props;


    const handleChangeLang = (lang: string) => {
      i18n?.changeLanguage(lang);
      storage.lang.set(lang);
    };
    
    const data: TNavItem = {
      label: '' ,
      children: [
        {
          label: <RenderChildItem onClick={() => handleChangeLang('en')} label='English' icon={<img className='icon-flag' src={AmericaFlagIcon} />}/>,
        },
        {
          label: <RenderChildItem onClick={() => handleChangeLang('fr')} label='France' icon={<img className='icon-flag' src={'https://wallstmemes.com/assets/images/flags/fr.svg'} />}/>,
        },
        {
          label: <RenderChildItem onClick={() => handleChangeLang('id')} label='Indonesian' icon={<img className='icon-flag' src={'https://wallstmemes.com/assets/images/flags/id.svg'} />}/>,
        },
      ]
    };

    const urlIcon = () => {
      switch(i18n?.language) {
        case 'en': 
          return AmericaFlagIcon;
        case 'fr':
          return 'https://wallstmemes.com/assets/images/flags/fr.svg';
        case 'id':
          return 'https://wallstmemes.com/assets/images/flags/id.svg';
        default:
          return AmericaFlagIcon;
      }
    };

    return (
      <ToolNavStyled theme={theme}>
        <Box className={'flag'}>
          <ItemNav 
            icon={<img className='icon-flag' src={urlIcon()} />} 
            {...data}
            />
        </Box>

        <ButtonPrimary onClick={() => window.location.href ='/dashboard'} isBold> {t?.('header.stalking')}</ButtonPrimary>

      </ToolNavStyled>
    );
  }
}

export default withTranslation('homepage')(ToolNav);

const ToolNavStyled = styled(Box)<{theme: Theme}>`
  display: flex;
  list-style: none;
  align-items: center;
  gap: 16px;
  padding-inline-start: 0px;


  .icon-flag {
    width: 23px;
    height: 23px;
    object-fit: cover;
    overflow: hidden;
    border-radius: 50%;
  }

  ${props => props.theme.breakpoints.down('lg')} {
    .flag {
      display: none;
    }
  }
  
`;

export class RenderChildItem extends Component<{label: string, icon: React.ReactNode} & BoxProps> {
  render(): React.ReactNode {
    return (
      <RenderChildItemStyled {...this.props}>
        {this.props.icon}
        {this.props.label}
      </RenderChildItemStyled>
    );
  }
}

const RenderChildItemStyled = styled(Box)`
  display: flex;
  list-style: none;
  align-items: center;
  gap: 16px;
  padding-inline-start: 0px;

  .icon-flag {
    width: 23px;
    height: 23px;
    object-fit: cover;
    overflow: hidden;
    border-radius: 50%;
  }
    font-weight: 500;
    &:hover {
      color: #000;
  }
`;