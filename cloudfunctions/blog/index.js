// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  app.router('list', async (ctx, next) => {
    const keyword=event.keyword
    let searchContent={}
    if(keyword){
      searchContent={
        content:cloud.database().RegExp({
          regexp:keyword,
          options:'i'//忽略大小写
        })
      }
    }
    ctx.body = await cloud.database().collection('blog').where(searchContent)
      .skip(event.start).limit(event.count)
      .orderBy('createTime', 'desc').get()
      .then((res) => {
        return res
      })
  })
  return app.serve()
}