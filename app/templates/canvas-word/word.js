/**
 * canvas 粒子文字
 */

class WordsCanvas {
  constructor (canvas, options = {}) {
    this.canvas = canvas ? (typeof canvas == 'object' ? canvas : document.querySelector(canvas)) : document.createElement('canvas')

    this.data = {}
    this.ctx = this.canvas.getContext('2d')
    this.particles = []
    this.init(options)
    this.lock = true
  }

  init (options) {
    let defaultConfig = {
      colors: ["#feea00", "#a9df85", "#5dc0ad", "#ff9a00", "#fa3f20", "#e03636", "#25c6fc", "#ff534d", "#b78261", "#b78261", "#eaf048", "#9ff048", "#2a5200", "#f6d6ff"],
      r: 2,
      wordWidth: 0,
      gridY: 7, // 间隔像素点
      gridX: 7, //间隔像素点
    }

    this.data = Object.assign({}, defaultConfig, options)
  }

  render (words) {

    this.ctx.textAlign = "center"
    this.ctx.textBaseline = "middle";
    this.ctx.font = "200px Arial"
    let wordWidth = this.ctx.measureText(words).width

    if (wordWidth > window.innerWidth) {
      let rows = Math.ceil(wordWidth / window.innerWidth)
      this.canvas.width = window.innerWidth
      this.canvas.height = 200 * rows
    } else{
      this.canvas.width = 200 * words.length
      this.canvas.height = 200
    }

    this.cw = this.canvas.width
    this.ch = this.canvas.height

    this.ctx.clearRect(0 , 0, this.cw, this.ch)
    this.ctx.textAlign = "center"
    this.ctx.textBaseline = "middle"
    this.ctx.font = "200px Arial"
    // this.ctx.fillText(words, (this.cw - wordWidth ) / 2 + wordWidth / 2, 200 / 2, this.cw)
    this.renderWords(words, (this.cw - wordWidth ) / 2 + wordWidth / 2, 200 / 2, this.cw)
    let imgData = this.ctx.getImageData(0, 0, this.cw, this.ch)

    this.ctx.clearRect(0 , 0, this.cw, this.ch)
    this.createParticle(imgData)
  }

  /**
   * 随机返回一个颜色
   * @return {[type]} [description]
   */
  getRandomColor () {
    return this.data.colors[this.getRandom(0, this.data.colors.length - 1)]
  }

  /**
   * 创建粒子集合
   * @param  {[type]} imgData [description]
   * @return {[type]}         [description]
   */
  createParticle (imgData) {
    let buffer32 = new Uint32Array(imgData.data.buffer)

    for (var j = 0; j < this.ch; j += this.data.gridY)
    {
      for (var i = 0; i < this.cw; i += this.data.gridX)
      {
        if (buffer32[j * this.cw + i])
        {
          var part = this.particle(i, j, this.data.r, this.getRandomColor(), this.cw, this.ch)
          this.renderParticle(part)
          this.particles.push(part)
        }
      }
    }
    this.animation()
  }

  /**
   * 动画执行函数
   * @return {[type]} [description]
   */
  animation () {
    let that = this
    let thisTIme = new Date()
    let animTime = null
    doAnimation()
    let pause = false

    function doAnimation(time) {
      that.ctx.clearRect(0, 0, that.cw, that.ch)
      that.particles.forEach(item => {
        if(that.lock){
          if(Math.abs(item.targetX-item.x) < 0.01 && Math.abs(item.targetY-item.y) < 0.01){
            item.x = item.targetX
            item.y = item.targetY
            pause = true
            if(thisTIme - animTime > 300) that.lock = false
          } else{
            item.x += (item.targetX - item.x) * 0.2
            item.y += (item.targetY - item.y) * 0.2
            animTime = new Date()
          }
        }else{
          console.log(2);
          if(Math.abs(item.initX-item.x) < 0.01 && Math.abs(item.initY-item.y) < 0.01){
            item.x = item.initX
            item.y = item.initY
            pause = true
            console.log("执行完毕！")
          } else{
            item.x += (item.initX-item.x) * 0.01
            item.y += (item.initY-item.y) * 0.01
            pause = false
          }
        }
        that.renderParticle(item)
      })
      if(!pause) {
        window.requestAnimationFrame(doAnimation)
      }
    }
  }

  /**
   * 画文字
   * @param  {[type]} t [description]
   * @param  {[type]} x [description]
   * @param  {[type]} y [description]
   * @param  {[type]} w [description]
   * @return {[type]}   [description]
   */
  renderWords (t, x, y, w) {
    t = t.replace(/\s/g,"");
    let textArr = t.split('')
    let cw = this.cw
    let texts = []
    // 一行的字数
    let temp = []
    let textNumber = Math.floor(cw / 200)
    textArr.forEach((v, i) => {
      let row = Math.floor(i / textNumber)
      if (texts[row]) {
        texts[row].push(v)
      } else {
        texts[row] = []
        texts[row].push(v)
      }
    })

    texts.forEach((v, i) => {
      this.ctx.fillText(v.join(''), x, y + (i * 200), cw)
    })
  }
  /**
   * 渲染单个粒子
   * @param  {[type]} particle [description]
   * @return {[type]}          [description]
   */
  renderParticle (particle) {
    this.ctx.save()
    this.ctx.fillStyle = particle.color
    this.ctx.beginPath()
    this.ctx.arc(particle.x, particle.y, particle.r, 0, 2 * Math.PI, true)
    this.ctx.closePath()
    this.ctx.fill()
    this.ctx.restore()
  }

  getRandom(min, max) {
    return Math.floor((Math.random() * (max - min + 1) + min))
  }

  /**
   * 粒子构造函数
   * @param  {Number} x  [x坐标]
   * @param  {Number} y  [y坐标]
   * @param  {Number} r  [半径]
   * @param  {Number} cw [canvas宽]
   * @param  {Number} ch [canvas高]
   * @return {Object}    [粒子对象]
   */
  particle (x, y, r, color, cw, ch) {
    let initx = Math.random() * cw
    let inity = Math.random() * ch
    return {
      targetX: x,
      targetY: y,
      color: color,
      initX: initx,
      initY: inity,
      x: initx,
      y: inity,
      r: r,
    }
  }
}
module.exports = WordsCanvas;
