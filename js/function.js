import{loginmask,loginBox,loginBtn as loginHead, loginBtn} from './index.js'
function handleTime(timestamp){
    let second = parseInt(timestamp / 1000);
    let min = parseInt(second / 60);
    second = second - min * 60;
    min = (min === 0) ? '00' : (min < 10) ? '0' + min : min + '';
    second = (second === 0) ? '00' : (second < 10) ? '0' + second : second + '';
    return `${min}:${second}`;
}
function loginAppear(){
    loginBox.style.display = 'flex';
    loginmask.style.display = 'block';
}
function loginHiden() {
    loginBox.style.display = 'none';
    loginmask.style.display = 'none';
}
function loginS(action){
    loginHiden();
    loginHead.innerHTML = '';
    loginHead.className = 'login-head';
    action(loginHead);
}
export{handleTime, loginHiden, loginS,loginAppear};