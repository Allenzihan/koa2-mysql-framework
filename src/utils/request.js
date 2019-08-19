import url from 'url'
import http from 'http'
import bufferHelper from '../utils/bufferHelper'

const config = url.parse(require('../../config/proxy.config')[process.env.NODE_ENV].target)

/**
 * http请求方法封装
 * @param {} options 
 * @param {*} requestData 
 */
const request = (options, requestData) => {
   return new Promise((resolve, reject) => {
    // let responseData = ''
    const buffer = new bufferHelper()
    Object.assign(options, {
        host: config.hostname,
        port: config.port || '80',
        method: options.method || 'POST',
        path: options.path
    })
    options.headers = options.headers || {}

    let req = http.request(options, proxyRes => {
      proxyRes.setEncoding('utf8')
      proxyRes.on('data', chunk => {
        // responseData += chunk
        buffer.concat(Buffer.from(chunk))
      })
      proxyRes.on('end', () => {
        try {
        //   resolve ({
        //       body: responseData,
        //       headers: proxyRes.headers
        //   })
        // resolve(responseData)
        let res = JSON.parse(buffer.toString('utf-8'))
        resolve(res)
        } catch (err) {
            console.log('err', err)
            reject(err)
        }
      })
    })

    req.on('error', err => {
      reject(err)
    })
    req.write(JSON.stringify(requestData))
    req.end()
  })    
}

export default request