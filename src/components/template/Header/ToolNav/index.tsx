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
import { connect } from 'react-redux';
import { CHAINS, connectWeb3, getSigner } from '../../../../store/Web3';
import { loadSetting } from '../../../../store/Settings';
import { addContract } from '../../../../store/Tokens';
import { notification } from 'antd';
import ConnectWallet from '../../../ConnectWallet';
import { BNFormat } from '../../../../std';
import { useLocation } from 'react-router-dom';
const { log } = console;

type Props = I18n & {
  [name: string | number]: any
}

class ToolNav extends Component<Props> {

  connectWeb3(e: any) {
    const { t, i18n, web3, connectWeb3 } = this.props;
    if (window.ethereum)
      connectWeb3().then((r: any) => {
        log(r)
      })
    else
      notification.error({
        message: (<>{t?.("Please install")} &nbsp;
          <a href={"https://metamask.io/download"} target='_blank'>Metamask</a> &nbsp;
          <a href={"https://trustwallet.com/download"} target='_blank'>Trust wallet</a>
        </>)
      })
  }

  render(): ReactNode {

    const { t, i18n, web3, chainId, infos, accounts, settings } = this.props;
    let tokenBalance = infos?.balances?.[settings?.Token?.address] / 1e18
    let balance = Number(infos?.balances?.balance) / 1e18

    const handleChangeLang = (lang: string) => {
      i18n?.changeLanguage(lang);
      storage.lang.set(lang);
    };

    const data: TNavItem = {
      label: '',
      children: [
        {
          label: <RenderChildItem onClick={() => handleChangeLang('en')} label='English' icon={<img className='icon-flag' src={AmericaFlagIcon} />} />,
        },
        {
          label: <RenderChildItem onClick={() => handleChangeLang('fr')} label='France' icon={<img className='icon-flag' src={'/images/fr.svg'} />} />,
        },
        {
          label: <RenderChildItem onClick={() => handleChangeLang('id')} label='Indonesian' icon={<img className='icon-flag' src={'/images/indonesia.svg'} />} />,
        },
      ]
    };

    const urlIcon = () => {
      switch (i18n?.language) {
        case 'en':
          return AmericaFlagIcon;
        case 'fr':
          return '/images/fr.svg';
        case 'id':
          return '/images/indonesia.svg';
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
        <ButtonStake />
        {web3 ?
          (<MobileMenuStyled theme={theme}>
            <div>0x...{accounts[0]?.address?.slice(-3)}</div>
            <div><b>{BNFormat(balance)}</b> {CHAINS[chainId]?.nativeCurrency?.symbol}</div>
            <div><b>{BNFormat(tokenBalance)}</b> {infos?.token?.symbol}</div>
          </MobileMenuStyled>) :
          (<ConnectWallet />)
          // (<ButtonPrimary onClick={this.connectWeb3.bind(this)} isBold> {t?.('connect wallet')}</ButtonPrimary>)
        }
      </ToolNavStyled>
    );
  }
}

const MobileMenuStyled = styled(Box) <{ theme: Theme }>`
  ${props => props.theme.breakpoints.down('lg')} {
    display: none;
  }

`;
function ButtonStake() {
  const location = useLocation();
  let href = '/dashboard'
  if (location.pathname !== href)
    return (
      <ButtonPrimary onClick={() => window.location.href = href} isBold={true}>Stake</ButtonPrimary>
    )
  else return (<></>)
}

const ToolNavStyled = styled(Box) <{ theme: Theme }>`
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

export class RenderChildItem extends Component<{ label: string, icon: React.ReactNode } & BoxProps> {
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


const mapStateToProps = (state: any, ownProps: any) => ({
  web3: state.Web3.web3,
  accounts: state.Web3.accounts,
  chainId: state.Web3.chainId,
  chainName: state.Web3.chainName,
  settings: state.Settings,
  tokens: state.Tokens,
  infos: state.Infos,
});

export default connect(mapStateToProps, {
  connectWeb3: connectWeb3,
  getSigner: getSigner,
  loadSetting: loadSetting,
  addContract: addContract,
})(withTranslation('homepage')(ToolNav));

