# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

# 笔记

1）代码规范

- 定义变量，使用const 和 let

- 定义对象时，把略写的属性放前，详写的属性放后。例如：

  ```js
  let username = 'zhangsan'
  let obj = {
      username,
      age:13
  }
  ```

- 使用箭头函数

- 参考`airbnb`代码规范

  ![](./imgs\image-20240215135629267.png)
