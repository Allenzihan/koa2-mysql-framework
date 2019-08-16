import crypto from 'crypto'

/**
 * 使用MD5方式加密数据
 * @param {} data 
 */
const md5 = data => {
  return crypto.createHash('md5').update(data, 'utf-8').digest('hex')
}

export default md5