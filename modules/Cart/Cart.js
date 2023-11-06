import { addContainer } from "../addContainer";
import { API_URL } from "../../const";
import { ApiService } from "../../services/ApiService";
import { debounce } from "../../helpers";



// Корзина:
export class Cart{

      static instance = null;   // класс Корзина станет SingleTone

      constructor(){

            if(!Cart.instance){                     // относится к  SingleTone
                  Cart.instance = this;             //  относится к  SingleTone

                  this.element = document.createElement('section');  // родит элемент
                  this.element.classList.add('cart');
                  this.containerElement = addContainer(this.element, 'cart__container');        // завели контенйер
                  this.isMounted = false;                                                                                // элемент еще не добавлен в разметку    
                  this.debUpdateCart = debounce(this.updateCart.bind(this), 200);    // debounce нужн котгда жмем на кнопку "+"/"-" сразу несколько раз, чтобы вызовов updateCart() несколько не было, а только послдений и в это вызов передаем qanatity равный общему получееному  числу товара                                           
            }
           
            return Cart.instance;                   // вернет объект с этими полями { element: <></>, containerElement: '<div></div>', isMounted: false }
      }



      
      async mount(parent, data, emptyText){                      // data= { products:  [{…}, {…}], totalCount: 2, totalPrice: 294284}
            
            if(this.isMounted){      
                  return;                       // выход из метода
            }

           
            this.containerElement.textContent = '';          // очищаем сперва
   
            console.log('data from cart ', data)                // { products:  [{id, arcticle, name, price, characteristics}}, {…}], totalCount: 2, totalPrice: 294284}
               
            const title = document.createElement('h2');
            title.classList.add('cart__title');
            title.textContent  = 'Корзина';
            this.containerElement.append(title);
            

            this.cartData = data;                              // добавили поле объекту this
            document.querySelector('.header__count').textContent = `${this.cartData.products.length}`;

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
   


      updateCart(id, quantity){           // при нажатии на кнопку +/-  вызовется эта функция, id, quantity это поля товара, у которого нажали +/-
            
            if(quantity === 0){
                  new ApiService().deleteProductFromCart(id);                              // запрос DELETE        
                  this.cartData.products = this.cartData.products.filter(item => {   // перебираем товары Корзины, вернет новый маасив без элемента  у корого quantity=0
                        return item.id !== id;
                  });

            }
            else{
                  this.cartData.products.forEach(item => {              // перебираем товары Корзины 
                        if(item.id === id){
                              item.quantity = quantity;
                        }
                  });

                  new ApiService().changeQuantityProductToCart(id, quantity)  //  изменение общего числа товара с его  id
            }

           
            this.cartData.totalPrice = this.cartData.products.reduce((acc, item) => {           // считаем общую сумма товаров
                  return acc + item.price * item.quantity;
            }, 0);      // нач значение у acc=0


            this.cartPlaceCount.textContent = `${this.cartData.products.length} товаров на сумму`;
            this.cartPlacePrice.innerHTML = `${this.cartData.totalPrice.toLocaleString()}&nbsp;Р`;
      }
     



      renderProducts(){
            const listProducts = this.cartData.products;  // [{},{}]- товары корзины

            const listElem = document.createElement('ul');
            listElem.classList.add('cart__products');
   
            const listItems = listProducts.map((item) => {    //  {id: 30, productId: 30,  article: '16955395132', quantity: 1, name: 'Диван BURJUA', price: 168066, characteristics: [ ['Тип', ' Прямой диван’], ['Ширина, см', '150’], ['Глубина, см', '82’], ['Высота, см', '82’], ['Бренд', 'MAI HE MAI'] ]} - товар Корзины  

                  const listItemElem = document.createElement('li');
                  listItemElem.classList.add('cart__product');
                  
                  const image = document.createElement('img');
                  image.classList.add('cart__img');
                  image.src = `${API_URL}/${item.images[0]}`;
                  image.alt = item.name;
                 
                 
                  const h3 = document.createElement('h3');
                  h3.classList.add('cart__ttile-product');
                  h3.textContent = item.name;

                 
                  const price = document.createElement('p');
                  price.classList.add('cart__price');
                  price.innerHTML = `${(item.price * item.quantity).toLocaleString()}&nbsp;Р`; // toLocaleString() нужен чтобы формат у ц ны верный был


                  const article = document.createElement('p');
                  article.classList.add('cart__article');
                  article.textContent = `арт. ${item.article}`;


                  const cartProductControl = document.createElement('div');
                  cartProductControl.classList.add('cart__product-control');
                  
                  const buttonMinus = document.createElement('button');
                  buttonMinus.classList.add('cart__product-btn');
                  buttonMinus.textContent = '-';


                  const cartProductCount = document.createElement('p');
                  cartProductCount.classList.add('cart__product-count');
                  cartProductCount.textContent = item.quantity;;


                  const buttonPlus = document.createElement('button');
                  buttonPlus.classList.add('cart__product-btn');
                  buttonPlus.textContent = '+';

                 
                  cartProductControl.append(buttonMinus, cartProductCount, buttonPlus);

                  buttonMinus.addEventListener('click', async()=>{

                        if(item.quantity){
                              item.quantity--;
                              cartProductCount.textContent = item.quantity;

                              if(item.quantity === 0){
                                    listItemElem.remove();                                      // удаляем лемент li, встроенный метод
                                    this.debUpdateCart(item.id, item.quantity);                 // обновленные данные  корзины отправляем на сервер
                                    
                                    return;                                                     // выход из метода
                              }

                              price.innerHTML = `${(item.price * item.quantity).toLocaleString()}&nbsp;Р`; // 
                              this.debUpdateCart(item.id, item.quantity);                       // добавили объекту новое поле,  обновленные данные  корзины отправляем на сервер
                        } 
                  });



                  buttonPlus.addEventListener('click', async()=>{
                       
                        item.quantity++;
                        cartProductCount.textContent = item.quantity;
                        price.innerHTML = `${(item.price * item.quantity).toLocaleString()}&nbsp;Р`;
                        this.debUpdateCart(item.id, item.quantity)           // обновленные данные отправляем на сервер
                  });

                  listItemElem.append(image, h3, price, article,  cartProductControl);
   
                  return listItemElem;  // li
            });
   
            listElem.append(...listItems);
         
            this.containerElement.append(listElem);
      }
   


      renderPlace(){

            const count = this.cartData.products.length;  // число товаров в Корзине
            const totalPrice = this.cartData.totalPrice;

            const cartPlace  = document.createElement('div');
            cartPlace.classList.add('cart__place');
            
            const subTitle = document.createElement('h3');
            subTitle.classList.add('cart__subtitle');
            subTitle.textContent = 'Оформление';

            const cartPlaceInfo = document.createElement('div');
            cartPlaceInfo.classList.add('cart__place-info');
            
            const cartPlaceWrapper = document.createElement('div');
            cartPlaceWrapper.classList.add('cart__place-wrapper');

            this.cartPlaceCount = document.createElement('p');          // добавили поле  в объект
            this.cartPlaceCount.classList.add('cart__place-count');
            this.cartPlaceCount.textContent = `${count} товаров на сумму`;

            this.cartPlacePrice = document.createElement('p');          // добавили поле в объект
            this.cartPlacePrice.classList.add('cart__place-price');
            this.cartPlacePrice.innerHTML = `${totalPrice.toLocaleString()}&nbsp;Р`;
            
            cartPlaceWrapper.append(this.cartPlaceCount, this.cartPlacePrice);

            const cartPlaceDelivery = document.createElement('p');
            cartPlaceDelivery.classList.add('cart__place-delivery');
            cartPlaceDelivery.textContent = 'Доставка 0 Р';

            const cartPlaceBtn = document.createElement('button');
            cartPlaceBtn.classList.add('cart__place-btn');
            cartPlaceBtn.textContent = 'Оформить заказ';
            cartPlaceBtn.type = 'submit';
            cartPlaceBtn.setAttribute('form', 'order');  // устанавивает атрибут form='order'

            cartPlaceInfo.append(cartPlaceWrapper, cartPlaceDelivery, cartPlaceBtn);
            cartPlace.append(subTitle, cartPlaceInfo); 
            this.containerElement.append(cartPlace);
      }
   


      renderForm(){

            const form = document.createElement('form');
            form.classList.add('cart__form', 'form-order');
            form.id = 'order';
            form.method = 'POST';

            const title = document.createElement('h3');
            title.classList.add('cart__subtitle', 'cart__subtitle--form-order');
            title.textContent = 'Данные для доставки'

            const inputFieldset = document.createElement('fieldset');
            inputFieldset.classList.add('form-order__fieldset', 'form-order__fieldset--input');

            const name = document.createElement('input');
            name.classList('form-order__input');
            name.name = 'name';
            name.type = 'text';
            name.required = true;
            name.placeholder = 'Фамилия Имя Отчество';

            const phone = document.createElement('input');
            phone.classList.add('form-order__input');
            phone.name = 'phone';
            phone.type = 'tel';
            phone.required = true;
            phone.placeholder = 'Телефон';

            const email = document.createElement('input');
            email.classList.add('form-order__input');
            email.name = 'email';
            email.type = 'email';
            email.required = true;
            email.placeholder = 'E-mail';

            const address = document.createElement('input');
            address.classList.add('form-order__input');
            address.name = 'address';
            address.type = 'text';
            address.placeholder = 'Адрес доставки';


            inputFieldset.append(name, phone, email, address);

            const radioDeliveryFieldset = document.createElement('fieldset');
            radioDeliveryFieldset.classList.add('form-order__fieldset', 'form-order__fieldset--radio');

            const deliveryLegend = document.createElement('legend');
            deliveryLegend.classList.add('form-order__legend');
            deliveryLegend.textContent = 'Доставка';

            const deliveryLabel  = document.createElement('label');
            deliveryLabel.classList.add('form-order__label', 'radio');
            const deliveryLabelText =  document.createTextNode('Доставка');
            
            const deliveryInput  = document.createElement('input');
            deliveryInput.classList.add('radio__input');
            deliveryInput.type = 'radio';
            
            
            
            
            form.innerHTML = `
                

                 <fieldset class="form-order__fieldset form-order__fieldset--input">  
                  
                  
                  
                 
                   <textarea class="form-order__textarea" name="comments" placeholder="Комментарий к заказу"></textarea>
                 </fieldset>
            
            
                 <fieldset class="form-order__fieldset form-order__fieldset--radio">  
                   <legend class="form-order__legend"> Доставка </legend>
            
                   <label class="form-order__label radio">
                     <input class="radio__input" type="radio" name="deliveryType" value="delivery" required> Доставка
                   </label>
            
                   <label class="form-order__label radio">
                     <input class="radio__input" type="radio" name="deliveryType" value="pickup" required> Самовывоз
                   </label>
                 </fieldset>
            
            
                 <fieldset class="form-order__fieldset form-order__fieldset--radio">  
                   <legend class="form-order__legend"> Оплата </legend>
            
                   <label class="form-order__label radio">
                     <input class="radio__input" type="radio" name="paymentType" value="card" required> Картой при получении
                   </label>
            
                   <label class="form-order__label radio">
                     <input class="radio__input" type="radio" name="paymentType" value="cash" required> Наличными при получении
                   </label>
                 </fieldset>
            `;


            form.addEventListener('submit', (evt) => {      // вешаем обработчик на форму
                  evt.preventDefault();

            });

            this.containerElement.append(form);
      }

}


