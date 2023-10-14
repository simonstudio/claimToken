import React, { Component, ReactNode } from 'react';
import { Typography, TypographyProps } from '@mui/material';

type Props = TypographyProps & {
  children?: React.ReactNode
}

class Text extends Component<Props> {

  render(): ReactNode {
    return (
      <Typography variant='subtitle1' {...this.props}>{this.props.children}</Typography>
    );
  }
}

export default Text;