/**
 * 圆环统计和圆形填充统计类
 * @type {String}
 */
class circleProgress {
  /**
   * 构造函数
   * @param  {string|object|null} canvas          [canvas对象/选择器/null]
   * @param  {String} [type='circle'] [类型:circle|circleFill]
   * @param  {object} options         [配置]
   * @return {[type]}                 [description]
   */
  constructor (canvas, type = 'circle', options) {
    this.data = {}
    this.canvas = canvas ? (typeof canvas == 'string' ? document.querySelector(canvas) : canvas) : document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.ctx.imageSmoothingEnabled  = true
    this.ctx.scale(this.data.dpi, this.data.dpi)
    this.requestAnimationFrame()
    this.init(type, canvas, options)
  }
  init (type, canvas, options) {
    let defaultConfig = {
      dpi: 2,
      w: 300,
      h: 300,
      animation: false, // 标识动画
      background: "#2c0d61", // 背景
      circle: { // 圆环配置
        gradientColor: ["#05a6da", "#0f6cd9"], // 渐变色系
        lineWidth: 20, // 宽度
        lineColor: "#dedede", // 线条底色
        r: 100, // 半径
        percentage: 30, // 百分比
        margin: 10, // 内外圆间隔
        fill: true, // 是否内圆
      },
      circleFill: {
        gradientColor: ["#c8efd4", "#6bd089", "#3bd368"],
        lineWidth: 1,
        r: 100,
        percentage: 50
      },
      percentText: {
        fillStyle: "#fff",
        font: "Arial",
        fontWeight: "bold",
        fontSize: 40,
        textAlign: "center"
      }
    }
    let circleConfig = Object.assign({}, defaultConfig.circle, options.circle)
    let circleFillConfig = Object.assign({}, defaultConfig.circleFill, options.circleFill)
    let percentTextConfig = Object.assign({}, defaultConfig.percentText, options.percentText)

    this.data = Object.assign({}, defaultConfig, options)
    this.data.circle = circleConfig
    this.data.circleFill = circleFillConfig
    this.data.percentText = percentTextConfig

    this.canvas.width = this.data.w * this.data.dpi
    this.canvas.height = this.data.h * this.data.dpi

    this.data.x = this.canvas.width / 2
    this.data.y = this.canvas.height / 2

    if (!canvas) {
      this.drawBackground()
    }
    let text = ''
    if (type == 'circle') {
      text = this.data.circle.percentage
      // 计算弧度
      let endProgress = Math.PI / 180 * (360 * (this.data.circle.percentage / 100))
      let startProgress = - Math.PI / 180 * 90

      let rand = endProgress + startProgress
      if (this.animation) {
        this.drawCircal(startProgress, rand)
      } else {
        this.doAnimation('drawCircal', startProgress, rand, this.data.circle.percentage)
      }
    } else {
      text = this.data.circleFill.percentage
      let diameter = this.data.circleFill.r * this.data.dpi * 2
      let marginTop = (this.canvas.height - diameter) / 2
      let percentHeight = diameter * ( (100 - text) / 100)
      let startY = marginTop + percentHeight
      let height = this.canvas.height - marginTop
      if (this.animation) {
        this.drawCircalFill(startY, height)
      } else {
        this.doAnimation('drawCircalFill', height, startY, text)
      }
    }
    if (this.animation) {
      this.drawText(text  + "%")
    } else {
      this.doAnimation('drawText', 0, text, 0)
    }

  }

  /**
   * 画圆环
   * @param  {number} startProgress [开始弧度]
   * @param  {number} rand          [结束弧度]
   * @return {[type]}               [description]
   */
  drawCircal (startProgress, rand) {

    //绘制底图
    this.ctx.strokeStyle = this.data.circle.lineColor
    this.ctx.lineWidth = this.data.circle.lineWidth * this.data.dpi
    this.ctx.lineCap = "round"

    this.ctx.beginPath()
    this.ctx.arc(this.data.x, this.data.y, this.data.circle.r * this.data.dpi, 0, 2 * Math.PI, true)
    this.ctx.closePath()
    this.ctx.stroke()

    // 绘制进度条
    this.ctx.beginPath();
    let gradientPoint = this.linearLocation(this.data.y, this.data.circle.r, this.data.circle.lineWidth)
    let gradient = this.ctx.createLinearGradient(0, gradientPoint.start, 0, gradientPoint.end)

    let colorLen = this.data.circle.gradientColor.length
    let average = 1 / colorLen

    for (let i = 0; i < colorLen; i ++) {
      gradient.addColorStop(i * average, this.data.circle.gradientColor[i])
    }
    this.ctx.strokeStyle = gradient
    this.ctx.arc(this.data.x, this.data.y, this.data.circle.r * this.data.dpi, startProgress, rand, false)
    this.ctx.stroke()

    // 内部填充圆
    if (this.data.circle.fill === true) {
      this.ctx.fillStyle = gradient
      this.ctx.beginPath()
      this.ctx.arc(this.data.x, this.data.y, (this.data.circle.r - this.data.circle.margin - this.data.circle.lineWidth) * this.data.dpi, 0, 2 * Math.PI, true)
      this.ctx.closePath()
      this.ctx.fill()
    }

  }

  /**
   * 画填充圆
   * @param  {number} startY [开始高度]
   * @param  {number} height [总高度]
   * @return {[type]}        [description]
   */
  drawCircalFill(startY, height) {
    let midR = this.data.circleFill.r * this.data.dpi
    this.ctx.lineWidth = 1  * this.data.dpi
    this.ctx.strokeStyle = '#fff'
    this.ctx.beginPath()
    this.ctx.arc(this.data.x, this.data.y, midR, 0, 2 * Math.PI, true)
    this.ctx.closePath()
    this.ctx.stroke()

    this.ctx.clip()

    let midGradientPoint = this.linearLocation(this.data.y, this.data.circleFill.r, 1)
    var midGradient = this.ctx.createLinearGradient(0, midGradientPoint.start, 0, midGradientPoint.end);

    let colorLen = this.data.circleFill.gradientColor.length
    let average = 1 / colorLen

    for (let i = 0; i < colorLen; i ++) {
      midGradient.addColorStop(i * average, this.data.circleFill.gradientColor[i])
    }

    this.ctx.fillStyle = midGradient

    this.ctx.beginPath()
    this.ctx.rect(0, startY, this.canvas.width, height)
    this.ctx.closePath()
    this.ctx.fill()
  }

  /**
   * 动画处理函数
   * @param  {string} handelName [执行动画的函数]
   * @param  {number} start      [开始值]
   * @param  {number} end        [结束值]
   * @param  {number} percent    [百分比]
   * @return {[type]}            [description]
   */
  doAnimation (handelName, start, end, percent) {

    let animationEndTargit = end
    let animationCurrent = start
    let that = this
    handelName = "animation" + handelName.substring(0,1).toUpperCase()+handelName.substring(1)

    window.requestAnimationFrame(eval(handelName))

    /**
     * 圆环动画
     * @param  {[type]} time [description]
     * @return {[type]}      [description]
     */
    function animationDrawCircal (time) {
      that.ctx.clearRect(0, 0 , that.canvas.width, that.canvas.height)
      that.drawBackground(false)
      animationCurrent += Math.PI / 180 * ((percent / 100 * 360) / percent)
      that.drawCircal(start, animationCurrent)
      if (animationCurrent < animationEndTargit ) {
        window.requestAnimationFrame(animationDrawCircal)
      }
    }

    /**
     * 文字动画
     * @return {[type]} [description]
     */
    function animationDrawText () {
      // that.ctx.clearRect(0, 0 , that.canvas.width, that.canvas.height)
      animationCurrent += 1
      that.drawText(animationCurrent + "%")
      if (animationCurrent < animationEndTargit ) {
        window.requestAnimationFrame(animationDrawText)
      }
    }

    /**
     * 填充动画
     * @return {[type]} [description]
     */
    function animationDrawCircalFill () {
      that.ctx.clearRect(0, 0 , that.canvas.width, that.canvas.height)
      that.drawBackground(false)
      animationCurrent -= (start - end) / percent
      that.drawCircalFill(animationCurrent, end)
      if (animationCurrent > animationEndTargit ) {
        window.requestAnimationFrame(animationDrawCircalFill)
      }
    }
  }

  /**
   * 画圆形填充
   * @return {[type]} [description]
   */
  drawBackground (append = true) {
    this.ctx.fillStyle = this.data.background
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fill()

    append && document.querySelector('body').appendChild(this.canvas)
  }

  /**
   * 绘制文字
   * @param  {[type]} context [canvas context]
   * @param  {[type]} text    [text]
   * @param  {[type]} options [配置]
   * @return {[type]}         [description]
   */
  drawText (text) {
    for (let k in this.data.percentText) {
      if (k != 'fontSize') {
        this.ctx[k] = this.data.percentText[k]
      }
    }
    this.ctx.font = this.data.percentText['fontWeight'] + ' ' +this.data.percentText['fontSize'] * this.data.dpi + 'px' + ' ' + this.data.percentText['font']

    this.ctx.fillText(text, this.data.x, this.data.y + 10 * this.data.dpi)
  }

  /**
   * 创建gradient开始和结束的点
   * @param  {[type]} y         [description]
   * @param  {[type]} r         [description]
   * @param  {[type]} lineWidth [description]
   * @return {[type]}           [description]
   */
  linearLocation(y, r, lineWidth){
      // 设定渐变背影的起始结束点
      let start = y - ((r-15)*2 + lineWidth)/2;
      let end = start + (r-15)*2 + lineWidth
      return {start: start, end: end}
  }

  /**
   * requestAnimationFrame profill
   * @return {[type]} [description]
   */
  requestAnimationFrame () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
  }
}

module.exports = circleProgress;
