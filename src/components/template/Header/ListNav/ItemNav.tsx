import styled from '@emotion/styled';
import { Box, IconButton, Popover } from '@mui/material';
import { Component, ReactNode } from 'react';
import { TNavItem } from '.';
import Text from '../../../atom/Text';
import ArrowDownIcon from '../../../../assets/icon/ArrowDownIcon';
import { COLOR_BLUE } from '../../../../assets/color';

type Props = TNavItem & {
  icon?: React.ReactNode
}

type State = {
  anchorEl: HTMLButtonElement | null
  open: boolean
}

class ItemNav extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      anchorEl: null,
      open: false
    };
  }

  handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({anchorEl: event.currentTarget});
  };

  handleClose = () => {
    this.setState({anchorEl: null});
  };

  

  render(): ReactNode {
    return (
      <ItemNavStyled onClick={this.props.onclick}>
        {! this.props.icon ? <Text>{this.props.label}</Text> : this.props.icon}

        {(this.props.children ?? [])?.length > 0 && 
          <IconButton  onClick={this.handleClick}><ArrowDownIcon/></IconButton> }
       
        <PopoverStyled
          id={this.state.anchorEl ? 'item-nav' : ''}
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <Box className='popover-card' display={'flex'} gap={'12px'} padding={2} width={'200px'} flexDirection={'column'}>
            {this.props.children?.map((o, index) => (
              <Text fontSize={'16px'} fontWeight={'600'} key={index}>{o.label}</Text>
            ))}
          </Box>
        </PopoverStyled>
      </ItemNavStyled>
    );
  }
}

export default ItemNav;


const PopoverStyled = styled(Popover)`
  .popover-card {
    & > p:hover {
      cursor: pointer;
      color: ${COLOR_BLUE};
    }
  }

`;

const ItemNavStyled = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;

  .icon-flag {
    width: 23px;
    height: 23px;
    object-fit: cover;
    overflow: hidden;
    border-radius: 50%;
  }

`;