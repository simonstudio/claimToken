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
        icon: telegram,
        link: 'https://t.me/TimesSquareC'
      },
      {
        icon: twitter,
        link: 'https://twitter.com/TimesSquareC'
      },
      {
        icon: github,
        link: 'https://github.com/TimesSquareC'
      }
    ];

    return (
      <Box sx={{ alignItems: 'center', justifyContent: 'center' }} display={'flex'} gap={3} my={3} {...this.props}>
        {social.map((o, index) => (
          <img onClick={() => window.open(o.link, "_blank")} height={`${this.props.size ?? 42}px`} key={index} src={o.icon} />
        ))}
      </Box>
    );
  }
}

export default ListSocial;

