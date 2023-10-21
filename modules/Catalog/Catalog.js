import { addContainer } from "../addContainer";
import { ApiService } from "../../services/ApiService";




// список категорий:
export class Catalog {

      static instance = null;

      constructor(){

            if(!Catalog.instance){
                  Catalog.instance = this; 
                  this.element = document.createElement('nav');  // род элемент
                  this.element.classList.add('catalog'); 
                  this.containerElement = addContainer(this.element, 'catalog__container');        // завели контенйер
                  this.isMounted = false;                                                         // элемент еще не добавлен в разметку 
                  //console.log('catalog object before calling getData() ', Catalog.instance, this)  // { element: nav.catalog, containerElement: div.container.catalog__container, isMounted: false } 
            }
           
            return Catalog.instance;                                                               // вернет этот объект : { element: 'main',  isMounted: false,  containerElement: '' }
      }




      async getData(){

         this.catalogData = await new ApiService().getProductCategories();        //список категрий ["Тумбы", "Стулья", "Столы"...]
         //console.log('catalog object after calling getData() ', Catalog.instance, this)                     // { element: nav.catalog, containerElement: div.container.catalog__container, isMounted: false, catalogData: ['Диваны','Столы','Тумбы'] } 
      }




      async mount(parent){                      // data= список категрий с сервера  ['','','']
            if(this.isMounted){      
                  return;
            }

            if(!this.catalogData){
                 await this.getData();           // await тк запрос на сервер отправляется и дожидаемся ответа, тогда mount() станвоится async 
                 this.renderListElem(this.catalogData);                                  // отрисовка категорий
            }

            

            parent.prepend(this.element);                               // preprend() вставляет элемент в начало родителя, append() вставляет элемент в конец родителя
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


