import sqlHelper from '../utils/sqlHelper.js'

class usersModel {
    
   static async getUserInfoByUserId (username) {
        return await sqlHelper.execute('SELECT * FROM users where username = ?', username)
    }
}

export default usersModel