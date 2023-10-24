

export class CartButton {  // кнопка "Добавить в корзину"

      constructor(className, text){
            this.text = text;
            this.className = className;
      }



      create(id){
            const btn = document.createElement('button');
            btn.classList.add(this.className);
            btn.textContent = this.text;
            btn.dataset.id = id;          // устаанвлаиваем дата атрибут data-id

            btn.addEventListener('click', () => {
                  console.log('кнопка в корзину')
            });
            
            return btn;
      }


      //<button class="card__btn" data-id='${this.id}'> В корзину </button>

}
