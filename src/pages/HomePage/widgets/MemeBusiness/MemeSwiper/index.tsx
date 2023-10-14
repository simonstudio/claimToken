import { Component, ReactNode } from 'react';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import MemeCard from './MemeCard';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import Text from '../../../../../components/atom/Text';
import { I18n } from '../../../../../i18';
import { withTranslation } from 'react-i18next';

class MemeSwiper extends Component<I18n> {


  imageData = [
    'https://wallstmemes.com/assets/images/memes/1.png',
    'https://wallstmemes.com/assets/images/memes/2.png',
    'https://wallstmemes.com/assets/images/memes/3.png',
    'https://wallstmemes.com/assets/images/memes/1.png',
    'https://wallstmemes.com/assets/images/memes/2.png',
    'https://wallstmemes.com/assets/images/memes/3.png',
    'https://wallstmemes.com/assets/images/memes/1.png',
    'https://wallstmemes.com/assets/images/memes/2.png',
    'https://wallstmemes.com/assets/images/memes/3.png',

  ];

  pagination = {
    clickable: true,
    // dynamicBullets: true,
    renderBullet: function (index: number, className: string) {
      return `<span class="${className} meme-swiper-paginate"></span>`;
    },
  };

  render(): ReactNode {

    const {t} = this.props;

    return(
      <MemeSwiperStyled>
        <Box  display={'flex'} justifyContent={'center'} flexDirection={'column'} alignItems={'center'}>
          <Box width={'67%'} textAlign={'center'}>
            <Text variant='h2' >{t?.('meme_buss.label_even')}</Text>
            <Text my={4} fontSize={'18px'}>{t?.('meme_buss.description_even')}</Text>
          </Box>
        </Box>
        <Swiper
          modules={[ Pagination ]}
          pagination={this.pagination}
          loop={true}
          slidesPerView={1.5}
          spaceBetween={10}
          centeredSlides={true}
          breakpoints= {{
            1500: {
              slidesPerView: 2.5,
              spaceBetween: 20,
            },
            1900: {
              slidesPerView: 3.5,
              spaceBetween: 20,
            },
          }}
          >
        
          {this.imageData.map((s, index) => {

            return <SwiperSlide key={index}>
              <MemeCard imgUrl={s}/>
            </SwiperSlide>;

          })}
      </Swiper>

      </MemeSwiperStyled>
    );
  }
}

export default withTranslation('homepage')(MemeSwiper);

const MemeSwiperStyled = styled(Box)`
  .swiper {
    height: 600px;
    .swiper-slide {
      cursor: pointer;

    }
  }
  .swiper-pagination {
    align-items: center;
    justify-content: center;
    display: flex;



    .meme-swiper-paginate {
      background: #D4D2D3;
      box-shadow: 0 1px 2px 0.2px #00000040;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      transition: .2s;
      opacity: 1;

      &:hover {
        background: #333333;
        width: 12px;
        height: 12px;
      }
    }
    .swiper-pagination-bullet-active {
      background: #333333;
      width: 12px;
      height: 12px;
    }
  }

`;