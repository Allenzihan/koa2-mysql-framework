import mysql from 'mysql'
import config from '../../config/db.config'

/**
 * 数据库连接帮助类
 */
export default class sqlHelper {
    static getPool () {
        return mysql.createPool(config[process.env.NODE_ENV])
    }
    static execute (sql, values) {
        return new Promise((resolve, reject) => {
            sqlHelper.getPool().getConnection((err, conn) => {
                if (err) return reject(err)
                conn.query(sql, values, (err, rows) => {
                    if (err) reject(err)
                    else resolve(rows)
                    conn.release()
                })
            })
        })
    }
    /**
     * 查询
     * @param {*} sql 
     * @param {*} values 
     */
    query (sql, values) {
      return sqlHelper.execute(sql, values)
    }
    /**
     * 插入
     * @param {*} sql 
     * @param {*} values 
     */
    insert (sql, values) {
        return sqlHelper.execute(sql, values)
    }
     /**
     * 更新
     * @param {*} sql 
     * @param {*} values 
     */
    update (sql, values) {
    return sqlHelper.execute(sql, values)
    }
     /**
     * 删除
     * @param {*} sql 
     * @param {*} values 
     */
    delete (sql, values) {
    return sqlHelper.execute(sql, values)
    }
    /**
     *从数据库中查询一条数据，返回值是对象，而非数组
     *最好在sql语句中加一个唯一的限制条件
     */
    // get (sql, values) {
    //     try {
    //         return q(sql, values).then(rows => {
    //             if (rows.length >= 1) {
    //                 return rows[0]
    //             }
    //         })
    //     } catch (err) {
    //         return new Promise((resolve, reject) => {
    //             reject(err)
    //         })
    //     }
    // }    
}