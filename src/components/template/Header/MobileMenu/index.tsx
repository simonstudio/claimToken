import styled from '@emotion/styled';
import { Box, Divider, Drawer, IconButton, List, ListItem, Popover, Theme } from '@mui/material';
import { Component, ReactNode } from 'react';
import { theme } from '../../../../HOCs/useDetachScreen';
import { withTranslation } from 'react-i18next';
import { I18n } from '../../../../i18';
import Text from '../../../atom/Text';
import ListSocial from '../../../molecules/ListSocial';
import { RenderChildItem } from '../ToolNav';
import { COLOR_BLUE } from '../../../../assets/color';
import AmericaFlagIcon from '../../../../assets/icon/Flags/AmericaFlagIcon.svg';
import storage from '../../../../utils/storage';
import { connect } from 'react-redux';
import { CHAINS, connectWeb3, getSigner } from '../../../../store/Web3';
import { loadSetting } from '../../../../store/Settings';
import { addContract } from '../../../../store/Tokens';
import ButtonPrimary from '../../../atom/Button/ButtonPrimary';
import { BNFormat } from '../../../../std';
import ConnectWallet from '../../../ConnectWallet';

type Props = I18n & {
  [name: string | number]: any
}

type State = {
  isOpenMenu: boolean;
  anchorEl: HTMLButtonElement | null
  open: boolean
}
class MobileMenu extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      isOpenMenu: false,
      anchorEl: null,
      open: false
    };
  }

  handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render(): ReactNode {
    const { t, i18n, web3, chainId, infos, accounts, settings } = this.props;
    let tokenBalance = infos?.balances?.[settings?.Token?.address] / 1e18
    let balance = Number(infos?.balances?.balance) / 1e18

    const navMenuMobile = [
      {
        'title': t?.('header.stalking'),
        onclick: () => window.location.href = '/dashboard'
      },
      {
        'title': t?.('header.community')
      },
      {
        'title': t?.('header.how_to_buy')
      },
      {
        'title': t?.('header.tokenomics')
      },
      {
        'title': t?.('header.airdrop')
      },
      {
        'title': t?.('header.media')
      },
    ];

    const handleChangeLang = (lang: string) => {
      i18n?.changeLanguage(lang);
      storage.lang.set(lang);

      this.handleClose();
    };

    const langOptions = [
      {
        label: <RenderChildItem onClick={() => handleChangeLang('en')} label='English' icon={<img className='icon-flag' src={AmericaFlagIcon} />} />,
        link: '/'
      },
      {
        label: <RenderChildItem onClick={() => handleChangeLang('fr')} label='France' icon={<img className='icon-flag' src={'/images/fr.svg'} />} />,
        link: '/'
      },
      {
        label: <RenderChildItem onClick={() => handleChangeLang('id')} label='Indonesian' icon={<img className='icon-flag' src={'/images/indonesia.svg'} />} />,
        link: '/'
      },
    ];

    const getLang = () => {
      switch (i18n?.language) {
        case 'en':
          return 'English';
        case 'fr':
          return 'France';
        case 'id':
          return 'Indonesia';
        default:
          return 'English';
      }
    };

    return (
      <MobileMenuStyled theme={theme}>
        <IconButton onClick={() => this.setState({ isOpenMenu: !this.state.isOpenMenu })}>
          {!this.state.isOpenMenu ? <MobileMenuIcon /> : <CloseMenuIcon />}
        </IconButton>
        <DrawerStyled
          anchor={'right'}
          open={this.state.isOpenMenu}
          onClose={() => this.setState({ isOpenMenu: false })}
        >
          <List>
            {navMenuMobile.map((o, index) => (
              <ListItem onClick={o.onclick} key={index}>
                <Box className='nav-item' color={'white'} width={'100%'}>
                  <Text p={1} fontWeight={700}>{o.title}</Text>
                  <Divider sx={{
                    backgroundColor: 'white',
                    width: '100%'
                  }} />
                </Box>
              </ListItem>
            ))}
          </List>
          <List>
            <ListItem>
              {web3 ?
                (<Box className='nav-item' color={'white'} width={'100%'}>
                  <div>0x...{accounts[0]?.address?.slice(-3)}</div>
                  <div><b>{BNFormat(balance)}</b> {CHAINS[chainId]?.nativeCurrency?.symbol}</div>
                  <div><b>{BNFormat(tokenBalance)}</b> {infos?.token?.symbol}</div>
                </Box>) :
                (<ConnectWallet />)
                // (<ButtonPrimary onClick={this.connectWeb3.bind(this)} isBold> {t?.('connect wallet')}</ButtonPrimary>)
              }
            </ListItem>
          </List>

          <IconButton className='nav-lang' onClick={this.handleClick}>
            <Text color={'black'} fontWeight={700}>{getLang()}</Text>
          </IconButton>
          <ListSocial />
        </DrawerStyled>

        <PopoverStyled
          id={this.state.anchorEl ? 'item-nav' : ''}
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Box className='popover-card' display={'flex'} gap={'12px'} padding={2} width={'250px'} flexDirection={'column'}>
            {langOptions?.map((o, index) => (
              <Text fontSize={'16px'} fontWeight={'600'} key={index}>{o.label}</Text>
            ))}
          </Box>
        </PopoverStyled>
      </MobileMenuStyled>
    );
  }
}

const PopoverStyled = styled(Popover)`
  .popover-card {
    & > p:hover {
      cursor: pointer;
      color: ${COLOR_BLUE};
    }
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
})(withTranslation('homepage')(MobileMenu));

const DrawerStyled = styled(Drawer)`
  .MuiPaper-root {
    top: 80px;
    width: 60%;
    min-width: 320px;
    max-width: 320px;
    height: 100%;
    background-color: black;
    padding: 20px;
  }

  .nav-item {
    cursor: pointer;
    &:hover {
      background-color: #0066FF;
    }
  }

  .nav-button {
    border-radius: 32px;
    padding: 10px;
    margin-left: 17px;
    width: 84%;
    cursor: pointer;
    border: 1px solid #F1F4F6;
    background: #fff;
    text-transform: capitalize;
    font-weight: 700;
    color: #000;
    text-align: center;
  }

  .nav-lang {
    display: block;
    width: 90%;
    padding: 8px;
    margin-left: 17px;
    margin-top: 12px;
    border-radius: 32px;
    background: #fff;
    text-decoration: none;
    text-transform: capitalize;
    font-weight: 500;
    text-align: center;
  }

`;

const MobileMenuStyled = styled(Box) <{ theme: Theme }>`
  ${props => props.theme.breakpoints.up('lg')} {
    display: none;
  }

`;

class MobileMenuIcon extends Component {
  render(): ReactNode {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: '32px', height: '32px', }}>
        <path d="M4.12502 6.0249C4.12502 5.42725 4.61721 4.8999 5.25002 4.8999H18.75C19.3477 4.8999 19.875 5.42725 19.875 6.0249C19.875 6.65771 19.3477 7.1499 18.75 7.1499H5.25002C4.61721 7.1499 4.12502 6.65771 4.12502 6.0249ZM4.12502 11.6499C4.12502 11.0522 4.61721 10.5249 5.25002 10.5249H18.75C19.3477 10.5249 19.875 11.0522 19.875 11.6499C19.875 12.2827 19.3477 12.7749 18.75 12.7749H5.25002C4.61721 12.7749 4.12502 12.2827 4.12502 11.6499ZM19.875 17.2749C19.875 17.9077 19.3477 18.3999 18.75 18.3999H5.25002C4.61721 18.3999 4.12502 17.9077 4.12502 17.2749C4.12502 16.6772 4.61721 16.1499 5.25002 16.1499H18.75C19.3477 16.1499 19.875 16.6772 19.875 17.2749Z" fill="#000000"></path>
      </svg>
    );
  }
}

class CloseMenuIcon extends Component {
  render(): ReactNode {
    return (
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="64px" height="64px" viewBox="0,0,256,256" aria-hidden="true" style={{ width: '32px', height: '32px', }}><g fill="#000000" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: 'normal' }} >
        <g transform="scale(4,4)"><path d="M49.6,46.4l-11.314,-14.4l11.314,-14.4l-3.2,-3.2l-14.4,11.314l-14.4,-11.314l-3.2,3.2l11.314,14.4l-11.314,14.4l3.2,3.2l14.4,-11.314l14.4,11.314z"></path></g></g></svg>
    );
  }
}

class WalletIcon extends Component {
  render(): ReactNode {
    return (
      <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: '24px', height: '22px', }}>
        <path d="M21.3752 0.700012C21.9846 0.700012 22.5002 1.21564 22.5002 1.82501C22.5002 2.48126 21.9846 2.95001 21.3752 2.95001H4.1252C3.04707 2.95001 2.2502 3.79376 2.2502 4.82501V17.575C2.2502 18.6531 3.04707 19.45 4.1252 19.45H19.8752C20.9064 19.45 21.7502 18.6531 21.7502 17.575V9.32501C21.7502 8.29376 20.9064 7.45001 19.8752 7.45001H5.6252C4.96895 7.45001 4.5002 6.98126 4.5002 6.32501C4.5002 5.71564 4.96895 5.20001 5.6252 5.20001H19.8752C22.1252 5.20001 24.0002 7.07501 24.0002 9.32501V17.575C24.0002 19.8719 22.1252 21.7 19.8752 21.7H4.1252C1.82832 21.7 0.000195503 19.8719 0.000195503 17.575V4.82501C0.000195503 2.57501 1.82832 0.700012 4.1252 0.700012H21.3752ZM16.5002 13.45C16.5002 12.6531 17.1564 11.95 18.0002 11.95C18.7971 11.95 19.5002 12.6531 19.5002 13.45C19.5002 14.2938 18.7971 14.95 18.0002 14.95C17.1564 14.95 16.5002 14.2938 16.5002 13.45Z" fill="#ffffff"></path>
      </svg>
    );
  }
}

