// 云函数入口文件
const cloud = require('wx-server-sdk')
const baseUrl = 'http://neteasecloudmusicapi.zhaoboy.com'
const TcbRouter = require('tcb-router')
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
    ctx.body = await rp(baseUrl + '/playlist/detail?id=' + parseInt(event.playlistId))
      .then((res) => {
        return JSON.parse(res)
      })
  })
  app.router('musicUrl', async (ctx, next) => {
    ctx.body = await rp(baseUrl + `/song/url?id=${event.musicId}`)
      .then((res) => {
        return res
      })
  })
  app.router('lyric', async (ctx, next) => {
    ctx.body = await rp(`https://api.no0a.cn/api/cloudmusic/lyric/${event.musicId}`)
      .then((res) => {
        return res
      })
  })
  return app.serve()

}