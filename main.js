import 'normalize.css'
import './style.scss'
// import Swiper from 'swiper';
// import { Navigation, Thumbs } from 'swiper/modules';
// import 'swiper/css';
import Navigo from 'navigo';
import { Header } from './modules/Header/Header';
import { Main } from './modules/Main/Main';
import { Footer } from './modules/Footer/Footer';
import { Order } from './modules/Order/Order';
import { ProductList } from './modules/ProductList/ProductList';



const productSlider = () => {

   Promise.all([   // принимает массив промисов
      import('swiper/modules'),  
      import('swiper'),
      import('swiper/css'),
   ]).then(([ { Navigation, Thumbs },  Swiper]) => {

      const swiperThumbnails = new Swiper.default('.product__slider-thumbnails',  // маленкий слайдер
      {
           spaceBetween: 10,
           slidesPerView: 4,
           freeMode: true,
           watchSlidesProgress: true
      });

      const swiper2 = new Swiper.default('.product__slider-main',  // большой слайдер
      {
           spaceBetween: 10,
           navigation: {
              nextEl: ".product__arrow--next",
              prevEl: ".product__arrow--prev"
           },
           modules: [Navigation, Thumbs],
           thumbs: {
              swiper: swiperThumbnails, // указываем маленький слайдер
           },
      });

   });

   
};





const init = () => {

   new Header().mount();
   new Main().mount();
   new Footer().mount();
  
   

   productSlider(); 


   // роутинг, используем Navigo:
   const router = new Navigo("/", { linksSelector: 'a[href^="/"]' });  // начало от корня '/', для ссылок котрые начинаются на "/""
  

  router
   .on("/", () => {         // когда в корне, то вызовется фукния
      console.log('находимся на главной')
      new ProductList().mount(new Main().element, [1,2, 3], '');
   }, 
   {
      // before: (done)=>{  //done-  функция,  ее надо вызывать обязательно
      //    console.log('before ')
      //    done();
      // },
      // after: ()=>{
      //    console.log('after ')
      // },
      leave: (done)=>{
         console.log('leave ')
         done();
      },
      already: ()=>{
         console.log('already ')
         
     }
   })  // метод on() третьим параметром передает хук, хук  вызывается в определенный момент времени
   .on("/category", (obj) => {        
      console.log('находимся на станице категории')
      console.log(obj)
   })
   .on("/favorite", () => {        
      console.log('находимся на станице Избранное')
      new ProductList().mount(new Main().element, [], 'Избранное');
   })
   .on("/search", () => {        
      console.log('находимся на станице Поиска')
   })
   .on("/product/:id", (obj) => {        
      console.log('находимся на станице Продукта')
      console.log(obj)
   })
   .on("/cart", (obj) => {        
      console.log('находимся на станице Корзина')
   })
   .on("/order", (obj) => {        
      console.log('находимся на станице Заказ')
      new Order().mount(new Main().element);  // помещаем Order в Main
      
   })
   .notFound(() => {
      document.body.innerHTML = '<h2> Ошибка 40 4</h2>';
   });

   
   router.resolve();             // запускаем роутинг

};


init();