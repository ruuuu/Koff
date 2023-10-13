


export class LocalStorageService{


      constructor(){
            this.key = localStorage.getItem('key');
           
      }


      get(){
            localStorage.getItem('key');
      }


      set(){
            localStorage.setItem('key',  this.key);
      }


      delete(){
            localStorage.removeItem('key');
      }
     

     
    

}