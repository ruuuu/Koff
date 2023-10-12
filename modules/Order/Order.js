

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
                  return;
            }

           const orderInfo = document.createElement('div');
           orderInfo.classList.add('order__info');
           
           const orderWrapper = this.getWrapper();

           const orderPrice =  

           //<p class="order__article"> №43435</p>

            // const searchForm = this.getSearchForm();

            // const navigation = this.getNavigation();



            orderInfo.append(orderWrapper);

            elementMain.append(this.element);
           
            this.isMounted = true;    
      }


      unmounted(){
            this.element.remove();                              // убираем элемент из разметки
            this.isMounted = false;    
      }


      getWrapper(){
            const wrapper = document.createElement('div');
            wrapper.classList.add('order__wrapper');
            
            const h3 = document.createElement('h3');
            h3.classList.add('order__title');
            h3.textContent = 'Заказ успешно размещен';

            const p = document.createElement('h3');
            p.classList.add('order__price');
            p.textContent = '2&nbsp;000&nbsp;Р';

            wrapper.append(h3, p);

            return wrapper;
      }

}


