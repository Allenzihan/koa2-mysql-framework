import path from 'path'
import koaLogjs from 'koa-log4'

koaLogjs.configure({
    appenders: {
        access: {
          type: 'dateFile',
          pattern: '-yyyy-MM-dd.log', //生成文件的规则
          alwaysIncludePattern: true, //文件名始终以日期区分
          encoding:"utf-8",
          filename: path.join(__dirname, '../logs/access') //生成文件名
        },
        trace: {
          type: 'dateFile',
          pattern: '-yyyy-MM-dd.log',
          alwaysIncludePattern: true, //文件名始终以日期区分
          encoding:"utf-8",
          filename:  path.join(__dirname, '../logs/trace')
        },
        out: {
          type: 'console'
        }
      },
      categories: {
        default: { appenders: [ 'out' ], level: 'info' },
        access: { appenders: [ 'access' ], level: 'info' },
        trace: { appenders: [ 'trace' ], level: 'all'}
      }
})


//记录所有访问级别的日志
export const accessLogger = () => koaLogjs.koaLogger(koaLogjs.getLogger('access'))

//记录所有应用级别的日志
export const logger = koaLogjs.getLogger('trace')