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
import { ProductCard } from './modules/ProductCard/ProductCard';
import { productSlider } from './features/ProductSlider/ProductSlider';
import { Cart } from './modules/Cart/Cart';




// роутинг(марштрутизация), используем Navigo:
export const router = new Navigo("/", { linksSelector: 'a[href^="/"]' });  // начало от корня '/', для ссылок котрые начинаются на "/".  С linksSelector перезагруки станицы не происходит
  



const init = () => {
   const api = new ApiService();
   console.log('api ', api)

   

   new Header().mount();
   new Main().mount();
   new Footer().mount();

  
  router
   .on("/", async() => {         // когда в корне, то вызовется переданная фукния. Тк getProducts() это всинхронная ф-ия , то коллюэк тоже асинхронный
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
         done();                                // эту фукнцию всегда вызываем
      },
      already: (match)=>{
         match.route.handler(match);            // это хук, вызовется  коллбэк которая в /on
      }
   })  // метод on() третьим параметром передает хук, хук  вызывается в определенный момент времени
   .on("/category", async({ params: { slug, page = 1 } }) => {                        // деструктурировали obj, params берет из урла http://localhost:5173/category?slug=Диваны&page=2
      console.log('находимся на станице /category'); 
      //console.log('params в /category ', params.slug, params.page); 
      new Catalog().mount(new Main().element);                                   // категори орисовываем
                                                          
      const { data: products, pagination } = await api.getProducts({ category: slug,  page: page});   // в ответ на запрос придет { data: [{},{},{}],  pagination: {currentPage: 1, totalPages: 1, totalProducts: 1, limit: 12} }, берем только data.  getProducts() принимает {page = 1, limit = 12, list, category, q}   q- для поиска
      
      new BreadCrumbs().mount(new Main().element, [ { text: slug } ]);
      new ProductList().mount(new Main().element, products, slug);
      
      if(pagination.totalProducts > pagination.limit){
         new Pagination().mount(new ProductList().containerElement);
         new Pagination().update(pagination);   
                              // пагинируем
         // либо вызов методов через цепочку:
         // new Pagination()
         //    .mount(new ProductList().containerElement)
         //    .update(pagination)

      }
      
      router.updatePageLinks();              // обновляет ссылки которые есть на странице (updatePageLinks() встроенный метод router)   
   },
   {
      leave: (done)=>{                       // когда уходим с страницы '/category', выполнится функция
         console.log('leave from /category')
         new BreadCrumbs().unmount(); 
         new ProductList().unmount(); 
         new Catalog().unmount(); 
         done();
      },
      already: (match)=>{
         match.route.handler(match);            // это хук, вызовется  коллбэк которая в /favorite
      }
   })             //         obj = { params }  obj= { data: {},  hashString: "",  params: {page: '2'}, queryString: "page=2"", route: {name: 'favorite', path: 'favorite', hooks: {…}, handler: ƒ},  url: "favorite"} }
   .on("/favorite", async({ params }) => {             //  при переходе на станицу  /favorite, вызовется колллбэк. Из obj нам нужен только params, поэтому пишем {params}, берется из урла /favorite?page=2
      //console.log('obj на Избранное ', obj)
      //console.log('находимся на станице Избранное')
      //console.log('params в Избранное ',  params)                      // params = {page: '2'} query параметры, данные из урла берет
      new Catalog().mount(new Main().element);
      const favorite = new FavoriteService().get();         // коллекция  {15, 40, 32, 46, 49} она хрнаит уникальные значения
      const { data: product, pagination } = await api.getProducts({ list: favorite.join(','),  page: params?.page || 1});  // ответ от сервера  { data: [{}, {}, {}],   pagination: {currentPage: 1, totalPages: 1, totalProducts: 1, limit: 12(товаров на станицу)} }, нам нужно только data и pagination, поле data переименовываемм  в product, поэтому пишем { data: product }  
      
      new BreadCrumbs().mount(new Main().element, [ { text: 'Избранное' } ]);
      new ProductList().mount(new Main().element, product, 'Избранное', 'Вы ничего не добавили в Избранное');
      
      if(pagination?.totalProducts > pagination?.limit){                   // если у  объекта pagination есть свойство totalProducts
         new Pagination().mount(new ProductList().containerElement);          // чтоы пагинация оторажалась
         new Pagination().update(pagination);
         router.updatePageLinks();  // обновляет ссылки(встроенный метод router)   
      }

   },
   {
      leave: (done) => {                          // когда уходим со страницы '/favorite' вызовется фунция
         console.log('leave from favorite')
         new BreadCrumbs().unmount(); 
         new ProductList().unmount();           // убираем из рамзетки спсиок товаров
         new Catalog().unmount();               // убираем из рамзетки каталог
         done();
      },
      already: (match) => {
         match.route.handler(match);            // это хук, вызовется  коллбэк которая в /favorite
      }
   })                   // obj  взяли только свойтсов params из объекта obj(те деструктириуем), а у params только свойсво q
   .on("/search", async({ params: { q } }) => {                 // obj = { url: 'search',  queryString: 'q=носки',  params: {q: 'носки'},  hashString: '',  route: {name: 'search',  path: 'search',  hooks: {…}, handler: ƒ},  data: null }           
      new Catalog().mount(new Main().element);
     
      const { data: product, pagination } = await api.getProducts({ q });        // ответ от сервера  { data: [{}, {}, {}],   pagination: {currentPage: 1, totalPages: 1, totalProducts: 1, limit: 12(товаров на станицу)} }, нам нужно только data и pagination, поле data переименовываемм  в product, поэтому пишем { data: product }  
      
      new BreadCrumbs().mount(new Main().element, [ { text: 'Поиск' } ]);
      new ProductList().mount(new Main().element, product, `Результат поиска: ${q}`, `Товаров не найдено по вашему запросу ${q}`);   
      
      if(pagination?.totalProducts > pagination?.limit){  
         new Pagination().mount(new ProductList().containerElement);                // чтоы пагинация оторажалась
         new Pagination().update(pagination);
         router.updatePageLinks();    
      }
   },
   {
      leave: (done) => {                          // когда уходим со страницы '/search' вызовется фунция
         console.log('leave from search')
         new BreadCrumbs().unmount(); 
         new ProductList().unmount();           // убираем из рамзетки спсиок товаров
         new Catalog().unmount();               // убираем из рамзетки каталог
         done();
      },
      already: (match) => {
         match.route.handler(match);            // это хук, вызовется  коллбэк которая в /favorite
      }
   })
   .on("/product/:id", async(obj) => {        
      //console.log('находимся на станице товара')
      //console.log('obj от страницы товара ', obj)               // obj= { data: {id: '3’},  hashString: "",  params: null, queryString: "", route: {name: 'product/:id', path: 'product/:id', hooks: {…}, handler: ƒ}},  url: "product/3"} }
      new Catalog().mount(new Main().element);
      const data = await api.getProductById(obj.data.id);          // data= {id, name, category, article, characterictics=[[],[],[]], ..} - товар
      console.log('data of product', data)
      new BreadCrumbs().mount(new Main().element, [ { text: data.category, href: `category?slug=${data.category}` },  { text: data.name } ]);
      new ProductCard().mount(new Main().element, data);    // отрисовываем картчоку товара
      productSlider();     // отрисовываем слайдер
   }, 
   {
      leave: (done) => {                          // когда уходим со страницы '/product/:id' вызовется фунция
         new Catalog().unmount();               // убираем из разметки каталог
         new BreadCrumbs().unmount(); 
         new ProductCard().unmount();
         done();
      }
   })
   .on("/cart", async(obj) => { 
      console.log('obj от страницы Корзина ', obj)              
      console.log('находимся на станице Корзина')
      const cartItems = await api.getCart();
      console.log('cartItems ',  cartItems);
      new Cart().mount(new Main().element,  cartItems, 'Корзина пуста');
   },
   {
      leave: (done) => {                          // когда уходим со страницы '/favorite' вызовется фунция
         console.log('leave from favorite')
         new Cart().unmount(); 
         done();
      },
   })  //              obj = {data: {id}}
   .on("/order/:id", ({data: { id }}) => {        
      console.log(`находимся на станице Заказа с номером ${id}`)
      
      api.getOrder(id).then((data) => {                  // data- это ответ от сервера и методом then()-асинронный его обрабатываем
         console.log(`инфа о товаре с ${id}`, data)      // [{ "id": 181, "accessKey": "1aq8qvqguw1fiz8qqy4lh9",  "name": "hyut", "address": null,  "phone": "987654356",  "email": "jhgf@mail.ru",  "deliveryType": "pickup",  "paymentType": "cash",  "products": [ { "quantity": 1, "productId": 49 }, { "quantity": 1,"productId": 32},  { "quantity": 1,  "productId": 36} ],  "totalPrice": "415357", "comments": "апавпва"} ] 
         new Order().mount(new Main().element, data);          // помещаем Order в Main
      });
   })
   .notFound(() => {
      //document.body.innerHTML = '<h2> Ошибка 40 4</h2>';
      new Main().element.innerHTML = `
         <h2> Страница не найдена </h2>
         <p> Через 5 с вы будете перенаправлены на <a href="/"> на главную </a> </p>
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