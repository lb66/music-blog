// pages/blog-edit/blog-edit.js
const Max_Num = 140
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: '最大字数：140',
    footerBottom: 0
  },
  onFocus(event){
    //获取键盘高度
    this.setData({
      footerBottom:event.detail.height
    })
  },
  onBlur(){
    this.setData({
      footerBottom:0
    })
  },
  onInput(event) {
    let num = event.detail.value.length
    if (num < Max_Num) {
      this.setData({
        wordsNum: '当前字数：' + num
      })
    } else {
      this.setData({
        wordsNum: '最大字数：140'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
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