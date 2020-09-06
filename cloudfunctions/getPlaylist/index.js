// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const rp = require('request-promise')
const URL = 'http://neteasecloudmusicapi.zhaoboy.com/personalized?limit=60'
// 云函数入口函数
exports.main = async (event, context) => {
  const playlist = await rp(URL).then((res) => {
    return JSON.parse(res).result
  })
  await db.collection('playlist').where({
    highQuality: false
  }).remove()
  for (let i = 0, len = playlist.length; i < len; i++) {
    await db.collection('playlist').add({
      data: {
        ...playlist[i],
        createTime: db.serverDate()
      }
    }).then((res) => {
      console.log('success')
    }, (err) => {
      console.log('fail')
    })
  }


}