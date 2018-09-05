import './css/index.css';

import circalProgress from './circle'

function linearLocation(y, r, lineWidth){
    // 设定渐变背影的起始结束点
    let start = y - ((r-15)*2 + lineWidth)/2;
    let end = start + (r-15)*2 + lineWidth
    return {start: start, end: end}
}

//
let c = new circalProgress(null, 'circle', {animation: true})
let d = new circalProgress(null, 'circle', {animation: true, circle: {fill: false}})
let b = new circalProgress(null, 'circleFill',{animation: true})
console.log(d);
/*(function (){
  let canvas = document.querySelector("#canvas")

  let dpi = 2

  canvas.width = 300
  canvas.height = 300


  let bigArcR = 100
  let midArcR = 80

  let lineWidth = bigArcR - midArcR
  let w = canvas.width
  let h = canvas.height
  let x =  w / 2
  let y =  h / 2

  let percentage = 80

  let endProgress = Math.PI / 180 * (360 * (percentage / 100))
  let startProgress = - Math.PI / 180 * 90
  let context = canvas.getContext('2d')

  context.strokeStyle = '#dedede';
  context.lineWidth = lineWidth;
  context.lineCap = "round";
  context.beginPath()
  context.arc(x, y, bigArcR, 0, Math.PI * 2, true)
  context.closePath()
  context.stroke()

  // 绘制进度条
  context.beginPath();
  var gradient = context.createLinearGradient(0, linearLocation(y, bigArcR, lineWidth).start, 0, linearLocation(y, bigArcR, lineWidth).end)
  gradient.addColorStop(0, '#0f6cd9')
  gradient.addColorStop(1, '#05a6da')
  context.strokeStyle = gradient
  context.lineWidth = lineWidth
  context.lineCap = "round"

  let rand = endProgress + startProgress

  context.arc(x, y, bigArcR, startProgress, rand, false);
  context.stroke()

  // 绘制内圆的比例
  let midR = midArcR + 8
  context.lineWidth = 1
  context.strokeStyle = '#fff'
  context.beginPath()
  context.arc(x, y, midR, 0, 2 * Math.PI, true)
  context.closePath()
  context.stroke()

  context.clip()

  var midGradient = context.createLinearGradient(0, linearLocation(y, bigArcR, lineWidth).start, 0, linearLocation(y, bigArcR, lineWidth).end);

  midGradient.addColorStop(0, '#c8efd4');
  midGradient.addColorStop(0.5, '#6bd089');
  midGradient.addColorStop(1, '#3bd368');

  context.fillStyle = midGradient
  context.beginPath()
  context.rect(0, (50 + 2 * midR + lineWidth - 16) - 2 * midR * (percentage / 100), w, h)
  context.closePath()
  context.fill()

  // 绘制文字
  let text = percentage + "%"

  context.fillStyle = "#fff"
  context.font = "600 40px Arial"
  context.textAlign = "center"
  context.fillText(text, x, y + 10)
})()*/
