import styled from '@emotion/styled';
import { Box, Collapse, Divider } from '@mui/material';
import { Component, ReactNode } from 'react';
import { TFAQ } from '.';
import Text from '../../../../components/atom/Text';
import { COLOR_PRIMARY } from '../../../../assets/color';

type Props = TFAQ & {

}

type State = {
  expand: boolean
}


class FAQItem extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state ={expand: false};
  }

  render(): ReactNode {
  return (
    <FAQItemStyled sx={{
      width: '100%',
      opacity: this.state.expand ? 1 : .5,
      // marginBottom: '24px'
    }} onClick={() => this.setState({expand: !this.state.expand})}>
      <Box display={'flex'} justifyContent={'space-between'} className={'faq-question'} padding={2} alignItems={'center'}>
        <Text variant='h3' >{this.props.question}</Text>
        <Box sx={{
          transform: `rotate(${this.state.expand ? 180 : 0}deg)`,
        }}>
          <ArrowIcon/>
        </Box>
      </Box>
      <Collapse sx={{
      }} in={this.state.expand} timeout={'auto'} unmountOnExit>
        <Divider sx={{
          width: '95%',
          margin: '12px auto'
        }}/>
        <Text fontSize={'24px'} p={2}>{this.props.answer}</Text>
      </Collapse>
    </FAQItemStyled>
    );
  }
}

export default FAQItem;

const FAQItemStyled = styled(Box)`
    background: #ffffff;
    border: 3px solid ${COLOR_PRIMARY};
    border-radius: 24px;
    overflow: hidden;
    cursor: pointer;
`;

class ArrowIcon extends Component {
  render(): ReactNode {
    return(
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="12" viewBox="0 0 20 12" fill="none">
        <path d="M17.1088 11.4909C17.7613 12.1659 18.8413 12.1659 19.4938 11.5134C20.1687 10.8384 20.1687 9.7809 19.4938 9.1284L11.6863 1.2759C11.3713 0.9609 10.9438 0.7809 10.4938 0.7809C10.0438 0.7809 9.61627 0.960899 9.30127 1.2759L1.49378 9.1284C1.15628 9.4434 0.998779 9.8709 0.998779 10.2984C0.998779 10.7484 1.15628 11.1759 1.49378 11.5134C2.16878 12.1659 3.22628 12.1659 3.87877 11.4909L10.4938 4.8534L17.1088 11.4909Z" fill="black"/>
        <path d="M17.1088 11.4909C17.7613 12.1659 18.8413 12.1659 19.4938 11.5134C20.1687 10.8384 20.1687 9.7809 19.4938 9.1284L11.6863 1.2759C11.3713 0.9609 10.9438 0.7809 10.4938 0.7809C10.0438 0.7809 9.61627 0.960899 9.30127 1.2759L1.49378 9.1284C1.15628 9.4434 0.998779 9.8709 0.998779 10.2984C0.998779 10.7484 1.15628 11.1759 1.49378 11.5134C2.16878 12.1659 3.22628 12.1659 3.87877 11.4909L10.4938 4.8534L17.1088 11.4909Z" fill="black"/>
      </svg>
    );
  }
}