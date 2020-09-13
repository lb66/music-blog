// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const result = await cloud.openapi.subscribeMessage.send({
    touser: event.openId,
    page: `/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
    data: {
      name2: {
        value: event.user
      },
      thing3: {
        value: event.content
      },
    },
    templateId: '2Uhc312MBZFkLHsUwvdbFX-ll3kPgr1_mrsU5IeUk6Q',
    miniprogramState: 'developer' //开发版
  })
  return result
}