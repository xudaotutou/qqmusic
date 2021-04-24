"use strict";
import { handleTime, debound, XHR} from './function.js';
import {loginHiden,loginAppear,loginmask,loginBox,loginBtn } from './index.js';
//适配rem
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
const searchInput = search.querySelector('.u-search-input');
const searchDropdown = search.querySelector('.search-dropdown');
searchInput.addEventListener('click',e=>{
    searchDropdown.style.height = "auto";
})
search.addEventListener('mouseleave',()=>searchDropdown.style.height = '0');
function searchinput(){
  function differentTypeSearch(name,type){
    //如果没有输入值就用默认的关键字
    XHR('/search','GET',`keywords=${!searchInput.value?defaultsearch.data.realkeyword:searchInput.value}&type=${type}&limit=3`,response=>localStorage.setItem(name,JSON.stringify(response.result)));
  }
  differentTypeSearch('search-artist','100');
  differentTypeSearch('search-album','10');
  differentTypeSearch('search-user','1002');
  differentTypeSearch('search-music','1');
  differentTypeSearch('search-playlist','1000');
  //先验证是否存在，再填充内容
  searchDropdown.innerHTML =`
  <div class="search-artist search-title">歌手</div>
  <div class="search-artist-list"><a href="">${[...JSON.parse(localStorage.getItem('search-artist')).artists].length === 0?'':JSON.parse(localStorage.getItem('search-artist')).artists[0].name}</a></div>
  <div class="search-artist-list"><a href="">${[...JSON.parse(localStorage.getItem('search-artist')).artists].length < 1?'':JSON.parse(localStorage.getItem('search-artist')).artists[1].name}</a></div>
  <div class="search-artist-list"><a href="">${[...JSON.parse(localStorage.getItem('search-artist')).artists].length < 2?'':JSON.parse(localStorage.getItem('search-artist')).artists[2].name}</a></div>
  <div class="search-album search-title">专辑</div>
  <div class="search-album-list"><a href="">${[...JSON.parse(localStorage.getItem('search-album')).albums].length === 0?'':JSON.parse(localStorage.getItem('search-album')).albums[0].name}</a></div>
  <div class="search-album-list"><a href="">${[...JSON.parse(localStorage.getItem('search-album')).albums].length < 2?'':JSON.parse(localStorage.getItem('search-album')).albums[1].name}</a></div>
  <div class="search-album-list"><a href="">${[...JSON.parse(localStorage.getItem('search-album')).albums].length < 3?'':JSON.parse(localStorage.getItem('search-album')).albums[2].name}</a></div>
  <div class="search-user search-title">用户</div>
  <div class="search-user-list"><a href="">${[...JSON.parse(localStorage.getItem('search-user')).userprofiles].length === 0?'':JSON.parse(localStorage.getItem('search-user')).userprofiles[0].nickname}</a></div>
  <div class="search-user-list"><a href="">${[...JSON.parse(localStorage.getItem('search-user')).userprofiles].length < 2?'':JSON.parse(localStorage.getItem('search-user')).userprofiles[1].nickname}</a></div>
  <div class="search-user-list"><a href="">${[...JSON.parse(localStorage.getItem('search-user')).userprofiles].length < 3?'':JSON.parse(localStorage.getItem('search-user')).userprofiles[2].nickname}</a></div>
  <div class="search-music search-title">单曲</div>
  <div class="search-music-list"><a href="">${[...JSON.parse(localStorage.getItem('search-music')).songs].length === 0?'':JSON.parse(localStorage.getItem('search-music')).songs[0].name}</a></div>
  <div class="search-music-list"><a href="">${[...JSON.parse(localStorage.getItem('search-music')).songs].length < 2?'':JSON.parse(localStorage.getItem('search-music')).songs[1].name}</a></div>
  <div class="search-music-list"><a href="">${[...JSON.parse(localStorage.getItem('search-music')).songs].length < 3?'':JSON.parse(localStorage.getItem('search-music')).songs[2].name}</a></div>
  <div class="search-playlist search-title">歌单</div>
  <div class="search-playlist-list"><a href="">${[...JSON.parse(localStorage.getItem('search-playlist')).playlists].length === 0?'':JSON.parse(localStorage.getItem('search-playlist')).playlists[0].name}</a></div>
  <div class="search-playlist-list"><a href="">${[...JSON.parse(localStorage.getItem('search-playlist')).playlists].length < 2?'':JSON.parse(localStorage.getItem('search-playlist')).playlists[1].name}</a></div>
  <div class="search-playlist-list"><a href="">${[...JSON.parse(localStorage.getItem('search-playlist')).playlists].length < 3?'':JSON.parse(localStorage.getItem('search-playlist')).playlists[2].name}</a></div>
  `;
}
//打开页面渲染
searchinput();
searchInput.addEventListener('keyup',debound(searchinput,2000));
//以后在加懒加载

// 音乐相关函数
function aboutmusic(title, data, drawAction) {
  const SlideList = document.querySelector(title).querySelector('.m-slide-list');
  data.forEach(element => {
    let section = document.createElement('section');
    SlideList.append(section);
    section.className = 'm-slide-item';
    section.setAttribute('data-res-id',element.id);
    section.addEventListener('click',()=>{
      window.location.href = `play.html?id=${section.getAttribute('data-res-id')}`
    });
    drawAction(section, element);
  })
}
// 推荐歌单
XHR('/personalized', 'GET', null, response => {
  aboutmusic('.recommendation', response.result, (section, element) => {
    section.innerHTML = `
    <div class="m-slide-item-pic">
    <img src="${element.picUrl}" alt="">
    <i class="m-cover-mask"></i>
    <i class="m-video-play"></i>
    </div>
    <div class="m-des">
    <h4><a href="">${element.name}</a></h4>
    <p>播放量：${element.playCount}</p>
    </div>`;
  });
});
// 新歌首发
XHR('/personalized/newsong', 'GET', 'limit=27', response => {
  aboutmusic('.new-songs-starts', response.result, (section, element) => {
    let time = handleTime(element.song.duration);
    // console.log(element)
    section.innerHTML = `
    <div class="m-slide-item-pic">
      <img src="${element.picUrl}" alt="${element.name}">
      <i class="m-cover-mask"></i>
      <i class="m-video-play"></i>
    </div>
    <div class="m-desc">
      <h4><a href="">${element.name}</a></h4>
      <p><a href="">${element.song.artists[0].name}</a></p>
    </div>
    <time>${time}</time>`;
  });
});
// 精彩推荐
XHR('/personalized/privatecontent', 'GET', null, response => {
  aboutmusic('.ex-recommendation', response.result, (section, element) => {
    section.innerHTML = `
    <div class="m-slide-item-pic">
        <img src="${element.picUrl}" alt="${element.name}">
    </div>`;
    section.addEventListener('click', () => window.open(element.sPicUrl));
  });
})
// 新碟首发
XHR('/album/new', 'GET', 'limit=10', response => {
  aboutmusic('.new-disc-starts', response.albums, (section, element) => {
    section.innerHTML = `
    <div class="m-slide-item-pic">
    <img src="${element.blurPicUrl}" alt="${element.name}">
    <i class="m-cover-mask"></i>
    <i class="m-video-play"></i>
    </div>
    <div class="m-des">
    <h4><a href="">${element.name}</a></h4>
    <p>${element.artist.name}</p>
    </div>`;
    // section.addEventListener('click', () => window.open(element.sPicUrl));
  });
})
// 最新专辑
XHR('/mv/first', 'GET', 'limit=10', response => {
  aboutmusic('.music-video', response.data, (section, element) => {
    section.innerHTML = `
    <div class="m-slide-item-pic">
    <img src="${element.cover}" alt="${element.name}">
    <i class="m-cover-mask"></i>
    <i class="m-video-play"></i>
    </div>
    <div class="m-des">
    <h4><a href="">${element.name}</a></h4>
    <p>${element.artistName}</p>
    <div><i class="icon-video"></i>${element.playCount}</div>`;
    section.addEventListener('click', () => {
      XHR('/mv/url', 'GET', 'id=' + element.id, response2 => window.open(response2.data.url))
    });
  });
});
});
export {};