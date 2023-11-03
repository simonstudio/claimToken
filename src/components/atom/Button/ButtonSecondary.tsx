import styled from '@emotion/styled';
import { Button, ButtonProps } from '@mui/material';
import { Component, ReactNode } from 'react';

type Props = ButtonProps & {
  children: React.ReactNode;
}

class ButtonSecondary extends Component<Props> {
  render(): ReactNode {
    return (
      <ButtonSecondaryStyled variant='contained' {...this.props}>{this.props.children}</ButtonSecondaryStyled>
    );
  }
}

export default ButtonSecondary;

const ButtonSecondaryStyled = styled(Button)`
  border-radius: 999px;
  border: 2px solid white;
  padding: 8px 24px;
  font-weight: 700;
  box-shadow: 0 4px 4px #00000040;
`;