const cheerio = require("cheerio");
const puppeteer = require('puppeteer');
const collection = require('./collection')
const gallery = require('./gallery')
const task = require('./task')
const https = require('https')
const fs = require('fs');
const path = require("path");
class Crawler {
    async getMetaData(url){
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url);
        const content = await page.content();
        const $ = cheerio.load(content);
        const result = []
        const list = $("a[class='chapteritem']")
        for(let i=0; i<list.length; i++){
            const id = list.length-i
            const item = list.eq(i)
            const src = "https://www.manhuaren.com" + item.attr("href")
            const name = item.text()
            result.push({id, src, name})
        }
        const title = $("p[class='detail-main-info-title']").text()
        const imgSrc = $("div[class='detail-main-cover'] > img").attr("src")
        await browser.close()
        return {
            title,
            imgSrc,
            url,
            chapter: [...result.reverse()]
        }
    }
    async downloadGallery(galleryID){
        const info = await gallery.getSrcByID(galleryID)
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(info.originURL, {
            headers:{
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
            }
        });
        await page.waitForSelector("img[class='lazy']")
        let content = await page.content();
        let $ = cheerio.load(content);
        const totalPage = parseInt($("p[class='view-fix-top-bar-title']").text().split('/')[1])
        fs.mkdir(path.join('./static/image', String(galleryID)), (err) => {
            if (err) {
                return
            }
            console.log('Directory created successfully!');
        })
        for(let i=1; i<=totalPage; i++){
            const file = fs.createWriteStream(path.join('./static/image', String(galleryID), String(i)+'.jpg'))
            let imgURL = $("img[class='lazy']").attr('src')
            while(imgURL.split('/').at(-1) == "page_default_img.png"){
                content = await page.content()
                $ = cheerio.load(content);
                imgURL = $("img[class='lazy']").attr('src')
            }
            https.get(imgURL, {
                headers:{
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
                }
            }, function(res){
                res.pipe(file)
                file.on("finish", () => {
                    file.close();
                    console.log(String(info.name)+'/'+String(i)+' download completed!')
                })
            })
            await page.evaluate(function(){nextPage()})
            content = await page.content()
            $ = cheerio.load(content);
        }
        await gallery.updateTotalPage(galleryID, totalPage)
        await browser.close()
        
    }
    async downloadCollect(uid, obj){
        const collectID = await collection.addCollection({
            uid: uid,
            name: obj.title,
            originURL: obj.originURL,
            imgSrc: obj.imgSrc
        })
        const galleryList = obj.data.sort((a, b) => a.id - b.id)
        for(let item of galleryList){
            const galleryID = await gallery.addGallery({
                uid: uid,
                name: obj.title + ' ' + item.name,
                originURL: item.src,
                collectID: collectID
            })
            await task.addTask(galleryID, obj.title +" "+item.name)
        }
    }
}

module.exports = new Crawler()
