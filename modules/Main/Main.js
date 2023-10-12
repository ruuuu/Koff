

export class Main {

      static instance = null;

      constructor(){

            if(!Main.instance){
                  Main.instance = this; 

                  this.element = document.createElement('main');  // род элемент
                  this.isMounted = false;                                                         // элемент добавлен в разметку    
            }
           
            return Main.instance;
      }


      mount(){
            if(this.isMounted){
                  return;
            }

            
            document.body.append(this.element);
            this.isMounted = true;    
      }


      unmounted(){
            this.element.remove();                              // убираем элемент из разметки
            this.isMounted = false;    
      }


}


