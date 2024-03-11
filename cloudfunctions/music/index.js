// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const playlistCollection = db.collection('playlist')
const tcbRouter = require('tcb-router')
const axios = require('axios')
const BASE_URL = 'https://apis.imooc.com'
const imooc = 'icode=836DEC452E8A792B'
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new tcbRouter({ event})
  // 获取唱片：设置开始和结束位置，获取后再根据时间排序
  app.router('playlist', async (ctx, next) => {
    ctx.body = await playlistCollection.skip(event.start)
    .limit(event.count)
    .orderBy('createTime','desc')
    .get()
    .then((res)=>{
      return res
    })
  })
  //根据唱片id，获取歌单列表
  app.use('musiclist',async(ctx,next)=>{
    const res = 
      await axios.get(`${BASE_URL}/playlist/detail?id=${parseInt(event.playlistId)}&${imooc}`)
    ctx.body = res.data
  })
  //音乐地址
  app.use('musicUrl',async(ctx,next)=>{
    const res = 
      await axios.get(`${BASE_URL}/song/url?id=${parseInt(event.musicId)}&${imooc}`)
    ctx.body = res.data
  })
  //歌词 
  app.use('lyric',async(ctx,next)=>{
    const res = 
      await axios.get(`${BASE_URL}/lyric?id=${parseInt(event.musicId)}&${imooc}`)
    ctx.body = res.data
  })
  return app.serve();
}