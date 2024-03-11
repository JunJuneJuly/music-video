// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()
const blog = db.collection('blog')
const tcbRouter = require('tcb-router')
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new tcbRouter({
    event
  })
  app.router('bloglist', async (ctx, next) => {
    let keywords = event.keywords;
    let w = {};
    if (keywords.trim() != '') {
      w = {
        content: new db.RegExp({
          regexp: keywords,
          options: 'i' //忽略大小写
        })
      }
    }
    ctx.body = await blog.where(w).skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        return res
      })
  })
  //detail

  app.router('detail', async (ctx, next) => {
    let blogId = event.blogId
    console.log(event)
    let detail = await blog.where({
      _id: blogId
    }).get().then(res => {
      return res.data
    })
    let commentList = await db.collection('blog-comment').where({
      blogId: blogId
    }).orderBy('createTime', 'desc').get().then(res => {
      return res.data
    })
    ctx.body = {
      detail,
      commentList
    }
  })
  const wxContext = cloud.getWXContext()
  app.router('getListByOpenid', async (ctx, next) => {
    ctx.body = await blog.where({
      _openid: wxContext.OPENID
    }).skip(event.start).limit(event.count).orderBy('createTime', 'desc').get().then(res => {
      return res.data
    })
  })
  return app.serve()
}