import { addContainer } from "../addContainer";



export class Order {

      static instance = null;

      constructor(){

            if(!Order.instance){
                  Order.instance = this; 
                  this.element = document.createElement('section');  // род элемент
                  this.containerElement = addContainer(this.element, 'order__container');
                  this.element.classList.add('order');
                  this.isMounted = false;                                                         // элемент пока не добавлен в разметку    
                  
                  this.deliveryTypeList  = {
                        "delivery": "Доставка",
                        "pickup": "Самовывоз"
                  };

                  this.paymentTypeList  = {
                        "card": "Картой при получении",
                        "cash": "Наличными при получении"
                  };
                  
            }
           
            return Order.instance;
      }



      mount(parent, dataOrder){  // parent-блок  Main

            this.render(dataOrder);

            if(this.isMounted){
                  return;   // выход из метода
            }

            parent.append(this.element);
            this.isMounted = true;    
      }



      unmount(){
            this.element.remove();                              // убираем элемент из разметки
            this.isMounted = false;    
      }



      render(dataOrder){                  // dataOrder = [{ "id": 181, "accessKey": "1aq8qvqguw1fiz8qqy4lh9",  "name": "hyut", "address": null,  "phone": "987654356",  "email": "jhgf@mail.ru",  "deliveryType": "pickup",  "paymentType": "cash",  "products": [ { "quantity": 1, "productId": 49 }, { "quantity": 1,"productId": 32},  { "quantity": 1,  "productId": 36} ],  "totalPrice": "415357", "comments": "апавпва"} ] 
          const totalPrice = parseInt(dataOrder.totalPrice) + (dataOrder.deliveryType === "delivery" ? 500 : 0);
      
          this.containerElement.innerHTML = `
            <div class="order__info">
              <div class="order__wrapper">
                <h2 class="order__title"> Заказ успешно размещен </h2>
                <p class="order__price"> ${totalPrice.toLocaleString()} ₽ </p>
              </div>
      
              <p class="order__article"> №${dataOrder.id} </p>
      
              <div class="order__characteristics">
                <h3 class="order__characteristics-title"> Данные доставки </h3>
                <table class="order__characteristics-table table">
                  <tr class="table__row">
                    <td class="table__field"> Получатель </td>
                    <td class="table__value"> ${dataOrder.name} </td>
                  </tr>

                  <tr class="table__row">
                    <td class="table__field"> Телефон </td>
                    <td class="table__value"> ${dataOrder.phone} </td>
                  </tr>

                  <tr class="table__row">
                    <td class="table__field"> E-mail </td>
                    <td class="table__value"> ${dataOrder.email} </td>
                  </tr>

                  ${dataOrder.address ?
                      `<tr class="table__row">
                          <td class="table__field"> Адрес доставки </td>
                          <td class="table__value"> ${dataOrder.address} </td>
                        </tr>`
                      : "" }

                  <tr class="table__row">
                    <td class="table__field"> Способ оплаты </td>
                    <td class="table__value"> ${this.paymentTypeList[dataOrder.paymentType]} </td>
                  </tr>

                  <tr class="table__row">
                    <td class="table__field"> Способ получения </td>
                    <td class="table__value"> ${this.deliveryTypeList[dataOrder.deliveryType]} </td>
                  </tr>
                </table>
              </div>
      
              <a class="product__btn order__btn" href="/"> На главную </a>
            </div>
          `;
      }
  
}

