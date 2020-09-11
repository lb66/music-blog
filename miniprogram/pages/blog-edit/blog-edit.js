// pages/blog-edit/blog-edit.js
const Max_WordsNum = 140
const Max_ImageNum = 9

let content = ''
let userInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: '最大字数：140',
    footerBottom: 0,
    images: [],
    showSelect: true
  },
  onFocus(event) {
    //获取键盘高度
    this.setData({
      footerBottom: event.detail.height
    })
  },
  onBlur() {
    this.setData({
      footerBottom: 0
    })
  },
  onInput(event) {
    content = event.detail.value
    let num = event.detail.value.length
    if (num < Max_WordsNum) {
      this.setData({
        wordsNum: '当前字数：' + num
      })
    } else {
      this.setData({
        wordsNum: '最大字数：140'
      })
    }
  },
  onSelectImage() {
    let num = Max_ImageNum - this.data.images.length
    wx.chooseImage({
      count: num,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        num = Max_ImageNum - this.data.images.length
        if (num <= 0) {
          this.setData({
            showSelect: false
          })
        }
      }
    })

  },
  onDeleteImage(event) {
    this.data.images.splice(event.target.dataset.index, 1)
    this.setData({
      images: this.data.images,
      showSelect: true
    })
  },
  onPreviewImage(event) {
    wx.previewImage({
      urls: this.data.images,
      current: event.target.dataset.imgSrc
    })
  },
  onPublish() {
    wx.showLoading({
      title: '上传中',
    })
    let promiseArr = []
    let fileIds = []
    for (let i = 0; i < this.data.images.length; i++) {
      let p = new Promise((resolve, reject) => {
        let image = this.data.images[i]
        let suffix = /\.\w+$/.exec(image)[0]
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + Math.floor(Math.random() * 1000) + suffix,
          filePath: image, // 文件路径
        }).then(res => {
          fileIds = fileIds.concat(res.fileID)
          resolve()
        }).catch(err => {
          reject()
        })
      })
      promiseArr.push(p)
    }
    Promise.all(promiseArr).then((res) => {
      wx.cloud.database().collection('blog').add({
        data: {
          ...userInfo,
          content,
          img: fileIds,
          createTime: wx.cloud.database().serverDate()
        }
      }).then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: '发表成功',
        })
        wx.navigateBack()
      })
    }).catch((err) => {
      console.log('fail')
      wx.hideLoading()
      wx.showToast({
        title: '发表失败',
        icon: 'none'
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    userInfo = options
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