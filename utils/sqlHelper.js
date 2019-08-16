import mysql from 'mysql'
import config from '../config/db.config'

/**
 * 数据库连接帮助类
 */
class sqlHelper {
    static getPool () {
        return mysql.createPool(config[process.env.NODE_ENV])
    }
    static async execute (sql, values) {
        return new Promise((resolve, reject) => {
            this.getPool().getConnection((err, conn) => {
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

export default sqlHelper