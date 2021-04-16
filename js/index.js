"use strict"
import{} from './ajax.js';
import { loginHiden, loginAppear} from './function.js';
const loginBtn = document.querySelector('.login-btn');
const loginBox = document.querySelector('.m-login-box');
const loginmask = document.querySelector('.login-mask');
loginBtn.addEventListener('click',loginAppear);
loginmask.addEventListener('click',loginHiden);
export{loginBox,loginmask,loginBtn}