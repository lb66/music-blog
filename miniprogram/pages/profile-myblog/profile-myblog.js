// pages/profile-myblog/profile-myblog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getMyBlog()
  },
  _getMyBlog(){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'blog',
      data:{
        start: this.data.blogList.length,
        count: 10,
        $url:'myblog'
      }
    }).then(res=>{
      console.log(res)
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
    })
  },
  toComment(event) {
    wx.navigateTo({
      url: '../comment/comment?blogId=' + event.target.dataset.blogid,
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