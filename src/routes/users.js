import koaRouter from 'koa-router'
import usersController from '../controllers/usersController'

const router = koaRouter()
/**
 * 接口路径加前缀，如访问时使用 http://localhost:3000/users/getUserInfoByUserId
 */
router.prefix('/users')

// 测试登录
router.post('/login', usersController.login)

// 测试读取数据库
router.get('/getUserInfoByUserId', usersController.getUserInfoByUserId)

// 测试访第三方接口
router.get('/getRemoteData', usersController.getRemoteData)

// 测试本地读取文件数据
router.get('/readFiles', usersController.readFiles)

export default router
