import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Component, ReactNode } from 'react';
import LogoIcon from '../../../assets/icon/LogoIcon';
import ListNav from './ListNav';
import ToolNav from './ToolNav';
import { TScreen } from '../../../HOCs/useDetachScreen';

import MobileMenu from './MobileMenu';


type Props = TScreen & {

}

type State = {
  isMobile: boolean
}

class Header extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  render(): ReactNode {    
    return (
      <HeaderStyled zIndex={1300}>
        <LogoIcon/>
        <ListNav/>
        <ToolNav/>
        <MobileMenu/>
      </HeaderStyled>
    );
  }
}

export default Header;


const HeaderStyled = styled(Box)`
  display: flex;
  justify-content: space-between;
  position: sticky;
  align-items: center;
  top: 0;
  padding: 15px 25px;
  background: rgba(255,255,255,.85);
`;