// components/progress-bar/progress-bar.js
let areaWidth = 0
let pointWidth = 0
let audioManager = wx.getBackgroundAudioManager()
let _sec = -1
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: "00:00"
    },
    movableDies: 0,
    progress: 0,
  },
  lifetimes: {
    ready() {
      this.getMovableDies()
      this.bindBgmEvent()
    }
  },
  methods: {
    onChange(event) {
      // console.log(event)
      if (event.detail.source === 'touch') {
        this.data.progress = event.detail.x / (areaWidth - pointWidth) * 100
        this.data.movableDies = event.detail.x
      }
    },
    onTouchEnd() {
      audioManager.seek(this.data.progress / 100 * audioManager.duration)
      this.setData({
        progress: this.data.progress,
        movableDies: this.data.movableDies,
      })
    },
    getMovableDies() {
      const query = this.createSelectorQuery()
      query.select('.area').boundingClientRect()
      query.select('.point').boundingClientRect()
      query.exec((rect) => {
        areaWidth = rect[0].width
        pointWidth = rect[1].width
        // console.log(areaWidth, pointWidth)
      })
    },
    bindBgmEvent() {
      audioManager.onEnded(()=>{
        this.triggerEvent('toNextSong')
      })
      audioManager.onError((res) => {
          wx.showToast({
            title: '错误：' + res.errCode,
          })
        }),
        audioManager.onCanplay(() => {
          //有时无法直接获取总秒数，放在定时器里可以获取
          setTimeout(() => {
            // console.log(audioManager.duration)//总秒数
            const durationTime = this._dateFormat(audioManager.duration)
            this.setData({
              ['showTime.totalTime']: `${durationTime.min}:${durationTime.sec}`
            })
          }, 200)
        }),
        audioManager.onPlay(() => {
          console.log('onPlay')
        }),
        audioManager.onTimeUpdate(() => {
          // console.log(audioManager.currentTime)
          const currentTime = this._dateFormat(audioManager.currentTime)
          let sec = audioManager.currentTime.toString().split('.')[0]
          if (sec !== _sec) {
            this.setData({
              ['showTime.currentTime']: `${currentTime.min}:${currentTime.sec}`,
              movableDies: (areaWidth - pointWidth) * audioManager.currentTime / audioManager.duration,
              progress: audioManager.currentTime / audioManager.duration * 100
            })
            _sec = sec
          }
        })
    },
    _dateFormat(sec) {
      const min = Math.floor(sec / 60)
      sec = Math.floor(sec % 60)
      return {
        'min': this._add0(min),
        'sec': this._add0(sec),
      }
    },
    _add0(num) {
      return num < 10 ? '0' + num : num
    }
  }
})