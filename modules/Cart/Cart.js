import { addContainer } from "../addContainer";
import { API_URL } from "../../const";
import { ApiService } from "../../services/ApiService";
import { debounce } from "../../helpers";
import { router } from "../../main";
import { Header } from "../Header/Header";


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

            this.cartPlaceDelivery = document.createElement('p');                         // добавили свойство объекту Cart
            this.cartPlaceDelivery.classList.add('cart__place-delivery');
            this.cartPlaceDelivery.textContent = 'Доставка 500 Р';

            const cartPlaceBtn = document.createElement('button');
            cartPlaceBtn.classList.add('cart__place-btn');
            cartPlaceBtn.textContent = 'Оформить заказ';
            cartPlaceBtn.type = 'submit';
            cartPlaceBtn.setAttribute('form', 'order');  // устанавивает атрибут form='order'

            cartPlaceInfo.append(cartPlaceWrapper, this.cartPlaceDelivery, cartPlaceBtn);
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

            const nameInput = document.createElement('input');
            nameInput.classList.add('form-order__input');
            nameInput.name = 'name';
            nameInput.type = 'text';
            nameInput.required = true;
            nameInput.placeholder = 'Фамилия Имя Отчество';

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

      
            const textarea = document.createElement('textarea');
            textarea.classList.add('form-order__textarea');
            textarea.name = 'comments';
            textarea.placeholder = 'Комментарий к заказу';

            inputFieldset.append(nameInput, phone, email, address, textarea );

            const radioDeliveryFieldset = document.createElement('fieldset');
            radioDeliveryFieldset.classList.add('form-order__fieldset', 'form-order__fieldset--radio');

            const deliveryLegend = document.createElement('legend');
            deliveryLegend.classList.add('form-order__legend');
            deliveryLegend.textContent = 'Доставка';

            const deliveryLabel = document.createElement('label');
            deliveryLabel.classList.add('form-order__label', 'radio');
            const deliveryLabelText = document.createTextNode('Доставка');
            
            const deliveryInput  = document.createElement('input');
            deliveryInput.classList.add('radio__input');
            deliveryInput.type = 'radio';
            deliveryInput.name = 'deliveryType';
            deliveryInput.value = 'delivery';
            deliveryInput.required = true;
            deliveryInput.checked  = true;
            deliveryLabel.append(deliveryInput,  deliveryLabelText);

            const pickupLabel = document.createElement('label');
            pickupLabel.classList.add('form-order__label', 'radio');
            const pickupLabelText = document.createTextNode('Самовывоз');

            const pickupInput = document.createElement('input');
            pickupInput.classList.add('radio__input');
            pickupInput.type = 'radio';
            pickupInput.name = 'deliveryType';
            pickupInput.required = true;
            pickupInput.value = 'pickup';
            pickupLabel.append(pickupInput, pickupLabelText);
            
            
            radioDeliveryFieldset.append(deliveryLegend, deliveryLabel, pickupLabel); 

            radioDeliveryFieldset.addEventListener('change', (evt) => {
                  if(evt.target === deliveryInput){               // если выбрали способ доставки  Доствка
                        address.disabled = false;
                  }
                  else{
                        address.disabled = true;
                        address.value = '';  // очистка поля
                  }
            });


            const radioPaymentFieldset = document.createElement('fieldset');
            radioPaymentFieldset.classList.add('form-order__fieldset', 'form-order__fieldset--radio');

            const paymentLegend = document.createElement('legend');
            paymentLegend.classList.add('form-order__legend');
            paymentLegend.textContent = 'Оплата';

            const cardLabel = document.createElement('label');
            cardLabel.classList.add('form-order__label', 'radio');
            const cardLabelText = document.createTextNode('Картой при получении');

            const cardInput = document.createElement('input');
            cardInput.classList.add('radio__input');
            cardInput.type = 'radio';
            cardInput.name = 'paymentType';
            cardInput.required = true;
            cardInput.value = 'card';
            cardLabel.append(cardInput, cardLabelText);
            
      
            const cashLabel = document.createElement('label');
            cashLabel.classList.add('form-order__label', 'radio');
            const cashLabelText = document.createTextNode('Наличными при получении');

            const cashInput = document.createElement('input');
            cashInput.classList.add('radio__input');
            cashInput.type = 'radio';
            cashInput.name = 'paymentType';
            cashInput.required = true;
            cashInput.value = 'cash';
            cashLabel.append(cashInput, cashLabelText);

            radioPaymentFieldset.append(paymentLegend, cardLabel, cashLabel);

            form.append(title, inputFieldset, radioDeliveryFieldset, radioPaymentFieldset);
            
      
            
            form.addEventListener('submit', async(evt) => {      // вешаем обработчик на форму, async ттк идет отправка данных на сервер
                  evt.preventDefault();
                  const data = Object.fromEntries(new FormData(form));        // получаем данные  котрые вбиваем в форму
                  console.log('data form ', data)                             // здесь названия свойств это name у полей формы: { name: 'Алина',  phone: '7654323456',  email: 'tre@mail.ru',  address: 'Москва',  comments: 'текст',  delivetyType: 'delivery',  paymentType: 'pickup' }
                  
                  const { orderId } = await new ApiService().postOrder(data);   // отправка на сервер,  из объекта { orderId: 181,    message: 'Новый заказ успешно добавлен' } вытащили orderId
                  console.log('result ', result)                                    // { orderId: 181,    message: 'Новый заказ успешно добавлен' }

                  new Header().changeCount(0);                          // обнуляем число товаров у иконки Корзины
                  router.navigate(`/order/${orderId}`);                            // переходим на страницу /order/${orderId}
            });

            this.containerElement.append(form);
      }

}


