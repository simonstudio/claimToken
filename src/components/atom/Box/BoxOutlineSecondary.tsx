import styled from '@emotion/styled';
import { Box } from '@mui/material';
import React, { Component, ReactNode } from 'react';

class BoxOutlineSecondary extends Component<{children: React.ReactNode}> {
  render(): ReactNode {
    return (
      <BoxOutlineSecondaryStyled>
        {this.props.children}
      </BoxOutlineSecondaryStyled>
    );
  }
} 

export default BoxOutlineSecondary;

const BoxOutlineSecondaryStyled = styled(Box)`
    padding: 20px 30px;
    align-items: flex-start;
    border-radius: 12px;
    max-width: 100%;
    height: 80%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 193px;
    background: #ffffff;
    border: 3px #000000 solid;
    overflow: hidden;
    box-shadow: 0 6px 5px #00000008;
    .content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
`;
