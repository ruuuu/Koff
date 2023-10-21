import { addContainer } from "../addContainer";
import { API_URL } from "../../const";
import { Card } from "../../features/Card/Card";


// отрисовка списка товаров
export class  ProductList {

      static instance = null;

      constructor(){

            if(!ProductList.instance){
                  ProductList.instance = this; 

                  this.element = document.createElement('section');  // род элемент
                  this.element.classList.add('goods');
                  this.containerElement = addContainer(this.element, 'goods__container');
                  this.isMounted = false;                                                         // элемент добавлен в разметку    
                  
                  this.addEvents();
            }
           
            return ProductList.instance;
      }



      // emptyText - тектс когда data пустая
      mount(parent, data, title, emptyText){                                 // title-h2(Избранное)
           
            this.containerElement.textContent = '';               // очищаем контенер 

            const titleElem = document.createElement('h2');
            titleElem.textContent = title ? title : 'Список товаров';
            titleElem.className = title ? 'goods__title' : 'goods__title visually-hidden';

            this.containerElement.append(titleElem);
            console.log('data prodicts', data)
            
            if(data && data.length){
                  this.updateListElem(data);                            // отрисовка карточек товаров
            }
            else{
                  this.containerElement.insertAdjacentHTML('beforeend', `
                        <p class="goods__empty"> ${ emptyText || 'произошла ошибка' } </p>
                  `) 
            }
           
            if(this.isMounted){                                   // если уже элемент добавлен  в разметку
                  return;
            }

            parent.append(this.element);
            this.isMounted = true;    
      }



      unmount(){
            this.element.remove();                              // убираем элемент из разметки
            this.isMounted = false;    
      }



      updateListElem(data = []){  // массив товаров [{},{},{}], по умолчанию пустой
            console.log('data in updateListElem ', data)

            const listElem = document.createElement('ul');
            listElem.classList.add('goods__list');
            let dataProd = data;

            if(Array.isArray(data)){      
                  dataProd = data;
            }
            else{
                  dataProd = data.data; 
            }
            //                                    деструткрируем item
            const listItems = dataProd.map(({ id,  images: [ image ],  name: title,  price }) => {                            // map венет массив элементов [<li></li>, <li></li>]
                  const listItemElem = document.createElement('li');
                  listItemElem.append(new Card({ id, image, title, price }).create());
                  listItemElem.classList.add('goods__item');

                  return listItemElem;
            });

            // listElem.append(...[1, 2, 3, 4]);            // ...[1, 2, 3, 4] равна 1,2,3,4
            listElem.append(...listItems);
      
            this.containerElement.append(listElem);
      }



      addEvents(){

      }

}