import { ApiService } from "../../services/ApiService";
import { Header } from "../../modules/Header/Header";



export class CartButton {  // кнопка "Добавить в корзину"

      constructor(className, text){
            this.text = text;
            this.className = className;
      }



      create(id){  // отрисовка кнопки
            const btn = document.createElement('button');
            btn.classList.add(this.className);
            btn.textContent = this.text;
            btn.dataset.id = id;          // устаанвлаиваем дата атрибут data-id

            btn.addEventListener('click', async() => {
                 const { totalCount } = await new ApiService().postProductToCart(id);  // postProductToCart -асинхронная,  сервер вернет объект  = { totalCount: 1, message: 'Товар добавлен в корзину' }, из него возьмем свойство  totalCount
                 new Header().changeCount(totalCount);
            });
            
            return btn;
      }


      //<button class="card__btn" data-id='${this.id}'> В корзину </button>

}
