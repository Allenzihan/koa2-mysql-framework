import sqlHelper from '../utils/sqlHelper.js'

class usersService {
    
   static async getUserInfoByUserId (username) {
        return await sqlHelper.execute('SELECT * FROM users where username = ?', username)
    }
}

export default usersService