// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  app.router('list', async (ctx, next) => {
    const keyword = event.keyword
    let searchContent = {}
    let searchName = {}
    if (keyword) {
      searchContent = {
        content: db.RegExp({
          regexp: keyword,
          options: 'i' //忽略大小写
        }),
      }
      searchName = {
        nickName: db.RegExp({
          regexp: keyword,
          options: 'i' //忽略大小写
        })
      }
    }
    ctx.body = await db.collection('blog').where(db.command.or(
        [searchContent, searchName]
      ))
      .skip(event.start).limit(event.count)
      .orderBy('createTime', 'desc').get()
      .then((res) => {
        return res
      })
  })
  app.router('detail', async (ctx, next) => {
    let detail = await db.collection('blog')
      .where({
        _id: event.blogId
      }).get()
      .then((res) => {
        return res.data
      })
    //评论查询
    const count = await db.collection('blog-comment').count()
    const total = count.total
    let commentList = {
      data: []
    }
    if (total > 0) {
      const batchTimes = Math.ceil(total / 100)
      const tasks = []
      for (let i = 0; i < batchTimes; i++) {
        let promise = db.collection('blog-comment').skip(i * 100).limit(100).where({
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

  const wxContext = cloud.getWXContext()
  app.router('myblog', async (ctx, next) => {
    ctx.body = await db.collection('blog').where({_openid:wxContext.OPENID})
    .skip(event.start).limit(event.count)
    .orderBy('createTime', 'desc').get()
    .then((res) => {
      return res.data
    })
  })

  return app.serve()
}