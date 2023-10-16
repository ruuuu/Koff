import { API_URL } from "../const";
import axios from "axios";
import { AccessKeyService } from "./StorageService";


export class ApiService{

      #apiUrl = API_URL;            // #  используем чтобы скртыть свойство apiUrl

      constructor(){
            this.accessKeyService = new AccessKeyService('accessKey');                    // { this.key: 'accessKey' }
            this.accessKey = this.accessKeyService.get();                                 
            //console.log('this.accessKey ', this.accessKey);
      }



     // получение токена:
      async getAccessKey(){
            try{
                  if(!this.accessKey){
                        // отправк азапрос ана получение ключа доступа:
                        const response = await axios.get(`${this.#apiUrl}api/users/accessKey`);   
                        //console.log('response ', response)
                        this.accessKey = response.data.accessKey;
                        //localStorage.setItem('accessKey', this.accessKey);
                        this.accessKeyService.set(this.accessKey);   // запсиываем в localStorage
                  }
            }
            catch(error){
                  console.log(error);
            } 
      }



      // метод асинхронный  async, тк идет обращение к серверу:
      async getData(pathname, params = {}) {

            if(!this.accessKey){
                await this.getAccessKey();
            }

            try{
                  // Вместо привычноог fetch запрос отправяем с помощью axios:
                  const response  = await axios.get(`${this.#apiUrl}${pathname}`,  {                    
                        headers: {
                              Authorization: `Bearer ${this.accessKey}`
                        },
                        params,
                  })       

                  return response.data;
            }
            catch(error){
                  if(error.response && error.response.data === 401){
                        this.accessKey = null;
                        //localStorage.removeItem('accessKey');
                        this.accessKeyService.delete();                                   // удаляем из  localStorage

                        return this.getData(pathname, params);                          // если токен неверный, то еще раз вызываем getData()
                  }
                  else{
                        console.log('ошибка');
                  }
            }
      }



      async getProducts(page = 1, limit = 12, list, category, q){                // q- для поиска

           const data = await this.getData('api/products',  { page, limit, list, category, q});    // await тк this.getData это асинхронная             
           return data;          // [{},{},{}]
      }



      async getProductCategories(){               

            const data = await this.getData('api/productCategories');        
            return data;          // список категрий ["Тумбы", "Стулья", "Столы", "Пуфы и банкетки", "Кровати", "Диваны", "Полки", "Стеллажи"]
      }



      async getProductCategory(id){               

            const data = await this.getData(`api/products/${id}`);        
            return data;          // [{},{},{}]
      }
      

}