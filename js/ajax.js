"use strict"
function XHR(url, method = 'GET', data = null) {
  const defaultUrlHeader = "https://autumnfish.cn/";
  let xhr = new XMLHttpRequest();
  if (method === 'GET') {

    xhr.open('GET', `${defaultUrlHeader}${url}?${data}`);
    xhr.send();
  } else {
    xhr.open('POST', `${defaultUrlHeader}${url}?timestamp=${Date.now()}`);
    // 添加时间戳，防止被缓存
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(`${data}`);
  }
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        // console.log(JSON.parse(this.responseText));
      }
      else {
        console.log(this.status);
      }
    }
  }
  return JSON.parse(this.responseText);
}
// 登录模块
const loginForm = document.querySelector('.login-form');
loginForm.addEventListener('submit',e=> {
  // console.log('adad');
  e.preventDefault();
  XHR('/login/cellphone', 'POST', `phone=${loginForm.querySelector('[name=phone]').value}&password=${loginForm.querySelector('[name=password]').value}`);
});
  //音乐相关类
// class AboutMusic {
//   constructor(name){
//     this.name = name;
//   }
// }
let newMVlist = XHR('/mv/exclusive/rcmd', 'GET');
console.log(newMVlist);
export {}