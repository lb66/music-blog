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
    const keyword = event.keyword
    let searchContent = {}
    if (keyword) {
      searchContent = {
        content: cloud.database().RegExp({
          regexp: keyword,
          options: 'i' //忽略大小写
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
  app.router('detail', async (ctx, next) => {
    let detail = await cloud.database().collection('blog')
      .where({
        _id: event.blogId
      }).get()
      .then((res) => {
        return res.data
      })
    //评论查询
    const count = await cloud.database().collection('blog-comment').count()
    const total = count.total
    let commentList = {
      data: []
    }
    if (total > 0) {
      const batchTimes = Math.ceil(total / 100)
      const tasks = []
      for (let i = 0; i < batchTimes; i++) {
        let promise = cloud.database().collection('blog-comment').skip(i * 100).limit(100).where({
          blogId: event.blogId
        }).orderBy('createTime', 'desc').get()
        tasks.push(promise)
      }
      if (tasks.length > 0) {
        commentList = (await Promise.all(tasks)).reduce((acc, cur) => {
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }
    }
    ctx.body = {
      detail,
      commentList
    }
  })
  return app.serve()
}