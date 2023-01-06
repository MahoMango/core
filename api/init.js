const express = require('express')
const cookieParser = require('cookie-parser')
const config = require('config')
const router = express.Router()
const JWT = require('./../module/jwt')

router.use(express.json())
router.use(cookieParser())

router.use((req, res, next) => {
    const whitelist = config.get('system.corsDomain') || []
    const origin = req.headers.origin || ''

    if (whitelist.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin)
        res.setHeader('Access-Control-Allow-Methods', 'PUT,GET,POST,DELETE,OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        res.setHeader('Access-Control-Allow-Credentials', 'true')

        if(req.method === "OPTIONS"){
            return res.status(200).end()
        }
    }

    next()
})

router.use(async (req, res, next) => {
    req.uid = -1

    const path = '' + req.path
    if (req.cookies && req.cookies.jwt) {
        const token = req.cookies.jwt
        
        const result = JWT.verifyJWT(token)
        if(result.userId){
            req.uid = result.userId
            req.level = result.level
        } 
    }
    if (path.startsWith('/auth') || req.uid > 0) return next()
    
    res.status(403).json({
        code: -1,
        msg: 'Access denied',
        data: {}
    })
})

router.use('/auth', require('./route/auth'))
router.use('/collection', require('./route/collection'))
router.use('/gallery', require('./route/gallery'))
router.use('/task', require('./route/task'))

router.all('*', (req, res) => {
    res.status(404).json({
        code: -2,
        msg: 'Not found',
        data: {}
    })
})

module.exports = router