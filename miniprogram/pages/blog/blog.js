let keyword
let userInfo
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showLogin: false,
    blogList:[],
    showPopup:false,
    content:''
  },
  loginSuccess(event) {
    console.log('登录成功',event)
  },
  loginFail() {
    wx.showModal({
      title: '提示',
      content: '请允许获取微信授权信息',
    })
  },
  onPublish() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
             userInfo=res.userInfo
             wx.navigateTo({
              url: `../blog-edit/blog-edit?nickName=${userInfo.nickName}&avatarUrl=${userInfo.avatarUrl}`,
            })
            }
          })
        } else {
          this.setData({
            showLogin: true
          })
        }
      }
    })
  },
  onComment() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
             userInfo=res.userInfo
             this.setData({
               showPopup:true
             })
            }
          })
        } else {
          this.setData({
            showLogin: true
          })
        }
      }
    })
  },
  onSend(){
    this.setData({
      showPopup:false
    })
  },
  onSearch(event){
    keyword=event.detail.keyword
    this.setData({
      blogList: []
    })
    this._getBlogList()
  },
  _getBlogList(){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({         
      name:'blog',            
      data:{
        keyword,
        start:this.data.blogList.length,
        count:10 ,
        $url:'list'
      }
    }).then((res)=>{
      // console.log(res)
      this.setData({
        blogList:this.data.blogList.concat(res.result.data) 
      })
      console.log(this.data.blogList)
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },
  toComment(event){
    wx.navigateTo({
      url: '../comment/comment?blogId='+event.target.dataset.blogid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getBlogList()
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
    this.setData({
      blogList: []
    })
    this._getBlogList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getBlogList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})