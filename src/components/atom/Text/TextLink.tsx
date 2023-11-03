import React, { Component, ReactNode } from 'react';
import { Typography, TypographyProps, styled } from '@mui/material';

type Props = TypographyProps & {
  children?: React.ReactNode
}

class TextLink extends Component<Props> {

  render(): ReactNode {
    return (
      <TextLinkStyled variant='subtitle1' {...this.props}>{this.props.children}</TextLinkStyled>
    );
  }
}

export default TextLink;

const TextLinkStyled = styled(Typography)`
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    text-decoration: none;
  }
`;