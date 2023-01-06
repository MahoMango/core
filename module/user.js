const db = require('./database')

class User {
    async login(usr, pwd){
        const result = await db("users").where({
            'name': usr,
            'password': pwd
        }).first()

        if(result){
            return {
                userId: result.id,
                name: usr,
                level: result.level
            }
        }
        return {}
    }

    async getUserInfo(userId){
        const result = await db({u: 'users'}).
            where("u.id", userId).
            first()

        if(result){
            return {
                userId: result.id,
                name: usr,
                level: result.level
            }
        }
        return {}
    }

}

module.exports = new User()