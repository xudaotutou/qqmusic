function handleTime(timestamp){
    let second = parseInt(timestamp / 1000);
    let min = parseInt(second / 60);
    second = second - min * 60;
    min = (min === 0) ? '00' : (min < 10) ? '0' + min : min + '';
    second = (second === 0) ? '00' : (second < 10) ? '0' + second : second + '';
    return `${min}:${second}`;
}
export{handleTime};