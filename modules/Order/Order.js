

export class Order {

      static instance = null;

      constructor(){

            if(!Order.instance){
                  Order.instance = this; 

                  this.element = document.createElement('section');  // род элемент
                  this.element.classList.add('order');
                  this.isMounted = false;                                                         // элемент добавлен в разметку    
            }
           
            return Order.instance;
      }



      mount(elementMain, dataOrder){
            if(this.isMounted){
                  return;   // выход из метода
            }

            const orderInfo = document.createElement('div');
            orderInfo.classList.add('order__info');
           
            const orderWrapper = this.getWrapper(dataOrder);

            const orderPrice = document.createElement('p');
            orderPrice.classList.add('order__article');
            orderPrice.textContent = `№${dataOrder[0].id}`;

          
            const orderCharacteristics = this.getOrderCharacteristics(dataOrder);

            const button = document.createElement('button');
            button.classList.add('product__btn', 'order__btn');
            button.type = 'button';
            button.textContent = 'На главную';

            orderInfo.append(orderWrapper, orderPrice, orderCharacteristics, button);

            this.element.append(orderInfo)
            elementMain.append(this.element);
           
            this.isMounted = true;    
      }



      unmount(){
            this.element.remove();                              // убираем элемент из разметки
            this.isMounted = false;    
      }


      getWrapper(dataOrder){
            const wrapper = document.createElement('div');
            wrapper.classList.add('order__wrapper');
            
            const h3 = document.createElement('h3');
            h3.classList.add('order__title');
            h3.textContent = 'Заказ успешно размещен';

            const p = document.createElement('p');
            p.classList.add('order__price');
            p.innerHTML = `${dataOrder[0].totalPrice}&nbsp;P`; 

            wrapper.append(h3, p);

            return wrapper;
      }



      getOrderCharacteristics(dataOrder){
            const characteristics = document.createElement('div');
            characteristics.classList.add('order__characteristics');


            const h3 = document.createElement('h3');
            h3.classList.add('order__characteristics-title');
           
            const table = document.createElement('table');
            table.classList.add('order__characteristics-table', 'table');


            const tr1 = document.createElement('tr');
            tr1.classList.add('table__row');

            const tdField1 = document.createElement('td');
            tdField1.classList.add('table__field');
            tdField1.textContent = 'Получатель';

            const tdValue1 = document.createElement('td');
            tdValue1.classList.add('table__value');
            tdValue1.textContent = dataOrder[0].name;


            const tr2 = document.createElement('tr');
            tr2.classList.add('table__row');

            const tdField2 = document.createElement('td');
            tdField2.classList.add('table__field');
            tdField2.textContent = 'Телефон';

            const tdValue2 = document.createElement('td');
            tdValue2.classList.add('table__value');
            tdValue2.textContent = dataOrder[0].phone;


            const tr3 = document.createElement('tr');
            tr3.classList.add('table__row');

            const tdField3 = document.createElement('td');
            tdField3.classList.add('table__field');
            tdField3.textContent = 'Email';

            const tdValue3 = document.createElement('td');
            tdValue3.classList.add('table__value');
            tdValue3.textContent = dataOrder[0].email;


            const tr4 = document.createElement('tr');
            tr4.classList.add('table__row');

            const tdField4 = document.createElement('td');
            tdField4.classList.add('table__field');
            tdField4.textContent = 'Адрес доставки';

            const tdValue4 = document.createElement('td');
            tdValue4.classList.add('table__value');
            tdValue4.textContent = `${dataOrder[0].address ? dataOrder[0].address : ''}`;


            const tr5 = document.createElement('tr');
            tr5.classList.add('table__row');

            const tdField5 = document.createElement('td');
            tdField5.classList.add('table__field');
            tdField5.textContent = 'Способ оплаты';

            const tdValue5 = document.createElement('td');
            tdValue5.classList.add('table__value');
            tdValue5.textContent = `${dataOrder[0].paymentType === 'cash' ? 'Наличными': 'Картой'}`; 


            const tr6 = document.createElement('tr');
            tr6.classList.add('table__row');

            const tdField6 = document.createElement('td');
            tdField6.classList.add('table__field');
            tdField6.textContent = 'Способ получения';

            const tdValue6 = document.createElement('td');
            tdValue6.classList.add('table__value');
            tdValue6.textContent = `${dataOrder[0].deliveryType === 'pickup' ? 'Самовывоз': 'Доставка'}`;


            tr1.append(tdField1, tdValue1); 
            tr2.append(tdField2, tdValue2); 
            tr3.append(tdField3, tdValue3); 
            tr4.append(tdField4, tdValue4); 
            tr5.append(tdField5, tdValue5); 
            tr6.append(tdField6, tdValue6); 

            table.append(tr1, tr2, tr3, tr4, tr5, tr6); 
            characteristics.append(h3, table);

            return characteristics;
      }

}

