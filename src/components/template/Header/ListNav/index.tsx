import { Component, ReactNode } from 'react';
import ItemNav from './ItemNav';
import styled from '@emotion/styled';
import { Box, Theme } from '@mui/material';
import { withTranslation } from 'react-i18next';
import { I18n } from '../../../../i18';
import { theme } from '../../../../HOCs/useDetachScreen';
import storage from '../../../../utils/storage';

type Props = {

}

type State = {

}

export type TNavItem = {
  label: React.ReactNode;
  onclick?: () => void;
  children?: TNavItem[];
}

class ListNav extends Component<I18n, State> {

  
  constructor(props: Props) {
    super(props);
  }
  
  render(): ReactNode {

    const {t} = this.props;

    const items: TNavItem[] = [
      {
        label: t?.('header.stalking'),
        onclick: () => window.location.href ='/dashboard'
        
      },
      {
        label: t?.('header.community'),
      },
      {
        label: t?.('header.about'),
        
        children: [
          {
            label: t?.('header.about'),
            
          },
          {
            label: t?.('header.about'),
          }
        ]
      },
      {
        label: t?.('header.media'),
      }
    ];
    return (
      <ListNavStyled theme={theme}>
        {items.map((o, index) => (
          <ItemNav key={index} {...o} />
        ))}
      </ListNavStyled>
    );
  }
}

export default withTranslation('homepage')(ListNav);

const ListNavStyled = styled(Box)<{theme: Theme}>`
  display: flex;
  list-style: none;
  align-items: center;
  gap: 16px;
  padding-inline-start: 0px;

  ${props => props.theme.breakpoints.down('lg')} {
    display: none !important;
  }
`;
