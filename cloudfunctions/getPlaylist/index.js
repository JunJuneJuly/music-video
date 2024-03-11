// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const MAX_SIZE = 100
const db = cloud.database()
const axios = require('axios')
const URL = 'https://apis.imooc.com/personalized?icode=836DEC452E8A792B'
const playlistCollection = db.collection('playlist')
// 云函数入口函数
exports.main = async (event, context) => {
  //获取云数据库的数据
  const countResult = await playlistCollection.count()
  const total = countResult.total
  const totalTimes = Math.ceil(total/MAX_SIZE)
  const tasks = [];
  for(let i=0;i<totalTimes;i++){
    const promise = await playlistCollection.skip(i*MAX_SIZE).limit(MAX_SIZE).get()
    tasks.push(promise)
  }
  let list = []
  if(tasks.length > 0){
    list = (await Promise.all(tasks)).reduce((acc,cur)=>{
      return acc.data.concat(cur.data)
    })
  }
  const {data} = await axios.get(URL)
  if(data.code >= 1000){
    return 0;
  }
  const playlist = data.result;
  const newData = [];
  // 去重
  for(let i=0;i<playlist.length;i++){
    let flag = true;
    for(let j=0;j<list.length;j++){
      if(playlist[i].id == list[j].id){
        flag = false;
        break
      }
    }
    if(flag){
      let p = playlist[i];
      p.createTime = db.serverDate()
      newData.push(playlist[i])
    }
  }
  //批量插入
  if(newData.length > 0){
    await playlistCollection.add({
      data:newData
    })
  }
  return newData.length
}