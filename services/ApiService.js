import { API_URL } from "../const";
import axios from "axios";
import { AccessKeyService } from "./StorageService";



export class ApiService {

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
                        this.accessKeyService.set(this.accessKey);   // записываем в localStorage
                  }
            }
            catch(error){
                  console.log(error);
            } 
      }



      // метод асинхронный  async, тк идет обращение к серверу:
      async getData(pathname, params = {}) {  // params пумолчанию пустой объект(если не передали)

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




      // метод принимает объект(json) params = {page = 1, limit = 12, list, category, q}   q- для поиска
      async getProducts(params = {}){                                               //  по умолчанию пердаем пустой объект         
            
            // if(params.list){
            //       params.list = params.list.join(",");                         // получим строку  15,40,32,46,49,22,10,35,7
                          
            // }
           const data = await this.getData('/api/products?',  params);         // await тк this.getData это асинхронная             
           console.log('data in getProducts ', data)
           return data;                                                       // { data: [{},{},{}],  pagination : {currentPage: 1, totalPages: 1, totalProducts: 1, limit: 12} }
      }



      async getProductCategories(){               

            const data = await this.getData('/api/productCategories');        
            return data;          // список категрий ["Тумбы", "Стулья", "Столы", "Пуфы и банкетки", "Кровати", "Диваны", "Полки", "Стеллажи"]
      }



      async getProductById(id){               

            const data = await this.getData(`api/products/${id}`);        
            return data;          // [{},{},{}]
      }



     // отправка товара в в Корзину:
      async postProductToCart (productId, quantity = 1){   

            if(!this.accessKey){
                  await this.getAccessKey();  // запрос на сервер
            }

            try{
                  const response  = await axios.post(`${this.#apiUrl}/api/cart/products`,       // запрос на сервер                
                        {
                              productId,
                              quantity
                        },
                        {
                              headers: {
                                    Authorization: `Bearer ${this.accessKey}`
                              },
                        }  
                  );

                  console.log('response.data ', response.data)    // { totalCount: 1, message: 'Товар добавлен в корзину' }

                  return response.data;   
            }       
            catch(err){
                  if (err.response && err.response.status === 401){
                        this.accessKey = null;
                        this.accessKeyService.delete();
                  }

                  console.error(err)
            }    
      }



      // получние товаров из Корзины:
      async getCart(){ 

            const data = await this.getData(`/api/cart`);        
            return data;  // [{},{},{}]
      }



      // изменение общего числа товара с его id в Корзине:
      async changeQuantityProductToCart(productId, quantity){   

            if(!this.accessKey){
                  await this.getAccessKey();  // запрос на сервер
            }

            try{
                  const response  = await axios.put(`${this.#apiUrl}/api/cart/products`,       // PUT запрос на сервер                
                        {
                              productId,
                              quantity
                        },
                        {
                              headers: {
                                    Authorization: `Bearer ${this.accessKey}`
                              },
                        }  
                  );

                  console.log('response.data ', response.data)    // { totalCount: 1, message: 'Товар добавлен в корзину' }

                  return response.data;   
            }       
            catch(err){
                  if (err.response && err.response.status === 401){
                        this.accessKey = null;
                        this.accessKeyService.delete();
                  }

                  console.error(err)
            }    
      }




      // удаление товара из корзины по его id:
      async deleteProductFromCart(id){   

            if(!this.accessKey){
                  await this.getAccessKey();  // запрос на сервер
            }

            try{
                  const response  = await axios.delete(`${this.#apiUrl}/api/cart/products/${id}`,       // запрос на сервер, поэтому фунция асинхронная(async)                
                        {
                              headers: {
                                    Authorization: `Bearer ${this.accessKey}`
                              },
                        }  
                  );

                  console.log('response.data ', response.data)    // { totalCount: 1, message: 'Товар добавлен в корзину' }

                  return response.data;   
            }       
            catch(err){
                  if (err.response && err.response.status === 401){
                        this.accessKey = null;
                        this.accessKeyService.delete();
                  }

                  console.error(err)
            }            
      }
      

}