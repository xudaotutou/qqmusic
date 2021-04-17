import{loginmask,loginBox,loginBtn as loginHead} from './index.js'
function handleTime(timestamp){
    let second = parseInt(timestamp / 1000);
    let min = parseInt(second / 60);
    second = second - min * 60;
    min = (min === 0) ? '00' : (min < 10) ? '0' + min : min + '';
    second = (second === 0) ? '00' : (second < 10) ? '0' + second : second + '';
    return `${min}:${second}`;
}
// 把时间戳格式化
function loginAppear(){
    loginBox.style.display = 'flex';
    loginmask.style.display = 'block';
}
//弹出登录页面
function loginHiden() {
    loginBox.style.display = 'none';
    loginmask.style.display = 'none';
}
// 隐藏登录页面
function loginS(action,loginouturl){
    loginHiden();
    loginHead.innerHTML = '';
    loginHead.className = 'login-head';
    const loginDropdown = document.createElement('div');
    loginDropdown.className = 'login-dropdown';
    loginHead.append(loginDropdown);
    loginDropdown.innerHTML = `
    <a class="to-user-index" href="../userindex.html" target="_blank">个人首页</a>
    <a class="login-out">退出登录</a>
    `;
    const loginOut = loginDropdown.querySelector('.login-out');
    action(loginHead,loginOut);
}
// 登录成功后
export{handleTime, loginHiden, loginS,loginAppear};