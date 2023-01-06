const db = require('./database')
class Collection {
    async addCollection(obj){
        const exist = await db('collections').
            select('id').
            where('name', obj.name)
        if(exist.length != 0){
            return exist[0].id
        }
        const result = await db('collections').
            insert({
                ownerID: obj.uid,
                name: obj.name,
                originURL: obj.originURL,
                imgURL: obj.imgSrc
            })
        return result[0]
    }

    async getUserCollectionList(userId){
        const result = await db({c: 'collections'}).
            select('c.id', 'c.name', 'c.imgURL').
            where('c.ownerID', userId)
    
        let processed = []
        if(result){
            for(let i of result){
                processed.push({
                    collectionID: i.id,
                    name: i.name,
                    imgURL: i.imgURL
                })
            }
        }
        return processed
    }

    async _getGallerysByID(collectID){
        const result = await db({g: 'gallery'}).
            select('g.id', 'g.name').
            innerJoin({c: 'collections'}, 'c.id', '=', 'g.collectID').
            innerJoin({t: 'tasks'}, 'g.id', '=', 't.galleryID').
            where('c.id', collectID).
            where('t.completed', 1)
        
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

    async getInfoByID(collectID){
        const result = await db({c: 'collections'}).
           select('c.id', 'c.name', 'c.imgURL', 'c.originURL').
           where('c.id', collectID).
           first()

        if(result){
            const collects = await this._getGallerysByID(collectID)
            return {
                collectID: collectID,
                name: result.name,
                totalCollects: collects.length,
                imgUrl: result.imgURL,
                originURL: result.originURL,
                galleryIDs: [
                    ...collects
                ]
            }
        }

        return {}
    }
}

module.exports = new Collection()