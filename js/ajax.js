"use strict";
import { handleTime, loginAppear,loginHiden,loginBtn,loginmask,loginBox} from './function.js';
(function (doc, win) {
  let docEl = doc.documentElement,
      recalc = function () {
          let clientWidth = docEl.clientWidth;
          if (!clientWidth) return;
          if(clientWidth>=1200){
              docEl.style.fontSize = '16x';
          }else{
              docEl.style.fontSize = 15 * (clientWidth / 1200) + 'px';
          }
      };
  if (!doc.addEventListener) return;
  win.addEventListener('resize', recalc);
  doc.addEventListener('DOMContentLoaded', recalc);
})(document, window);

window.addEventListener('load',()=>{
  function XHR(url, method, data, action) {
    const defaultUrlHeader = "https://autumnfish.cn/";
    let xhr = new XMLHttpRequest();
    if (method === 'GET') {
      xhr.open('GET', `${defaultUrlHeader}${url}?timestamp=${Date.now()}&${data}`);
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
          //  console.log(JSON.parse(this.responseText));
          let response = JSON.parse(this.responseText);
          // console.log(action(response));
          if('function' === typeof action) action(response);
        }
        else {
          console.log(this.status,url);
        }
      }
    }
  }
//刷头像
function loginS(){
  let user = JSON.parse(localStorage.getItem('user'))
  if(user){
    //存到本地的个人信
    XHR('/user/level','GET',`cookie=${encodeURIComponent(user.cookie)}`,response=>localStorage.setItem('level',JSON.stringify(response)));
    XHR('/mv/sublist','GET',`cookie=${encodeURIComponent(user.cookie)}`,response=>localStorage.setItem('mvsublist',JSON.stringify(response)));
    loginHiden();
    loginBtn.innerHTML = '';
    loginBtn.className = 'login-head';
    const loginDropdown = document.createElement('div');
    loginDropdown.className = 'login-dropdown';
    loginBtn.append(loginDropdown);
    loginDropdown.innerHTML = `
    <a class="to-user-index" href="../userindex.html" target="_blank">个人首页</a>
    <a class="login-out">退出登录</a>
    `;
    //登出
    const loginOut = loginDropdown.querySelector('.login-out');
    loginBtn.style.backgroundImage = `url(${user.profile.avatarUrl})`;
    loginOut.addEventListener('click',()=>{
        localStorage.clear();
        XHR('/logout','POST',null,null);
        loginBtn.className = 'login-btn';
        loginBtn.innerHTML = '登录';
        loginBtn.removeAttribute('style');
        setTimeout(()=>loginBtn.addEventListener('click',loginAppear),0);//防止登出时再次触发点击事件
    });
    loginBtn.removeEventListener('click',loginAppear);
  }
  return user;
}
let user = loginS();
// 登录模块
const loginForm = document.querySelector('.login-form');
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  XHR('/login/cellphone', 'POST', `phone=${loginForm.querySelector('[name=phone]').value}&password=${loginForm.querySelector('[name=password]').value}`,response=>{  
    if(response.code === 200){
      localStorage.setItem('user',JSON.stringify(response));
      loginS();
    } else {
      alert('密码或账户名有误!!!');
    }
  });
});
//搜索盒子
XHR('/search/default','GET',null,response=>localStorage.setItem('defaultsearch',JSON.stringify(response)));
let defaultsearch = JSON.parse(localStorage.getItem('defaultsearch'));
const search = document.querySelector('.m-search');
const searchInput = search.querySelector('[type="search"]');
const searchDropdown = search.querySelector('.search-dropdown');
let searchdropdownkey;
searchInput.addEventListener('click',e=>{
    if(searchdropdownkey) clearTimeout(searchdropdownkey);
    searchDropdown.style.height = "16rem";
    searchdropdownkey = setTimeout(()=>{
      searchDropdown.removeAttribute('style');
    },5000)
})
searchInput.addEventListener('keyup',()=>{
  function differentTypeSearch(type){
    let data;
    XHR('/search','GET',`keywords=${!searchInput.value?defaultsearch.data.realkeyword:searchInput.value}&limit=1&type=${type}`,response=>data = response.result);
    return data;
  }
  console.log(differentTypeSearch('1'));
  searchDropdown =`
  <div class="search-artisit">歌手</div>
  <div><a href=""> </a></div>
  <div class="search-mv">专辑</div>
  <div><a href=""></a></div>
  <div class="search-user">用户</div>
  <div><a href=""></a></div>
  <div class="search-music">单曲</div>
  <div><a href=""></a></div>
  <div class="search-playlist">歌单</div>
  <div><a href=""></a></div>
  `;
});
// 音乐相关函数
// function aboutmusic(title, data, drawAction) {
//   const SlideList = document.querySelector(title).querySelector('.m-slide-list');
//   data.forEach(element => {
//     let section = document.createElement('section');
//     SlideList.append(section);
//     section.className = 'm-slide-item';
//     drawAction(section, element);
//   })
// }
// // 推荐歌单
// XHR('/personalized', 'GET', null, response => {
//   aboutmusic('.recommendation', response.result, (section, element) => {
//     section.innerHTML = `
//     <div class="m-slide-item-pic">
//     <img src="${element.picUrl}" alt="">
//     <i class="m-cover-mask"></i>
//     <i class="m-video-play"></i>
//     </div>
//     <div class="m-des">
//     <h4><a href="">${element.name}</a></h4>
//     <p>播放量：${element.playCount}</p>
//     </div>`;
//   });
// });
// // 新歌首发
// XHR('/personalized/newsong', 'GET', 'limit=27', response => {
//   aboutmusic('.new-songs-starts', response.result, (section, element) => {
//     let time = handleTime(element.song.duration);
//     section.innerHTML = `
//     <div class="m-slide-item-pic">
//       <img src="${element.picUrl}" alt="${element.name}">
//       <i class="m-cover-mask"></i>
//       <i class="m-video-play"></i>
//     </div>
//     <div class="m-desc">
//       <h4><a href="">${element.name}</a></h4>
//       <p><a href="">${element.song.artists[0].name}</a></p>
//     </div>
//     <time>${time}</time>`;
//   });
// });
// // 精彩推荐
// XHR('/personalized/privatecontent', 'GET', null, response => {
//   aboutmusic('.ex-recommendation', response.result, (section, element) => {
//     section.innerHTML = `
//     <div class="m-slide-item-pic">
//         <img src="${element.picUrl}" alt="${element.name}">
//     </div>`;
//     section.addEventListener('click', () => window.open(element.sPicUrl));
//   });
// })
// // 新碟首发
// XHR('/album/new', 'GET', 'limit=10', response => {
//   aboutmusic('.new-disc-starts', response.albums, (section, element) => {
//     section.innerHTML = `
//     <div class="m-slide-item-pic">
//     <img src="${element.blurPicUrl}" alt="${element.name}">
//     <i class="m-cover-mask"></i>
//     <i class="m-video-play"></i>
//     </div>
//     <div class="m-des">
//     <h4><a href="">${element.name}</a></h4>
//     <p>${element.artist.name}</p>
//     </div>`;
//     // section.addEventListener('click', () => window.open(element.sPicUrl));
//   });
// })
// // 最新专辑
// XHR('/mv/first', 'GET', 'limit=10', response => {
//   aboutmusic('.music-video', response.data, (section, element) => {
//     section.innerHTML = `
//     <div class="m-slide-item-pic">
//     <img src="${element.cover}" alt="${element.name}">
//     <i class="m-cover-mask"></i>
//     <i class="m-video-play"></i>
//     </div>
//     <div class="m-des">
//     <h4><a href="">${element.name}</a></h4>
//     <p>${element.artistName}</p>
//     <div><i class="icon-video"></i>${element.playCount}</div>`;
//     section.addEventListener('click', () => {
//       XHR('/mv/url', 'GET', 'id=' + element.id, response2 => window.open(response2.data.url))
//     });
//   });
// });
});
export {};