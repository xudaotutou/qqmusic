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
          if('function' === typeof action) action(response);
        }
        else {
          console.log(this.status,url);
        }
      }
    }
  }
  //请求音乐url
  function musicURL(id,cookie,action) {
    if(cookie) XHR('/song/Url','GET',`id=${id}&cookie=${encodeURIComponent(cookie)}`,response=>action(response));
    else XHR('/song/Url','GET',`id=${id}`,response=>action(response));
  }
  let user = JSON.parse(localStorage.getItem('user'));
//测试
let searchParams = new URLSearchParams(document.location.search);
let audioId = searchParams.get('id');
const audioPlayer = document.querySelector('.audio-player');
musicURL(audioId,user.cookie,response=>audioPlayer.src = response.data[0].url);