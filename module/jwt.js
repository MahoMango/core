const fs = require('fs')
const path = require('path')
const publicKey = fs.readFileSync(path.join(__dirname+'/../keys/jwtRS256.key.pub'))
const privateKey = fs.readFileSync(path.join(__dirname+'/../keys/jwtRS256.key'))
const jwt = require('jsonwebtoken')

class JWT {
    verifyJWT(token){
        try {
            let decoded = jwt.verify(token, publicKey, {algorithms: ['RS256']});
            return {
                userId: decoded.userId,
                level: decoded.level,
                name: decoded.name 
            }
        } catch(err) {
            return {}
        }
    }

    signJWT(obj){
        const token = jwt.sign({ 
            userId: obj.userId,
            level: obj.level,
            name: obj.name 
        }, privateKey, { algorithm: 'RS256', expiresIn: '30d'})

        return token
    }
}

module.exports = new JWT()
