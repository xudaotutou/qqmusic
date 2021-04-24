"use strict"
import{} from './ajax.js';
const loginBtn = document.querySelector('.login-btn');
const loginBox = document.querySelector('.m-login-box');
const loginmask = document.querySelector('.login-mask');
function loginAppear(){
    loginBox.style.display = 'flex';
    loginmask.style.display = 'block';
}//弹出登录页面
function loginHiden() {
    loginBox.style.display = 'none';
    loginmask.style.display = 'none';
}// 隐藏登录页面
loginBtn.addEventListener('click',loginAppear);
loginmask.addEventListener('click',loginHiden);
export{loginBox,loginmask,loginBtn,loginHiden,loginAppear}