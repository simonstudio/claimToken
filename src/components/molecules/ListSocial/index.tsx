import { Box, BoxProps } from '@mui/material';
import { Component, ReactNode } from 'react';

//img
import twitter from '../../../assets/icon/twitter.svg';
import telegram from '../../../assets/icon/telegram.svg';
import github from '../../../assets/icon/github.svg';

class ListSocial extends Component<{ size?: number } & BoxProps> {
  render(): ReactNode {

    const social = [
      {
        icon: telegram
      },
      {
        icon: twitter
      },
      {
        icon: github
      },
    ];

    return (
      <Box display={'flex'} gap={3} my={3} {...this.props}>
        {social.map((o, index) => (
          <img height={`${this.props.size ?? 42}px`} key={index} src={o.icon} />
        ))}
      </Box>
    );
  }
}

export default ListSocial;

