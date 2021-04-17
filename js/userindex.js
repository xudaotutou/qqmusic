"use strict";
let user = JSON.parse(localStorage.getItem('user'));
console.log(user);
const avatar = document.querySelector('.avatar');
const userName = document.querySelector('.user-name');
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
personDesc.innerHTML = `个人简介：${user.profile.description === ''? "这个人很懒，没有留下简介。":user.profile.description}`