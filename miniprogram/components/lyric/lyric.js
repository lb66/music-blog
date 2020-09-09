let currentHeight = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lyric: String
  },
  observers: {
    lyric(lrc) {
      if (lrc === '暂无歌词') {
        this.setData({
          lrcList: [{
            lrc,
            time: 0
          }],
          nowIndex: -1
        })
      } else {
        this._parseLyric(lrc)
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    lrcList: [],
    nowIndex: 0, //当前歌词索引
    scrollTop: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _parseLyric(value) {
      let line = value.split('\n')
      // console.log("line",line)
      let _lrcList = []
      line.forEach((el) => {
        let time = el.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if (time !== null) {
          let lrc = el.split(time)[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          // console.log("timeReg",timeReg)
          let timeToSec = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3] / 1000)
          _lrcList.push({
            lrc: lrc,
            time: timeToSec
          })
        }
      })
      this.setData({
        lrcList: _lrcList
      })
    },
    update(currentTime) {
      // console.log(currentTime)
      let lrclList = this.data.lrcList
      for (let i = 0; i < lrclList.length; i++) {
        if (currentTime <= lrclList[i].time) {
          this.setData({
            nowIndex: i - 1,
            scrollTop: (i - 1) * currentHeight
          })
          break
        }
      }
    }

  },
  lifetimes: {
    ready() {
      wx.getSystemInfo({
        success: (result) => {
          currentHeight = result.screenWidth / 750 * 64
        }, //计算当前高度
      })
    }
  }


})