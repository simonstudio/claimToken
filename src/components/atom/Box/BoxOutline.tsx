import styled from '@emotion/styled';
import { Box, BoxProps } from '@mui/material';
import React, { Component, ReactNode } from 'react';
import { COLOR_PRIMARY } from '../../../assets/color';

type Props = BoxProps & {
  children: React.ReactNode
 }

class BoxOutline extends Component<Props> {
  render(): ReactNode {
    return (
      <BoxOutlineStyled {...this.props}>
        {this.props.children}
      </BoxOutlineStyled>
    );
  }
}

export default BoxOutline;

const BoxOutlineStyled = styled(Box)`
    border: 3px solid ${COLOR_PRIMARY};
    border-radius: 29px;
    overflow: hidden;
    position: relative;
    background: #ffffff;
    box-shadow: 8px 9px #bfbfbf;
    display: flex;
`;