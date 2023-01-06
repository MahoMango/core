const express = require('express')
const router = express.Router()
const gallery = require("../../module/gallery")

router.get("/", async (req, res) => {
    const galleryList = await gallery.getUserGalleryList(req.uid)
    res.json({
        code: 0,
        msg: "Success",
        data: [
            ...galleryList
        ]
    })
})

router.get("/:galleryID(\\d+)", async (req, res) => {
    const galleryID = req.params.galleryID
    const info = await gallery.getInfoByID(galleryID)
    if(info.galleryID){
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
        msg: "Couldn't found gallery info"
    })
})

router.get("/:galleryID(\\d+)/:pageNum(\\d+)", async (req, res) => {
    const galleryID = req.params.galleryID
    const pageNum = req.params.pageNum
    const result = await gallery.getImgSrcByPage(galleryID, pageNum)
    if(result.downlaodURL){
        res.json({
            code: 0,
            msg: "Success",
            data: {
                ...result
            }
        })
        return
    }
    res.json({
        code: -1,
        msg: "Couldn't found page source"
    })
})

module.exports = router