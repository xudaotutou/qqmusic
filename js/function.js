// 把时间戳格式化
function handleTime(timestamp) {
    let second = parseInt(timestamp / 1000);
    let min = parseInt(second / 60);
    second = second - min * 60;
    min = (min === 0) ? '00' : (min < 10) ? '0' + min : min + '';
    second = (second === 0) ? '00' : (second < 10) ? '0' + second : second + '';
    return `${min}:${second}`;
}
//防抖
function debound(fn, delay) {
    let deboundid = null;
    return () => deboundid ? clearTimeout(deboundid) : setTimeout(fn, delay);
}
//请求数据
function XHR(url, method, data, action) {
    const defaultUrlHeader = "https://autumnfish.cn/";
    let xhr = new XMLHttpRequest();
    if (method === 'GET') {
        xhr.open('GET', `${defaultUrlHeader}${url}?timestamp=${Date.now()}&${data}`);
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
                let response = JSON.parse(this.responseText);
                if ('function' === typeof action) action(response);
            }
            else {
                console.log(this.status, url);
            }
        }
    }
}
export { handleTime, debound,XHR};