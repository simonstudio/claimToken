import { Box, BoxProps, Grid } from '@mui/material';
import { Component, ReactNode } from 'react';
import ImageFluid from '../../../../components/atom/Image/ImageFluid';
import styled from '@emotion/styled';
import Text from '../../../../components/atom/Text';

export type WallStreetMemeItemProps = {
  avatarUrl: string;
  speechUrl: string;
  index: number;
  content: string;
  isReverse: boolean;

}

class WallStreetMemeItem extends Component<WallStreetMemeItemProps & BoxProps> {

  positionImage = () => {
    switch(this.props.index) {
      case 1:
        return {
          bottom: '-70px !important',
          left: '-22px'
        };
      case 2:
        return {
          bottom: '-110px',
        };
      case 3:
        return {
          bottom: '-70px !important',
          right: '-70px !important'
        };
    }

  };

  render(): ReactNode {

    return (
      <WallStreetMemeItemStyled isReverse={this.props.isReverse} speechUrl={this.props.speechUrl} item >
        <blockquote className='speech'>
          <Box >
            <Text variant='h2'>{this.props.index}</Text>
            <Text className='content'>{this.props.content}</Text>
          </Box>
        </blockquote>
        <Box {...this.positionImage() }{...this.props} className={'avatar'}>
          <ImageFluid src={this.props.avatarUrl}/>
        </Box>
      </WallStreetMemeItemStyled>
    );
  }
}

export default WallStreetMemeItem;

const WallStreetMemeItemStyled = styled(Grid)<{speechUrl: WallStreetMemeItemProps['speechUrl'], isReverse: WallStreetMemeItemProps['isReverse']}>`
  position: relative;

  .avatar {
    position: absolute;
    right: ${props => props.isReverse ? 0 : undefined};
    bottom: -110px;
  }
  .speech {
    background-image: url(${props => props.speechUrl});
    width: 100%;
    padding: 33.3% 0;

    background-position: center;
    background-repeat: no-repeat!important;
    background-size: 100% 100%;
    margin: 0 auto;
    text-align: center;
    height: 0;
    box-sizing: content-box;
    line-height: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 30px;

    .content {
      width: 70%;
      margin: 15px auto 15%;
      max-width: 400px;
    }
  }
`;

