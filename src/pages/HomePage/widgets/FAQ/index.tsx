import styled from '@emotion/styled';
import { Box, Theme } from '@mui/material';
import { Component, ReactNode } from 'react';
import Text from '../../../../components/atom/Text';
import FAQItem from './FAQItem';
import { theme } from '../../../../HOCs/useDetachScreen';
import { I18n } from '../../../../i18';
import { withTranslation } from 'react-i18next';

export type TFAQ = {
  question: string;
  answer: string;
}

class FAQ extends Component<I18n> {


  render(): ReactNode {

    const { t } = this.props;

    const data: TFAQ[] = [
      {
        question: t?.('wsm_airdrop.ques.0') ?? '',
        answer: t?.('wsm_airdrop.ans.0') ?? ''
      },
      {
        question: t?.('wsm_airdrop.ques.1') ?? '',
        answer: t?.('wsm_airdrop.ans.1') ?? ''
      },
      {
        question: t?.('wsm_airdrop.ques.2') ?? '',
        answer: t?.('wsm_airdrop.ans.2') ?? ''
      },
      {
        question: t?.('wsm_airdrop.ques.3') ?? '',
        answer: t?.('wsm_airdrop.ans.3') ?? ''
      },
      {
        question: t?.('wsm_airdrop.ques.4') ?? '',
        answer: t?.('wsm_airdrop.ans.4') ?? ''
      },
    ];
    return (
      <FAQStyled textAlign={'center'} theme={theme} width={'75%'} margin={'auto'} display={'flex'} flexDirection={'column'} alignItems={'center'} gap={4}>
        <Text style={{ marginTop: 20 }} variant='h2'>FAQ</Text>
        <Text variant='h3'>{t?.('wsm_airdrop.common_ans')}</Text>
        {data.map((o, index) => (
          <FAQItem key={index} {...o} />
        ))}
      </FAQStyled>
    );
  }
}

export default withTranslation('homepage')(FAQ);

const FAQStyled = styled(Box) <{ theme: Theme }>`
  ${props => props.theme.breakpoints.down('lg')} {
    width: 95%;
  }
`;