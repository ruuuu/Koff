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
// import { Pagination } from 'swiper/modules';
import { Pagination } from './features/Pagination/Pagination';




const productSlider = () => {

   Promise.all([   // принимает массив промисов
      import('swiper/modules'),  // вместо верхнего импорта, пишем его здесь
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

   // api.getProductCategories().then((data) => {
   //    new Catalog().mount(new Main().element, data);
   //    router.updatePageLinks();    
   // });
  

   
   

   productSlider(); 


  router
   .on("/", async() => {         // когда в корне, то вызовется переданная фукния. Тк getProducts() это всинхронная ф-ия , то коллюэк тоже асинхронный
      console.log('находимся на главной');
      new Catalog().mount(new Main().element);
      const products = await api.getProducts();                         // [{},{},{}]
      //console.log('products ', products)
      new ProductList().mount(new Main().element, products, '');
      
      // чтоы пагинация оторажалась:
      // const { data, pagination } = await api.getProducts({ category: slug,  page: page || 1 });   // в ответ на запрос придет { data: [{},{},{}],  pagination: {currentPage: 1, totalPages: 1, totalProducts: 1, limit: 12} }, берем только data
      // new ProductList().mount(new Main().element, data, slug);  
      // new Pagination().mount(new ProductList().containerElement);
      // new Pagination().update(pagination);
      
      
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
         new Catalog().unmount();               // убираем категории из разметки, тк при переход на Корзину/Заказа их не должно быть
         done();
      },
      already: (match)=>{
         match.route.handler(match);            // вызовется  коллбэк которая в /on
      }
   })  // метод on() третьим параметром передает хук, хук  вызывается в определенный момент времени
   .on("/category", async({ params: { slug, page } }) => {                        // деструктурировали obj, для урла http://localhost:5173/category?slug=Стулья

      console.log('находимся на станице категории') 
      new Catalog().mount(new Main().element);

      // getProducts() принимает {page = 1, limit = 12, list, category, q}   q- для поиска
       //                                                               если page нет, то передаем 1
      const { data, pagination } = await api.getProducts({ category: slug,  page: page || 1 });   // в ответ на запрос придет { data: [{},{},{}],  pagination: {currentPage: 1, totalPages: 1, totalProducts: 1, limit: 12} }, берем только data
      new ProductList().mount(new Main().element, data, slug);  
      new Pagination().mount(new ProductList().containerElement);
      new Pagination().update(pagination);
      // либо вызов методов через цепочку:
      // new Pagination()
      //    .mount(new ProductList().containerElement)
      //    .update(pagination)

      router.updatePageLinks();              // обновляет ссылки которые есть на странице
   },
   {
      leave: (done)=>{                       // когда уходим с страницы '/category', выполнится функция
         console.log('leave ')
         new ProductList().unmount(); 
         new Catalog().unmount(); 
         done();
      },
   })
   .on("/favorite", async() => {             //  при переходе на станицу  /favorite, вызовется колллбэк
      console.log('находимся на станице Избранное')
      new Catalog().mount(new Main().element);
      const favorite = new FavoriteService().get();         // коллекция  {15, 40, 32, 46, 49}
      const { data: product } = await api.getProducts({ list: favorite.join(',') });  // ответ от сервера  { data: [{}, {}, {}],   pagination: {currentPage: 1, totalPages: 1, totalProducts: 1, limit: 12(товаров на станицу)} }, нам нужно только data и переименовываемм его в product, поэтому пишем { data: product }  
      new ProductList().mount(new Main().element, product, 'Избранное', 'Вы ничего не добавили в Избранное');  
      
      // чтоы пагинация оторажалась:
      // const { data, pagination } = await api.getProducts({ category: slug,  page: page || 1 });   // в ответ на запрос придет { data: [{},{},{}],  pagination: {currentPage: 1, totalPages: 1, totalProducts: 1, limit: 12} }, берем только data
      // new ProductList().mount(new Main().element, data, slug);  
      // new Pagination().mount(new ProductList().containerElement);
      // new Pagination().update(pagination);
      
      
      router.updatePageLinks();    
   },
   {
      leave: (done)=>{                          // когда уходим со страницы вызовется фунция
         new Catalog().unmount(); 
         new ProductList().unmount();           // убираем из рамзетки спсиок товаров
         done();
      },
      already: (match)=>{
         match.route.handler(match); // вызовется  коллбэк которая в /favorite
      }
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
      console.log('находимся на станице Заказа')
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
         router.navigate('/');                  // переходим на главную '/'
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