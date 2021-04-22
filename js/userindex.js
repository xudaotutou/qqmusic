"use strict";
let user = JSON.parse(localStorage.getItem('user'));
console.log(user);
//头像，名字，等级
const avatar = document.querySelector('.avatar');
const userName = document.querySelector('.user-name');
const level = document.querySelector('.level');
level.innerHTML = "level: " + JSON.parse(localStorage.getItem('level')).data.level;
avatar.src = user.profile.avatarUrl;
userName.innerHTML = user.profile.nickname;
// 动态，关注，粉丝，简介
const eventCount = document.querySelector('.eventCount');
const follows = document.querySelector('.follows');
const followeds = document.querySelector('.followeds');
const personDesc = document.querySelector('.person-desc');
eventCount.innerHTML = "动态：" + user.profile.eventCount;
follows.innerHTML = "关注：" + user.profile.follows;
followeds.innerHTML = "粉丝：" + user.profile.followeds;
personDesc.innerHTML = `个人简介：${user.profile.description === ''? "这个人很懒，没有留下简介。":user.profile.description}`;
//ajax
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
          if('function' === typeof action) action(response);
        }
        else {
          console.log(this.status);
        }
      }
    }
  }
// mv
let mvshow =document.querySelector('.mymv');
let mvsublist = JSON.parse(localStorage.getItem('mvsublist'));
mvsublist.data.forEach(elt => {
  const section = document.createElement('section');
  section.innerHTML = `
  <div class="m-item-pic">
  <img src="${elt.coverUrl}" alt="${elt.title}">
  <i class="m-cover-mask"></i>
  <i class="m-video-play"></i>
</div>
<div class="m-desc">
  <h4><a href="">${elt.title}</a></h4>
  <p><a href="">${elt.creator.map(elt=>elt.userName).join('/')}</a></p>
</div>
  `;
  mvshow.append(section);
});
