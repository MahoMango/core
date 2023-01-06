const express = require('express')
const history = require('connect-history-api-fallback');
const router = express.Router()
const path = require('path');

router.use(express.static( __dirname + '/dist'));

router.use(history({
    index: '/'
}))
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/dist/index.html'))
})

module.exports = router