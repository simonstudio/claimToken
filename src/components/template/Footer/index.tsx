import styled from '@emotion/styled';
import { Box, Theme } from '@mui/material';
import { Component, ReactNode } from 'react';
import Text from '../../atom/Text';
import moment from 'moment';
import TextLink from '../../atom/Text/TextLink';
import ListSocial from '../../molecules/ListSocial';
import { theme } from '../../../HOCs/useDetachScreen';
import LogoIcon from '../../../assets/icon/LogoIcon';
import { withTranslation } from 'react-i18next';
import { I18n } from '../../../i18';

class Footer extends Component<I18n> {
  render(): ReactNode {

    const { t } = this.props;

    return (
      <FooterStyled theme={theme}>
        <LogoIcon height={85} width={85} />
        <Box className='footer-content' display={'flex'} alignContent={'center'} justifyContent={'space-between'} gap={'26px'}>
          <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
            <Text>{t?.('footer.content_1')}</Text>
            <Box className='footer-content-copyright' display={'flex'} alignItems={'center'} gap={2}>
              <Text>Copyright © {moment().get('year')} {t?.('footer.content_2')}</Text>
              <Box className={'footer-content-copyright-link'} display={'flex'} gap={2}>
                <TextLink>{t?.('footer.link_1')}</TextLink>
                <TextLink>{t?.('footer.link_2')}</TextLink>
                <TextLink>{t?.('footer.link_3')}</TextLink>
              </Box>
            </Box>
          </Box>
          <Box>
            <ListSocial size={25} gap={1} />
            <Text>xxx@xxx.com</Text>
          </Box>
        </Box>
        <Text className='footer-bottom' mt={4}>{t?.('footer.content_3')}</Text>
      </FooterStyled>
    );
  }
}

export default withTranslation('homepage')(Footer);

const FooterStyled = styled(Box) <{ theme: Theme }>`
  background: #000000;
  color: #fff;
  padding: 30px 16px;
  display: flex;
  flex-direction: column;

  & > svg {
    display: none;
  }

  ${props => props.theme.breakpoints.down('lg')} {
    justify-content: center;
    align-items: center ;
    & > svg {
      display: block;
    }
    .footer-content {
      flex-direction: column-reverse;
      align-items: center;
      text-align: center;

      &-copyright {
        text-align: center;
        flex-direction: column;
        align-items: center;
      }
    }
    .footer-bottom {
      text-align: center;
    }
  }

`;  