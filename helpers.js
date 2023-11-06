
export const debounce = (fn, ms) => {

   let lastCall = 0;                // fn знает если вызов последний или нет
   let lastCallTimer = 0;


   return (...args) => {        //вернет фкнцию котрая принимает сколько угодно аргументов

      const previousCall = lastCall; // то ест предыдущий выхов
      lastCall = Date.now();

      if(previousCall && lastCall - previousCall <= ms){
         clearTimeout(lastCallTimer);

      }

      lastCallTimer = setTimeout(() => fn(...args), ms)           // коллбэк вызовется через ms
   }



}