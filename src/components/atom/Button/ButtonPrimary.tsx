import styled from '@emotion/styled';
import { Button, ButtonProps } from '@mui/material';
import { Component, ReactNode } from 'react';

type Props = ButtonProps & {
  children: React.ReactNode,
  isBold?: boolean;
}

class ButtonPrimary extends Component<Props> {



  render(): ReactNode {
    return (
      <ButtonStyled isBold={this.props.isBold ?? false} {...this.props} variant='contained'>
        {this.props.children}
      </ButtonStyled>
    );
  }
}

export default ButtonPrimary;

const ButtonStyled = styled(Button)<{isBold: boolean}>`
  font-weight: 600;
  border-radius: 9999px;
  padding: 8px 24px;

  font-weight: ${props => props.isBold ? 700 : 500};
`;