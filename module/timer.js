const db = require('./database')
const crawler = require('./crawler')

async function checkTasks(){
    const result = await db({t: 'tasks'}).
            select('t.id', 't.galleryID', 't.completed', 't.name').
            where('t.completed','=', 0).first()
    if(result){
        await db({t: 'tasks'}).
        where('t.id', result.id).
        update({completed: -1})
        try{
            await crawler.downloadGallery(result.galleryID)
        }catch(e){
            console.error(e)
            await db({t: 'tasks'}).
                where('t.id', result.id).
                update({completed: 0}) 
            return
        }
        
        await db({t: 'tasks'}).
            where('t.id', result.id).
            update({completed: 1}) 
        console.log(String(result.name)+ " complete!")
    }
    
}

module.exports.checkTasks = checkTasks