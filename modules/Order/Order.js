

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


      mount(elementMain){
            if(this.isMounted){
                  return;   // выход из метода
            }

           const orderInfo = document.createElement('div');
           orderInfo.classList.add('order__info');
           
           const orderWrapper = this.getWrapper();

           const orderPrice = document.createElement('p');
           orderPrice.classList.add('order__article');
           orderPrice.textContent = '№43435';

          
           const orderCharacteristics = this.getOrderCharacteristics();

           
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


      getWrapper(){
            const wrapper = document.createElement('div');
            wrapper.classList.add('order__wrapper');
            
            const h3 = document.createElement('h3');
            h3.classList.add('order__title');
            h3.textContent = 'Заказ успешно размещен';

            const p = document.createElement('p');
            p.classList.add('order__price');
            p.innerHTML = `2&nbsp;000&nbsp;Р`;

            wrapper.append(h3, p);

            return wrapper;
      }



      getOrderCharacteristics(){
            const characteristics = document.createElement('div');
            characteristics .classList.add('order__characteristics');


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
            tdValue1.textContent = 'Иванов Петр Александрович';

      //       <tr class="table__row">
      //       <td class="table__field"> Телефон </td>
      //       <td class="table__value"> +7 (737) 346 23 00 </td>
      //     </tr>

            const tr2 = document.createElement('tr');
            tr2.classList.add('table__row');

            const tdField2 = document.createElement('td');
            tdField2.classList.add('table__field');
            tdField2.textContent = 'Телефон';

            const tdValue2 = document.createElement('td');
            tdValue2.classList.add('table__value');
            tdValue2.textContent = '+7 (737) 346 23 00';


            tr1.append(tdField1, tdValue1); 
            tr2.append(tdField2, tdValue2); 
            table.append(tr1, tr2); 
            characteristics.append(h3, table);

            return characteristics;
      }

}

