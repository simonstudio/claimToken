import styled from '@emotion/styled';
import { Component, ReactNode } from 'react';

class ImageFluid extends Component<React.ImgHTMLAttributes<HTMLImageElement>> {
  render(): ReactNode {
    return (
      <ImageFluidStyled {...this.props}/>
    );
  }
}

export default ImageFluid;

const ImageFluidStyled = styled.img`
    max-width: 100%;
    height: auto;
`;