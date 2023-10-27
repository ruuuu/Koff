
import { addContainer } from "../../modules/addContainer";
import { router } from "../../main";



// хлеб крошки:
export class BreadCrumbs {  

      static instance = null;

      constructor(){

            if(!BreadCrumbs.instance){
                  BreadCrumbs.instance = this; 
                  this.element = document.createElement('div');
                  this.element.classList.add('breadcrumb');
                  this.containerElement = addContainer(this.element, 'container'); 
                  this.isMounted = false;  // элемент еще не добавлен на страницу
            }
                
            
            return BreadCrumbs.instance; 
      }
          
      

      checkPrevData(data){                // [ {text: 'Поиск'}, {}, {} ]
            // console.log('data ', data);
            // console.log('this.prevData ', this.prevData)
            // console.log('this.prevData === data ', this.prevData === data)
            let isSame = false;
            if(!this.prevData){                        // [ {text: 'Поиск'}, {}, {} ]
                  this.prevData = data;
            }

      
            isSame = data.every((item, i) => {                            // mas.every() вернет true/false
                  return item.text === this.prevData[i].text;                 // если текущйи запрос на отрисовку крошек  одинаков с предыдущим, то вернем isSame = true
            });

            this.prevData = data;
            return isSame; 
      }



      mount(parent, data){                      // data = [ {text: 'Главная',  href: '/'}, {}, {}]
           
            // если текущйи запрос на отрисовку крошек  одинаков спредыдущим:
            if(this.isMounted && this.checkPrevData(data)){                   // data = [ {text: 'Поиск'} ]
                  return;                                   // перерисовки крошек не будет , выходим из метода
            }

            if(this.isMounted){
                  this.render(data);                        // отрисовка хлеб крошек
                  return;                                   // выходим из метода
            }

            this.render(data);                        // отрисовка хлеб крошек
            parent.append(this.element);                              
            this.isMounted = true;
            router.updatePageLinks();            // обновляет ссылки которые есть на странице(встроенный меод       
      }




      render(list){                       // list = [ {text: 'Главная',  href: '/'}, {'Избранное', href: '/favorite'}, {'товар',  href: '/product/{id}'} ]
            this.containerElement.textContent = '';   //      очищаем контенйер, тк его перерисовываем
            const listElem = document.createElement('ul');
            listElem.classList.add('breadcrumb__list');

            const breadCrumbsList = [ { text: 'Главная',  href: '/'}, ...list ];  // к спиcку добавили список list

            const listItems = breadCrumbsList.map((item) => {
                  const listItemElem = document.createElement('li');
                  listItemElem.classList.add('breadcrumb__item');

                  const link = document.createElement('a');
                  link.classList.add('breadcrumb__link');
                  link.textContent = item.text;
                  if(item.href){
                        link.href = item.href;
                  }

                  const separator = document.createElement('span');
                  separator.classList.add('breadcrumb__separator');
                  separator.innerHTML = '&gt;'
                 
                  listItemElem.append(link, separator );

                  return listItemElem;  // <li></li>
            });


            listElem.append(...listItems);

            this.containerElement.append(listElem);
      }




      unmount(){
            this.element.remove();                              // убираем элемент из разметки
            this.isMounted = false;
      }
      
      // <div class="breadcrumb">
      //   <div class="container">
      //     <ul class="breadcrumb__list">
      //       <li class="breadcrumb__item">
      //         <a class="breadcrumb__link" href="/">Главная</a>
      //         <span class="breadcrumb__separator">&gt;</span>
      //       </li>

      //       <li class="breadcrumb__item">
      //         <a class="breadcrumb__link" href="category?slug=Кресла">Кресла</a>
      //         <span class="breadcrumb__separator">&gt;</span>
      //       </li>

      //       <li class="breadcrumb__item">
      //         <a class="breadcrumb__link">Кресла с подлокотниками</a>
      //         <span class="breadcrumb__separator">&gt;</span>
      //       </li>
      //     </ul>
      //   </div>
      // </div>

     
}
