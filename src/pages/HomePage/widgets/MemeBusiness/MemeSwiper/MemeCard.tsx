import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Component, ReactNode } from 'react';
import BoxOutline from '../../../../../components/atom/Box/BoxOutline';
import ImageFluid from '../../../../../components/atom/Image/ImageFluid';

type Props = {
  imgUrl: string
}

class MemeCard extends Component<Props> {
  render(): ReactNode {
    return (
      <MemeCardStyled>
        <BoxOutline>
          <ImageFluid src={this.props.imgUrl}/>
        </BoxOutline>
      </MemeCardStyled>
    );
  }
}

export default MemeCard;

const MemeCardStyled = styled(Box)`

  img {
    margin: 0 auto;
    max-width: 100%!important;
    min-height: 500px;
    max-height: 500px;
    width: auto;
  }
`;