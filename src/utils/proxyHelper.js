import httpProxy from 'http-proxy-middleware'
import k2c from 'koa2-connect'
import config from '../../config/proxy.config'

/**
 * 根据不同的环境配置代理路径，处理代理请求
 * @param {*} ctx 
 * @param {*} next 
 */
const proxyHelper = (ctx, next) => {
    return k2c(httpProxy(config[process.env.NODE_ENV]))(ctx, next)
}

export default proxyHelper 