// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter= require('tcb-router')
const rp = require('request-promise')
cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  app.router('playlist', async (ctx, next) => {
    ctx.body = await cloud.database().collection('playlist')
      .skip(event.start).limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res
      })
  })
  app.router('musiclist', async (ctx, next) => {
    ctx.body = await rp('http://neteasecloudmusicapi.zhaoboy.com/playlist/detail?id='+parseInt(event.playlistId))
    .then((res)=>{
      return JSON.parse(res)
    })
  })
  
  return app.serve()

}
// exports.main = async (event, context) => {
  // return await cloud.database().collection('playlist')
  // .skip(event.start).limit(event.count) //start和count是在外面组件中定义的两个属性用来跳过和限制数量
    // .orderBy('createTime', 'desc')  //排序
    // .get().then((res) => {return res})
// }