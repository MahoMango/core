const express = require('express')
const router = express.Router()
const task = require("../../module/task")
const crawler = require('../../module/crawler')

router.get("/", async (req, res) => {
    const taskList = await task.getAllTask()
    res.json({
        code: 0,
        msg: "Success",
        data: [
            ...taskList
        ]
    })
})

router.post("/metadata", async (req, res) => {
    const body = req.body
    if(body && body.url && body.url!=""){
        crawler.getMetaData(body.url).then((result) => {
            res.json({
                code: 0,
                msg: "Success",
                data: {
                    ...result
                }
            })
        }).catch((err) => {
            console.error(err)
            res.json({
                code: -1,
                msg: "URL are wrong!",
                data: {}
            })
        })
        return
    }
    res.json({
        code: -2,
        msg: 'Invalid body',
        data: {}
    })
})

router.post("/download", async (req, res) => {
    const body = req.body
    if(body && body.data){
        crawler.downloadCollect(req.uid, body)
        res.json({
            code: 0,
            msg: "Success",
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

module.exports = router