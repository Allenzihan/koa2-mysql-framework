
import jwt from 'jsonwebtoken'
import usersService from '../services/usersService'
import request from '../utils/request'
import helper from'../utils/helper'
import md5 from '../utils/crypto'
import { logger } from '../../config/logger.config'

class usersController {
   /**
   * 测试登录接口，没有被jwt拦截
   * 登录成功返回加签的token信息
   */
   static async login(ctx) {
     logger.error('users/login', 'response:', process.env.NODE_ENV) 
     let params = ctx.request.body || ctx.request.query
     let username = escape(params.username)
     let password = escape(params.password)
     if (username && password) {
         try {
            let data = await usersService.getUserInfoByUserId(username)
            if (data[0] && data[0].password === md5(password)){
              let userInfo = {
               userId: data[0].userId,
               username: data[0].username,
               status: data[0].status
              }
              let token = jwt.sign(userInfo, ctx.request.header.publicKey, { expiresIn: '2h' })
              ctx.session.userInfo = userInfo
              helper.responseFormat(ctx, 200, '登录成功', token)
              logger.info('users/login', 'response:', token)     
            } else {
              helper.responseFormat(ctx, 410, '用户名或者密码错误')
              logger.error('users/login', 'response:', '用户名或者密码错误')    
            }       
         } catch (err) {
            helper.responseFormat(ctx, 412, '用户信息查询失败', err)
            logger.error('users/login', 'response:', err)
         }
     } else {
         helper.responseFormat(ctx, 416, '查询参数缺失')
         logger.error('users/login', 'params:', params)
     }
   }

  /**
   * 测试获取用户信息接口。
   * 如果没有获得授信将会被jwt拦截，测试时优先访问以上的login接口完成授信操作
   */
  static async getUserInfoByUserId (ctx) {
     let params =Object.assign({}, ctx.request.query, ctx.request.body)
     let username = escape(params.username)
     // let token = jwt.verify(ctx.headers.authorization.split(' ')[1], ctx.request.header.publicKey)
     console.log('session', ctx.session.userInfo)
     if (username) {
         try {
            let data = await usersService.getUserInfoByUserId(username)
            helper.responseFormat(ctx, 200, '查询成功', data)
            logger.info('users/getUserInfoByUserId', 'response:', data)       
         } catch (err) {
            helper.responseFormat(ctx, 412, '查询失败', err)
            logger.error('users/getUserInfoByUserId', 'response:', err)
         }
     } else {
         helper.responseFormat(ctx, 416, '查询参数缺失')
         logger.error('users/getUserInfoByUserId', 'response:', '查询参数缺失')
     }
  }

  /**
   * 测试从远端请求数据
   * request中有proxy设置
   */
  static async getRemoteData (ctx) {
     const options = {
        method: 'GET',
        path: '/simpleWeather/query'
     }
     let data = await request(options,{city:'苏州', key:'2343423'})
     helper.responseFormat(ctx, 200, '查询成功', data)
  }

  /**
   * 测试从本地读取数据，读取方式采取异步读取
   */
  static async readFiles (ctx) {
      var path = require('path')
      let filepath =path.join(__dirname, '../files/test.json')
      let data = await helper.asyncReadFile (filepath)
      helper.responseFormat(ctx, 200, '查询成功', JSON.parse(data))
   }
}

export default usersController