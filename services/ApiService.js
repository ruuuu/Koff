import { API_URL } from "../const";
import axios from "axios";


export class ApiService{

      #apiUrl = API_URL;            // #  используем чтобы скртыть свойство apiUrl

      constructor(){
            this.accessKey = localStorage.getItem('accessKey');
            console.log('this.accessKey ', this.accessKey);
      }



     // получение токена:
      async getAccessKey(){
            try{
                  if(!this.accessKey){
                        const response = await axios.get(`${this.#apiUrl}api/users/accessKey`);   
                        //console.log('response ', response)
                        this.accessKey = response.data.accessKey;
                        localStorage.setItem('accessKey', this.accessKey);
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
                        localStorage.removeItem('accessKey');

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

}