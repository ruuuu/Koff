import 'normalize.css'
import './style.scss'
import Swiper from 'swiper';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';

const swiperThumbnails = new Swiper('.product__slider-thumbnails',
      {
           spaceBetween: 10,
           slidesPerView: 4,
           freeMode: true,
           watchSlidesProgress: true

});


const swiper2 = new Swiper('.product__slider-main',
      {
           spaceBetween: 10,
           navigation: {
              nextEl: ".product__arrow--next",
              prevEl: ".product__arrow--prev"
           },
           modules: [Navigation, Thumbs],
           thumbs: {
              swiper: swiperThumbnails,
           }

});



