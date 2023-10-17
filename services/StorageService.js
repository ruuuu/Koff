
export class StorageService{

      constructor(key){
            this.key = key;    
      }


      get(){
          const value = localStorage.getItem(this.key);
          if(value){
            return value;
          }

          return null;
      }



      set(data){
            if(typeof(data) === 'object'){
                  data = JSON.stringify(data);              // приводим в json формат
            }
            localStorage.setItem(this.key, data);
      }



      delete(){
            localStorage.removeItem(this.key);
      }
     
}




// наследование классов: класс FavoriteService наследуется от класса StorageService, наследуемый класс получает все свойства и методы класса-родителя
export class FavoriteService extends StorageService{

      static instance;                                      // класс FavoriteService станет SingleTone
      
      constructor(key = 'favorite'){
            if(!FavoriteService.instance){                        //  если объекта еще нет
                  super(key);                                     // вызов класса-родителя
                  this.favorite = new Set(this.get());             // коллекция(имеет никальные значения)  {15, 40, 32, 46, 49}, вызов метода родителя, получили данные из localstorage. 
                  console.log('this.favorite ', this.favorite)
                  FavoriteService.instance = this;
            }

            return FavoriteService.instance;                      // { this.key: 'favorite',  this.favorite: {} }
      }



      get(){
            const data = super.get();

            if(data){
                  const favorite = JSON.parse(data);               // из JSON получаем массив объектов(товаров) [{}, {}, {}]
                  if(Array.isArray(favorite)){                   // если favorite это массив
                        return favorite;                          // favorite запишется в this.favorite
                  }
            }

            return [];                    
      }



      add(value){
            this.favorite.add(value);     // у коллекции  add() добавляеет value в коллекцию
            this.set([...this.favorite]);
      }



      remove(value){  // удаляем value из коллекции
            if(this.check(value)){                        
                  this.favorite.delete(value);                     // у коллекции  delete() удаляет value из коллекции
                  this.set([...this.favorite]);
                  return true;
            }   
            return false;
      }



      check(value){
           return this.favorite.has(value);           // если value  есть в коллекции
      }

}



export class AccessKeyService extends StorageService{

      static instance;  // класс  AccessKeyService станет SingleTone
      
      constructor(key = 'accessKey'){
            if(!AccessKeyService.instance){
                  super(key);

                  AccessKeyService.instance = this;
            }

            return AccessKeyService.instance;                // { this.key = 'accessKey' } 
      }

}