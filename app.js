const express = require('express')
const app = express()
const config = require('config')
const { checkTasks} = require('./module/timer')
app.use('/api', require('./api/init'))
app.use('/image', express.static(__dirname + '/static/image'))
app.use('/', require('./static/init'));

app.all('*', (req, res) => {
    res.status(404).json({
        code: -2,
        msg: 'Not found',
        data: {}
    })
})

app.listen(config.get('system.port'), () => {
    console.log(`Mango is listening on port ${config.get('system.port')}!`)
})

setInterval(checkTasks, 10 * 1000)
