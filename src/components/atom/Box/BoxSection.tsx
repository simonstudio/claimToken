import styled from '@emotion/styled';
import { Box, BoxProps } from '@mui/material';
import React, { Component, ReactNode } from 'react';
import { MAX_WIDTH } from '../../../assets/unit';

class BoxSection extends Component<{children: React.ReactNode} & BoxProps> {
  render(): ReactNode {
    return (
      <BoxSectionStyled>
        {this.props.children}
      </BoxSectionStyled>
    );
  }
}

export default BoxSection;

const BoxSectionStyled = styled(Box)`
  max-width: ${MAX_WIDTH};
  margin: 0 auto;
`;