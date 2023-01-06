const db = require('./database')
class Gallery {

    async addGallery(obj){
        const exist = await db('gallery').
            select('id').
            where('name', obj.name)
        if(exist.length != 0){
            return exist[0].id
        }
        const result = await db('gallery').
            insert({
                ownerID: obj.uid,
                name: obj.name,
                originURL: obj.originURL,
                collectID: obj.collectID
            })
        return result[0]
    }
    async updateTotalPage(galleryID, totalpage){
        await db('gallery').
            where('id', galleryID).
            update('totalPage', totalpage)
    }
    async addGallerytoCollect(galleryID, collectID){
        await db('gallery').
            where({id: galleryID}).
            update({collectID: collectID})
    }
    async getUserGalleryList(userId){
        const result = await db({g: 'gallery'}).
            select('g.id', 'g.name').
            where('g.ownerID', userId)
        
        let processed = []
        if(result){
            for(let i of result){
                processed.push({
                    galleryID: i.id,
                    name: i.name
                })
            }
        }
        return processed
    }

    async getSrcByID(galleryID){
        const result = await db({g: 'gallery'}).
            select('g.name', 'g.originURL').
            where('g.id', galleryID).
            first()
        if(result){
            return {
                galleryID: galleryID,
                name: result.name,
                originURL: result.originURL
            }
        }
        return {}
            
    }
    async getInfoByID(galleryID){
        const result = await db({g: 'gallery'}).
            select('g.name', 'g.originURL', 'g.totalPage').
            where('g.id', galleryID).
            first()
        
        if(result){
            return {
                galleryID: galleryID,
                name: result.name,
                originURL: result.originURL,
                totalPage: result.totalPage
            }
        }
        return {}
            
    }

    async addPage(galleryID, pageNum){
        const exist = await db('gallery').
            select('id').
            where('galleryID', galleryID).
            andWhere('num', pageNum)
        if(exist.length != 0){
            return 
        }
        await db({p: 'pages'}).
            insert({galleryID: galleryID, num: pageNum})
    }

    async getImgSrcByPage(galleryID, pageNum){
        const result = await db({p: 'pages'}).
            select('p.srcURL').
            where('p.galleryID', galleryID).
            andWhere('p.num', pageNum).
            first()

        if(result){
            return {
                downlaodURL: result.srcURL
            }
        }
        return {}
    }
}

module.exports = new Gallery()