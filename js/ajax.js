"use strict"
import{ handleTime } from './function.js';
import{loginBtn} from './index.js';
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

// 登录模块
const loginForm = document.querySelector('.login-form');
loginForm.addEventListener('submit', e => {
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
// 推荐歌单 
XHR('/personalized', 'GET', null, response => {
  let recsonglist = response.result;
  // console.log(recsonglist);
  const recsong = document.querySelector('.recommendation');
  const SlideList = recsong.querySelector('.m-slide-list');
  recsonglist.forEach(element => {
    let section = document.createElement('section');
    SlideList.append(section);
    section.className = 'm-slide-item';
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
  let topsonglist = response.result;
  //  console.log(topsonglist);
  const topsong = document.querySelector('.new-songs-starts');
  const SlideList = topsong.querySelector('.m-slide-list');
  topsonglist.forEach(element => {
    let section = document.createElement('section');
    let time = handleTime(element.song.duration);
    SlideList.append(section);
    section.className = 'm-slide-item';
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
// 最新专辑
XHR('/mv/first', 'GET', 'limit=10', response => {
  let newMVlist = response.data;//数组
  const mv = document.querySelector('.music-video');
  const SlideList = mv.querySelector('.m-slide-list');
  newMVlist.forEach(element => {
    let section = document.createElement('section');
    SlideList.append(section);
    section.className = 'm-slide-item';
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