import { addContainer } from "../addContainer";
//import logoImg from '/img/logo.svg';
import { Logo } from "../../features/Logo/Logo";
import { likeSvg } from "../../features/likeSvg/likeSvg";
import { router } from "../../main";


export class Header {

      static instance = null;   // класс Header станет SingleTone

      constructor(){

            if(!Header.instance){                     // относится к  SingleTone
                  Header.instance = this;             //  относится к  SingleTone

                  this.element = document.createElement('header');  // родит элемент
                  this.element.classList.add('header');
                  this.containerElement = addContainer(this.element, 'header__container');        // завели контенйер
                  this.isMounted = false;                                                         // элемент еще не добавлен в разметку    
            }
           
            return Header.instance;                   // вернет объект с этими полями { element: <header></header>, containerElement: '<div></div>', isMounted: false }
      }



      mount(){  // создание блока Header
            if(this.isMounted){
                  return;
            }

            const logo = new Logo('header').create();
            //getLogo('header');

            const searchForm = this.getSearchForm();

            const navigation = this.getNavigation();

            this.containerElement.append(logo, searchForm, navigation);

            document.body.append(this.element);
            this.isMounted = true;    
      }



      unmount(){
            this.element.remove();                              // убираем элемент из разметки
            this.isMounted = false;    
      }



      getSearchForm(){  // форма поиска

            const searchForm = document.createElement('form');
            searchForm.classList.add('header__search');
            searchForm.method = 'get';

            const input = document.createElement('input');
            input.classList.add('header__input');

            input.type = 'search';
            input.name = 'search';
            input.placeholder = 'Введите текст';

          

            const button = document.createElement('button');
            button.classList.add('header__btn');
            button.type = "submit";
            button.innerHTML = `
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.66683 13.9999C11.1646 13.9999 14.0002 11.1644 14.0002 7.66659C14.0002 4.16878 11.1646 1.33325 7.66683 1.33325C4.16903 1.33325 1.3335 4.16878 1.3335 7.66659C1.3335 11.1644 4.16903 13.9999 7.66683 13.9999Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14.6668 14.6666L13.3335 13.3333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>  
            `;


            searchForm.addEventListener('submit', (evt)=>{              // когда нажмем на лупу, форма отправится
                  evt.preventDefault();                                 // чтобы станца не перезагружаалсь после отправки формы
                  router.navigate(`/search?q=${input.value}`)           // переходим на /search?q=
                  
            })

            searchForm.append(input,  button);

            return searchForm;
      }


      getNavigation(){

            const navigation = document.createElement('nav');
            navigation.classList.add('header__control');

            const favoriteLink = document.createElement('a');
            favoriteLink.classList.add('header__link');
            favoriteLink.href = '/favorite';

            // 1 ый способ:
            const favoriteText = document.createElement('span');
            favoriteText.classList.add('header__link-text');
            favoriteLink.append(favoriteText);
            favoriteText.textContent = 'Избранное';

            likeSvg().then((svg) => {                 // ждем ответа(svg) от likeSvg() и затем его обрабатываем
                  favoriteLink.append(svg);
            });

            // 2-ой спсоб:
            // favoriteLink.innerHTML = `
            //       <span class="header__link-text">Избранное</span>
            //       <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            //             <path d="M8.41301 13.8733C8.18634 13.9533 7.81301 13.9533 7.58634 13.8733C5.65301 13.2133 1.33301 10.46 1.33301 5.79332C1.33301 3.73332 2.99301 2.06665 5.03967 2.06665C6.25301 2.06665 7.32634 2.65332 7.99967 3.55998C8.67301 2.65332 9.75301 2.06665 10.9597 2.06665C13.0063 2.06665 14.6663 3.73332 14.6663 5.79332C14.6663 10.46 10.3463 13.2133 8.41301 13.8733Z" stroke="#1C1C1C" stroke-linecap="round" stroke-linejoin="round"/>
            //       </svg>
            // `;


            const cartLink = document.createElement('a');
            cartLink.classList.add('header__link');
            cartLink.href = '/cart';
      
            const linkText = document.createElement('span');
            linkText.classList.add('header__link-text');
            linkText.textContent = 'Корзина';

            const countElement = document.createElement('span');
            countElement.classList.add('header__count');
            countElement.textContent = '0';

            cartLink.append(linkText, countElement);

          
            cartLink.insertAdjacentHTML('beforeend', `
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.87329 1.33325L3.45996 3.75325" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.127 1.33325L12.5403 3.75325" stroke="#1C1C1C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M1.33301 5.23324C1.33301 3.9999 1.99301 3.8999 2.81301 3.8999H13.1863C14.0063 3.8999 14.6663 3.9999 14.6663 5.23324C14.6663 6.66657 14.0063 6.56657 13.1863 6.56657H2.81301C1.99301 6.56657 1.33301 6.66657 1.33301 5.23324Z" stroke="#1C1C1C"/>
                        <path d="M6.50684 9.33325V11.6999" stroke="#1C1C1C" stroke-linecap="round"/>
                        <path d="M9.57324 9.33325V11.6999" stroke="#1C1C1C" stroke-linecap="round"/>
                        <path d="M2.33301 6.66675L3.27301 12.4267C3.48634 13.7201 3.99967 14.6667 5.90634 14.6667H9.92634C11.9997 14.6667 12.3063 13.7601 12.5463 12.5067L13.6663 6.66675" stroke="#1C1C1C" stroke-linecap="round"/>
                  </svg> 
            `);
            

            navigation.append(favoriteLink, cartLink);

            this.countElement = countElement;  // <span>

            return navigation;
      }



      changeCount(n){  // число товаров в корзине
            this.countElement.textContent = `${n}`;
      }


}


