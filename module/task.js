const db = require('./database')
class Task {
    async getAllTask(){
        const result = await db({t: 'tasks'}).
            select('t.id', 't.galleryID', 't.completed', 't.name').
            where('t.completed','!=', 1)
        let processed = []
        if(result){
            for(let i of result){
                processed.push({
                    taskID: i.id,
                    galleryID: i.galleryID,
                    completed: i.completed,
                    name: i.name
                })
            }
        }
        return processed
    }

    async addTask(galleryID, name){
        const exist = await db('tasks').
            select('id').
            where('galleryID', galleryID)
        if(exist.length != 0){
            return 
        }
        await db("tasks").insert({galleryID: galleryID, name: name})
    }

    async finishTask(galleryID){
        await db("tasks").
            where({galleryID: galleryID}).
            update({completed: 1})
    }
}

module.exports = new Task()