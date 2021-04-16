"use strict";
(function (doc, win) {
  let docEl = doc.documentElement,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
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
import { handleTime, loginS,loginAppear} from './function.js';
import{loginBox, loginBtn} from './index.js';
function XHR(url, method = 'GET', data = null, action) {
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
        //  console.log(JSON.parse(this.responseText));
        let response = JSON.parse(this.responseText);
        // console.log(action(response));
        action(response);
      }
      else {
        console.log(this.status);
      }
    }
  }
}
let user;
// 登录模块
const loginForm = document.querySelector('.login-form');
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  XHR('/login/cellphone', 'POST', `phone=${loginForm.querySelector('[name=phone]').value}&password=${loginForm.querySelector('[name=password]').value}`,(response)=>{
    user = response;
    if(user.code === 200){
      loginS(elt=>elt.style.backgroundImage = `url(${user.profile.avatarUrl})`);
      loginBtn.removeEventListener('click',loginAppear);
    } 
    console.log(user);
  });
});
// 准备写个头像
// 应该能写成一个音乐相关类
// 推荐歌单 
function aboutmusic(title, data, drawAction) {
  const SlideList = document.querySelector(title).querySelector('.m-slide-list');
  data.forEach(element => {
    let section = document.createElement('section');
    SlideList.append(section);
    section.className = 'm-slide-item';
    drawAction(section, element);
  })
}
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
export { }