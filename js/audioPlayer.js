import {XHR, handleTime} from './function.js';
//请求音乐url
function musicURL(id, cookie, action) {
  if (cookie) XHR('/song/Url', 'GET', `id=${id}&cookie=${encodeURIComponent(cookie)}`, response => action(response));
  else XHR('/song/Url', 'GET', `id=${id}`, response => action(response));
}
let user = JSON.parse(localStorage.getItem('user'));
//获取传来的id 可能不是单曲！
let searchParams = new URLSearchParams(document.location.search);
let audioId = searchParams.get('id');
// 获取相对应的元素节点
const audio = document.querySelector('.audio');
const playBtn = document.querySelector('.fa-play');
const nowTime = document.querySelector('.now-progress');
const entireTime = document.querySelector('.entire-progress');
const currentTime = document.querySelector('.current-time');
const totalTime = document.querySelector('.total-time');
let progressId;
// 进度条
function progress() {
    if (progressId) clearInterval(progressId), progressId = null;
    else progressId = setInterval(() => {
      nowTime.style.width = `${(audio.currentTime / audio.duration) * entireTime.clientWidth}px`
      currentTime.innerHTML = `${handleTime(audio.currentTime *1000)}`;
      totalTime.innerHTML = `${handleTime(audio.duration * 1000)}`;
    }, 50);
}
//开始和停止播放
function start(elt) {
  if (elt.classList.contains('fa-play')) {
    elt.classList.replace('fa-play', 'fa-pause');
    audio.play();
    progress()
  } else {
    elt.classList.replace('fa-pause', 'fa-play');
    audio.pause();
    progress();
  }
}
musicURL(audioId, user.cookie, response => audio.src = response.data[0].url);
playBtn.addEventListener('click', e => start(e.target));
//显示时间
