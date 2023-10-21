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
import { BreadCrumbs } from './features/BreadCrumbs/BreadCrumbs';




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



// роутинг(марштрутизация), используем Navigo:
export const router = new Navigo("/", { linksSelector: 'a[href^="/"]' });  // начало от корня '/', для ссылок котрые начинаются на "/".  С linksSelector перезагруки станицы не происходит
  



const init = () => {
   const api = new ApiService();
   //console.log('api ', api)

   

   new Header().mount();
   new Main().mount();
   new Footer().mount();

   // api.getProductCategories().then((data) => {
   //    new Catalog().mount(new Main().element, data);
   //    router.updatePageLinks();    
   // });
  

   
   

   productSlider(); 


  router
   .on("/", async( ) => {         // когда в корне, то вызовется переданная фукния. Тк getProducts() это всинхронная ф-ия , то коллюэк тоже асинхронный
      console.log('находимся на главной');
      new Catalog().mount(new Main().element);
      const products = await api.getProducts();
     
      new ProductList().mount(new Main().element, products, '');
      
      // чтоы пагинация отображалась:
      // const { data, pagination } = await api.getProducts({ page: page || 1 });   // в ответ на запрос придет { data: [{},{},{}],  pagination: {currentPage: 1, totalPages: 1, totalProducts: 1, limit: 12} }, берем только data
      // new ProductList().mount(new Main().element, data);  
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
      leave: (done)=>{                          // это хук, когда уходим с '/' страницы, выполнится функция
         console.log('leave from main /')
         new ProductList().unmount();           // очищаем верстку товаров
         new Catalog().unmount();               // убираем категории из разметки, тк при переход на Корзину/Заказа их не должно быть
         done();
      },
      already: (match)=>{
         match.route.handler(match);            // это хук, вызовется  коллбэк которая в /on
      }
   })  // метод on() третьим параметром передает хук, хук  вызывается в определенный момент времени
   .on("/category", async({ params: { slug, page = 1 } }) => {                        // деструктурировали obj, params берет из урла http://localhost:5173/category?slug=Стулья
      console.log('находимся на станице /category'); 
      //console.log('params в /category ', params.slug, params.page); 
      new Catalog().mount(new Main().element);                                   // категори орисовываем
      new BreadCrumbs().mount(new Main().element, [ {text: slug} ]);
      
                                                                     
      const { data, pagination } = await api.getProducts({ category: slug,  page: page});   // в ответ на запрос придет { data: [{},{},{}],  pagination: {currentPage: 1, totalPages: 1, totalProducts: 1, limit: 12} }, берем только data.  getProducts() принимает {page = 1, limit = 12, list, category, q}   q- для поиска
      
      
      new ProductList().mount(new Main().element, data, slug);  
      new Pagination().mount(new ProductList().containerElement);
      new Pagination().update(pagination);                        //пагинируем
      // либо вызов методов через цепочку:
      // new Pagination()
      //    .mount(new ProductList().containerElement)
      //    .update(pagination)

      router.updatePageLinks();              // обновляет ссылки которые есть на странице^ (встроенный метод router)   
   },
   {
      leave: (done)=>{                       // когда уходим с страницы '/category', выполнится функция
         console.log('leave from /category')
         new ProductList().unmount(); 
         new Catalog().unmount(); 
         new BreadCrumbs().unmount(); 
         done();
      },
   })
   .on("/favorite", async({ params }) => {             //  при переходе на станицу  /favorite, вызовется колллбэк. params берет из урла /favorite?page=2
      console.log('находимся на станице Избранное')
      //console.log(' params в Избранное ',  params)                      // {page: '2'} данные из урла берет
      new Catalog().mount(new Main().element);
      const favorite = new FavoriteService().get();         // коллекция  {15, 40, 32, 46, 49}
      const { data: product, pagination } = await api.getProducts({ list: favorite.join(','),  page: params?.page || 1});  // ответ от сервера  { data: [{}, {}, {}],   pagination: {currentPage: 1, totalPages: 1, totalProducts: 1, limit: 12(товаров на станицу)} }, нам нужно только data и pagination,  data переименовываемм его в product, поэтому пишем { data: product }  
      
      new BreadCrumbs().mount(new Main().element, [ {text: 'Избранное'} ]);
      new ProductList().mount(new Main().element, product, 'Избранное', 'Вы ничего не добавили в Избранное');   
      new Pagination().mount(new ProductList().containerElement);          // чтоы пагинация оторажалась:
      new Pagination().update(pagination);
      router.updatePageLinks();  // обновляет ссылки(встроенный метод router)   
   },
   {
      leave: (done)=>{                          // когда уходим со страницы '/favorite' вызовется фунция
         console.log('leave from favorite')
         new BreadCrumbs().unmount(); 
         new ProductList().unmount();           // убираем из рамзетки спсиок товаров
         new Catalog().unmount();               // убираем из рамзетки каталог
         done();
      },
      already: (match)=>{
         match.route.handler(match);            // вызовется  коллбэк которая в /favorite
      }
   })
   .on("/search", () => {        
      console.log('находимся на станице Поиска')
   })
   .on("/product/:id", async(obj) => {        
      console.log('находимся на станице товара')
      new Catalog().mount(new Main().element);
      const data = await api.getProductById(obj.data.id);          // data={articke, categoty, characteristics, id, image, name, price}-товар
      console.log('data of product', data)
      new BreadCrumbs().mount(new Main().element, [ {text: data.category, href: `category?slug=${data.category}`},  {text: data.title, href: `product/${data.id}`} ]);
      //new ProductCard().mount(new Main().element, data);  

   }, 
   {
      leave: (done)=>{                          // когда уходим со страницы '/product/:id' вызовется фунция

         new Catalog().unmount();               // убираем из рамзетки каталог
         done();
      }
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
         new Main().element.innerHTML = '';  // очищаем станичку
         done();
      },
   });

   
   router.resolve();             // запускаем роутинг

};


init();