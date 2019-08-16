import koaRouter from 'koa-router'
import proxyHelper from '../utils/proxyHelper'

const router = koaRouter()
/**
 * 需要代理的接口配置类，直接转发至第三方去获取请求数据
 * 测试访问：http://localhost:3000/old/api/loginStatus
 */

const proxyApi = {
  get: ['/old/api/**'],
  post: ['/post/old/api/**']
}

router.get(proxyApi.get, async(ctx, next) => {
    ctx.respond = false
    await proxyHelper(ctx, next)
})

router.post(proxyApi.post, async(ctx, next) => {
    ctx.respond = false
    await proxyHelper(ctx, next)
})

export default router