"use strict"
import{} from './ajax.js';
const loginBtn = document.querySelector('.login-btn');
const loginBox = document.querySelector('.m-login-box');
const loginmask = document.querySelector('.login-mask');
loginBtn.addEventListener('click',()=>{
    loginBox.style.display = 'flex';
    loginmask.style.display = 'block';
});
loginmask.addEventListener('click',()=>{
    loginBox.style.display = 'none';
    loginmask.style.display = 'none';
});
export{loginBtn}