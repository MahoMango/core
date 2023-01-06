const express = require('express')
const router = express.Router()
const JWT = require('./../../module/jwt')
const user = require('./../../module/user')

router.post('/login', async (req, res) => {
    const body = req.body
    if(body && body.username && body.password){
        const result = await user.login(body.username, body.password)

        if(result.userId){
            const token = JWT.signJWT(result)
            res.cookie('jwt', token, {
                maxAge: (new Date()).getTime() / 1000 + 1000 * 3600 * 24 * 30,
                path: '/',
                sameSite: 'none', secure: true, httpOnly: true
            })

            res.json({
                code: 0,
                msg: "Success",
                data: {
                    userId: result.userId,
                    name: result.name
                }
            })
            return
        }

        res.json({
            code: -1,
            msg: 'Username or password wrong',
            data: {}
        })
        return
        
    }
    res.json({
        code: -2,
        msg: 'Invalid body',
        data: {}
    })
})

router.get('/check', async (req, res) => {
    let result = false
    if(req.uid && req.uid>0) result = true

    if(result){
        res.json({
            code: 0,
            msg: "Success",
            data: {
                isLogin: true,
                level: req.level
            }
        })
    }else{
        res.json({
            code: 0,
            msg: "Success",
            data: {
                isLogin: false,
            }
        })
    }
})

router.get('/logout', (req, res) => {
    res.cookie('jwt', '', {expires: new Date(0), path: '/'})
    res.json({
      code: 0,
      msg: 'Success',
      data: {}
    })
    return
})

module.exports = router