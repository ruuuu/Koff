

export const productSlider = () => {

      Promise.all([   // принимает массив промисов
         import('swiper/modules'),  // вместо верхнего импорта, пишем его здесь
         import('swiper'),
         import('swiper/css'),
      ]).then(([ { Navigation, Thumbs },  Swiper]) => {
            try{  
                  const swiperThumbnails = new Swiper.default('.product__slider-thumbnails',  // маленкий слайдер
                  {
                       spaceBetween: 10,
                       slidesPerView: 4,
                       freeMode: true,
                       watchSlidesProgress: true
                  });
            
                  new Swiper.default('.product__slider-main',  // большой слайдер
                  {
                       spaceBetween: 10,
                       navigation: {
                          nextEl: ".product__arrow--next",
                          prevEl: ".product__arrow—-prev",
                       },
                       modules: [Navigation, Thumbs],
                       thumbs: {
                          swiper: swiperThumbnails, // указываем маленький слайдер
                       },
                  });     
            }catch(error){
                  console.log('error ', error);
            }
   
      });
};
   