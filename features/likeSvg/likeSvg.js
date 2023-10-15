

export const likeSvg = async () => {

      // 1-ый способ:
      //const likeURL = new URL('./like.svg', import.meta.url); // import.meta.url - путь до текущего каталога
      const response =  await fetch('/img/like.svg');
      const svg = await response.text();  
      return new DOMParser().parseFromString(svg, 'image/svg+xml').querySelector('svg');      // DOMParser указывает формат


      // 2-ой способ:
      // return (
      //       `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" >
      //             <path d="M8.41325 13.8733C8.18658 13.9533 7.81325 13.9533 7.58659 13.8733C5.65325 13.2133 1.33325 10.46 1.33325 5.79332C1.33325 3.73332 2.99325 2.06665 5.03992 2.06665C6.25325 2.06665 7.32658 2.65332 7.99992 3.55998C8.67325 2.65332 9.75325 2.06665 10.9599 2.06665C13.0066 2.06665 14.6666 3.73332 14.6666 5.79332C14.6666 10.46 10.3466 13.2133 8.41325 13.8733Z"  stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
      //        </svg>`
      //       )

}