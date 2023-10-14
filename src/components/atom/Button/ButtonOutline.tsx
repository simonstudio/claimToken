import styled from '@emotion/styled';
import { Button, ButtonProps } from '@mui/material';
import { Component, ReactNode } from 'react';
import { COLOR_PRIMARY } from '../../../assets/color';

type Props = ButtonProps & {
  children: React.ReactNode,
  isBold?: boolean;
}

class ButtonOutline extends Component<Props> {



  render(): ReactNode {
    return (
      <ButtonStyled isBold={this.props.isBold ?? false} {...this.props} variant='outlined'>
        {this.props.children}
      </ButtonStyled>
    );
  }
}

export default ButtonOutline;

const ButtonStyled = styled(Button)<{isBold: boolean}>`
  font-weight: 600;
  border-radius: 9999px;
  font-weight: ${props => props.isBold ? 700 : 500};
  padding: 8px 24px;
  border: 2px solid ${COLOR_PRIMARY};

  &:hover {
    border: 2px solid ${COLOR_PRIMARY};
    background-color: ${COLOR_PRIMARY};
    color: white;
  }

`;