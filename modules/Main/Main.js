

export class Main {

      static instance = null;

      constructor(){

            if(!Main.instance){
                  Main.instance = this; 
                  this.element = document.createElement('main');  // род элемент
                  this.isMounted = false;                                                         // элемент добавлен в разметку    
            }
           
            return Main.instance;                                                               // вернет этот объект : { element: 'main', isMounted: false }
      }


      mount(){
            if(this.isMounted){     // если уже еэлемент добавлен  в разметку
                  return;
            }

            
            document.body.append(this.element);
            this.isMounted = true;    
      }


      unmount(){
            this.element.remove();                              // убираем элемент из разметки
            this.isMounted = false;    
      }


}


