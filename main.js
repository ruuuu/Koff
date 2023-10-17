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
import { ApiService } from './services/ApiService';
import { Catalog } from './modules/Catalog/Catalog';
import { FavoriteService } from './services/StorageService';



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
   const api = new ApiService();
   console.log('api ', api)

   // роутинг(марштрутизация), используем Navigo:
   const router = new Navigo("/", { linksSelector: 'a[href^="/"]' });  // начало от корня '/', для ссылок котрые начинаются на "/".  С linksSelector перезагруки станицы не происходит
  

   new Header().mount();
   new Main().mount();
   new Footer().mount();

   api.getProductCategories().then((data) => {
      new Catalog().mount(new Main().element, data);
      router.updatePageLinks();    
   });
  
   

   productSlider(); 


  router
   .on("/", async() => {         // когда в корне, то вызовется переданная фукния. Тк getProducts() это всинхронная ф-ия , то коллюэк тоже асинхронный
      console.log('находимся на главной');
      const products = await api.getProducts();                         // [{},{},{}]
      //console.log('products ', products)
      new ProductList().mount(new Main().element, products, '');
      router.updatePageLinks();                                         // обновляет ссылки которые есть на странице
   }, 
   {
      // before: (done)=>{  //done-  функция,  ее надо вызывать обязательно
      //    console.log('before ')
      //    done();
      // },
      // after: ()=>{
      //    console.log('after ')
      // },
      leave: (done)=>{                          // когда уходим с '/' страницы, выполнится функция
         console.log('leave ')
         new ProductList().unmount();           // очищаем верстку товаров
         done();
      },
      already: ()=>{
         console.log('already ')
      }
   })  // метод on() третьим параметром передает хук, хук  вызывается в определенный момент времени
   .on("/category", async({ params: {slug} }) => {                        // деструктурировали obj 

      console.log('находимся на станице категории')
      const { data } = await api.getProducts({ category: slug });   // в ответ на запрос придет { data: [{},{},{}], pagination: {} }, берем только data
      new ProductList().mount(new Main().element, data, slug);  
      router.updatePageLinks();    
   },
   {
      leave: (done)=>{                       // когда уходим с '/category' страницы, выполнится функция
         console.log('leave ')
         new ProductList().unmount(); 
         done();
      },
   })
   .on("/favorite", async() => {             //  при переходе на станицу  /favorite, вызовется колллбэк
      console.log('находимся на станице Избранное')
      const favorite = new FavoriteService().get();
      const productsFavorite = await api.getProducts({ list: favorite }); 
      console.log('productsFavorite ', productsFavorite);
     
      new ProductList().mount(new Main().element, productsFavorite, 'Избранное', 'Вы ничего не добавили в Избранне');  
      router.updatePageLinks();    
   },
   {
      leave: (done)=>{
         new ProductList().unmount(); 
         done();
      },
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
      //document.body.innerHTML = '<h2> Ошибка 40 4</h2>';
      new Main().element.innerHTML = `
         <h2> Страница не найдена </h2>
         <p> Через 5 с вы будете пеернаправлены на <a href="/"> на главную </a> </p>
      `;

      setTimeout(() => {
         // new Main().element.innerHTML = '';
         router.navigate('/');                  // перкходим на гланую '/'
      }, 5000);
   },
   {
      leave: (done)=>{
         console.log('leave ')
         new Main().element.innerHTML = '';
         done();
      },
   });

   
   router.resolve();             // запускаем роутинг

};


init();