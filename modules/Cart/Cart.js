import { addContainer } from "../addContainer";





// Корзина:
export class Cart{

      static instance = null;   // класс Корзина станет SingleTone

      constructor(){

            if(!Cart.instance){                     // относится к  SingleTone
                  Cart.instance = this;             //  относится к  SingleTone

                  this.element = document.createElement('section');  // родит элемент
                  this.element.classList.add('cart');
                  this.containerElement = addContainer(this.element, 'cart__container');        // завели контенйер
                  this.isMounted = false;                                                         // элемент еще не добавлен в разметку    
            }
           
            return Cart.instance;                   // вернет объект с этими полями { element: <></>, containerElement: '<div></div>', isMounted: false }
      }



      
      async mount(parent, data, emptyText){                      // data= список категрий с сервера  ['','','']
            if(this.isMounted){      
                     return;              // выход из метода
            }
   
            console.log('data from cart ', data)                // { products:  [{…}, {…}], totalCount: 2, totalPrice: 294284}
               
            const title = document.createElement('h2');
            title.classList.add('cart__title');
            title.textContent  = 'Корзина';
            this.containerElement.append(title);
            

            this.cartData = data;                              // добавили поле объекту


            if(data.products && data.products.length){
                  this.renderProducts();
                  this.renderPlace();           // блок справа
                  this.renderForm();
            }
            else{
                  this.containerElement.insertAdjacentHTML('beforeend', `
                        <p class="cart__empty"> ${ emptyText || 'произошла ошибка' } </p>
                  `) 
            }
   
            parent.prepend(this.element);                               // preprend() вставляет элемент в начало родителя, append() вставляет элемент в конец родителя
            this.isMounted = true;    
      }
   
   

   
      unmount(){
               this.element.remove();                              // убираем элемент из разметки
               this.isMounted = false;    
      }
   


      renderProducts(){
            const listProducts = this.cartData.products;  // [{},{}]- товары корзины

            const listElem = document.createElement('ul');
            listElem.classList.add('cart__products');
   
            const listItems = listProducts.map((item) => {    //  {} - товар Корзины  

                  const listItemElem = document.createElement('li');
                  listItemElem.classList.add('cart__product');

                  //<img class="cart__img" src="img/cart.jpg" alt="Кресло с подлокотниками"></img>
                 
                  const h3 = document.createElement('h3');
                  h3.classList.add('cart__ttile-product');
                  h3.textContent = item.name;

                 
                  const price = document.createElement('p');
                  price.classList.add('cart__price');
                  price.textContent = `${item.price} Р`;


                  const article = document.createElement('p');
                  article.classList.add('cart__article');
                  article.textContent = `арт. ${item.article}`;


                  const cartProductControl = document.createElement('div');
                  cartProductControl.classList.add('cart__product-control');
                  
                  const buttonMinus = document.createElement('button');
                  buttonMinus.classList.add('cart__product-btn');
                  buttonMinus.textContent = '-';


                  const buttonCount = document.createElement('p');
                  buttonMinus.classList.add('cart__product-count"');
                  buttonMinus.textContent = item.quantity;;


                  const buttonPlus = document.createElement('button');
                  buttonPlus.classList.add('cart__product-btn');
                  buttonPlus.textContent = '+';

                  cartProductControl.append(buttonMinus,  buttonCount, buttonPlus);
                  listItemElem.append(h3,  price, article,  cartProductControl);
   
                  return listItemElem;  // li
            });
   
            listElem.append(...listItems);
         
            this.containerElement.append(listElem);

      }
   


      renderPlace(){

      }
   


      renderForm(){

      }

}


//  <section class="cart" hidden> 
// <div class="container cart__container">
// <h2 class="cart__title"> Корзина </h2>

// <ul class="cart__products">
//   <li class="cart__product">
//     <img class="cart__img" src="img/cart.jpg" alt="Кресло с подлокотниками">
//     <h3 class="cart__ttile-product"> Кресло с подлокотниками </h3>
//     <p class="cart__price"> 5&nbsp;000&nbsp;Р </p>
//     <p class="cart__article"> арт. 84348945757 </p>
//     <div class="cart__product-control">
//       <button class="cart__product-btn"> - </button>
//       <p class="cart__product-count"> 1 </p>
//       <button class="cart__product-btn"> + </button>
//     </div>
//   </li>
// </ul>

// <div class="cart__place">
//   <h3 class="cart__subtitle"> Оформление </h3>

//   <div class="cart__place-info">
//     <div class="cart__place-wrapper">
//       <p class="cart__place-count">4 товара на сумму:</p>
//       <p class="cart__place-count">20 000 Р</p>
//     </div>
//     <p class="cart__place-delivery">Доставка 0 Р</p>
//     <button class="cart__place-btn" type="submit" form="order"> Оформить заказ </button>   order это id  формы, он нужен чтобы сзявять зту кнопку с формой
//   </div>
// </div>
  
// <form class="cart__form form-order" id="form" action="#" method="POST">
//     <h3 class="cart__subtitle">Данные для доставки</h3>

//     <fieldset class="form-order__fieldset form-order__fieldset--input">  
//       <input class="form-order__input" type="text" name="name" placeholder="Фамилия Имя Отчество">
//       <input class="form-order__input" type="tel" name="phone" placeholder="Телефон">
//       <input class="form-order__input" type="email" name="email" placeholder="E-mail">
//       <input class="form-order__input" type="text" name="address" placeholder="Адрес доставки">
//       <textarea class="form-order__textarea" name="comments" placeholder="Комментарий к заказу"></textarea>
//     </fieldset>


//     <fieldset class="form-order__fieldset form-order__fieldset--radio">  
//       <legend class="form-order__legend"> Доставка </legend>

//       <label class="form-order__label radio">
//         <input class="radio__input" type="radio" name="deliveryType" value="delivery"> Доставка
//       </label>

//       <label class="form-order__label radio">
//         <input class="radio__input" type="radio" name="deliveryType" value="pickup"> Самовывоз
//       </label>
//     </fieldset>


//     <fieldset class="form-order__fieldset form-order__fieldset--radio">  
//       <legend class="form-order__legend"> Оплата </legend>

//       <label class="form-order__label radio">
//         <input class="radio__input" type="radio" name="paymentType" value="card"> Картой при получении
//       </label>

//       <label class="form-order__label radio">
//         <input class="radio__input" type="radio" name="paymentType" value="cash"> Наличными при получении
//       </label>
//     </fieldset>
// </form>
// </div>
// </section> -->