const express = require('express')
const router = express.Router()
const collect = require("../../module/collection")

router.get("/", async (req, res) => {
    const collectList = await collect.getUserCollectionList(req.uid)
    res.json({
        code: 0,
        msg: "Success",
        data: [
            ...collectList
        ]
    })
})

router.get("/:collectID(\\d+)", async (req, res) => {
    const collectID = req.params.collectID
    const info = await collect.getInfoByID(collectID)
    if(info.collectID){
        res.json({
            code: 0,
            msg: "Success",
            data: {
                ...info
            }
        })
        return
    }
    res.json({
        code: -1,
        msg: "Couldn't found collection info"
    })
})

module.exports = router