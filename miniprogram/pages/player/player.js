// pages/player/player.js
//获取全局唯一的背景音乐管理器
const audioManager = wx.getBackgroundAudioManager()
let currentIndex = 0
let musiclist = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    idPlaying: false,
    isShowLyric: false,
    lyric:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    currentIndex = options.index
    musiclist = wx.getStorageSync('musiclist')
    this.loadMusic()
  },
  loadMusic() {
    audioManager.stop()
    let currentMusic = musiclist[currentIndex]
    console.log(currentMusic)
    wx.setNavigationBarTitle({
      title: currentMusic.name,
    })
    this.setData({
      picUrl: currentMusic.al.picUrl,
      isPlaying: false
    })
    wx.showLoading({
      title: '歌曲加载中',
    })
    //读取音乐url并开始播放
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId: currentMusic.id,
        $url: 'musicUrl'
      }
    }).then((res) => {
      // console.log(JSON.parse(res.result))
      let result = JSON.parse(res.result)
      audioManager.src = result.data[0].url
      audioManager.title = currentMusic.name
      // audioManager.coverImgUrl = currentMusic.al.picUrl
      audioManager.singer = currentMusic.ar[0].name
      audioManager.epname = currentMusic.al.name
      this.setData({
        isPlaying: true
      })
      wx.hideLoading()
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId: currentMusic.id,
        $url: 'lyric'
      }
    }).then((res) => {
      let lyric = JSON.parse(res.result).musiclyric || '暂无歌词'
      this.setData({
        lyric
      })
    })
  },
  switch () {
    this.setData({
      isPlaying: !this.data.isPlaying
    })
    if (this.data.isPlaying) {
      audioManager.play()
    } else {
      audioManager.pause()
    }
  },
  onNext() {
    currentIndex++
    if (currentIndex === musiclist.length) {
      currentIndex = 0
    }
    this.loadMusic()
  },
  onPrev() {
    currentIndex--
    if (currentIndex < 0) {
      currentIndex = musiclist.length - 1
    }
    this.loadMusic()
  },
  toggleLyric() {
    this.setData({
      isShowLyric: !this.data.isShowLyric
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})