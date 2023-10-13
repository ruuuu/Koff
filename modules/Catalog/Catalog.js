import { addContainer } from "../addContainer";


export class Catalog {

      static instance = null;

      constructor(){

            if(!Catalog.instance){
                  Catalog.instance = this; 
                  this.element = document.createElement('nav');  // род элемент
                  this.element.classList.add('catalog'); 
                  this.containerElement = addContainer(this.element, 'catalog__container');        // завели контенйер
                  this.isMounted = false;                                                         // элемент еще не добавлен в разметку 
            }
           
            return Catalog.instance;                                                               // вернет этот объект : { element: 'main', isMounted: false }
      }



      mount(parent, data){                      // data= список категрий с сервера 
            if(this.isMounted){     
                  return;
            }

            
            this.renderListElem(data);                                  // отрисовка категорий

            parent.prepend(this.element);                               // preprend() вставляет элемент в начало родителя
            this.isMounted = true;    
      }



      unmount(){
            this.element.remove();                              // убираем элемент из разметки
            this.isMounted = false;    
      }



      renderListElem(data){
            const listElem = document.createElement('ul');
            listElem.classList.add('catalog__list');

            const listItems = data.map((item) => {                            
                  const listItemElem = document.createElement('li');
                  listItemElem.classList.add('catalog__item');
                  const link = document.createElement('a');
                  link.classList.add('catalog__link');
                  link.href = `/category?slug=${item}`;
                  link.textContent = item;

                  listItemElem.append(link);

                  return listItemElem;
            });

            listElem.append(...listItems);
      
            this.containerElement.append(listElem);
      }



      

}


