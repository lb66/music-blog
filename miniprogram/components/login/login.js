// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showPopup:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGetUserInfo(event){
      const userInfo=event.detail.userInfo
      if(userInfo){
        this.setData({
          showPopup:false
        })
        this.triggerEvent('loginSuccess',userInfo)
      }else{
        this.triggerEvent('loginFail')
      }
    }
  }
})
