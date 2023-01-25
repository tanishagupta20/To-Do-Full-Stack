const { Router } = require("express")
const router = Router()
const client = require("mongodb").MongoClient

let db;

client.connect("mongodb+srv://sys:admin@cluster0.bonln7e.mongodb.net/?retryWrites=true&w=majority", (error, database) => {
    if (error) {
        console.log(error.message) 
    }
    else {
        db = database.db("test")
        console.log("Ho gaya connect :)")
    }
})

router.get('/getTasks', async (req, res) => {
    try {
        const cookieToken = req.cookies["connect.sid"]
        const tokenDoc = await db.collection("tokens").findOne({
            token: cookieToken
        })

        if (!tokenDoc) {
            res.status(403).json({
                error: true,
                message: "unauthorized access"
            })
        }
        else {
            const usn = tokenDoc.username
            const taskDoc = await db.collection("tasks").findOne({
                username: usn
            })

            if (!taskDoc) {
                res.status(200).json({
                    error: false,
                    data: []
                })
            }
            else {
                res.status(200).json({
                    error: false,
                    data: taskDoc
                })
            }
        }
    }
    catch (error) {
        console.log(error.message)
    }
})

router.post('/addTasks', async (req, res) => {
    try {
        let taskObject = req.body
        const cookieToken = req.cookies["connect.sid"]
        const tokenDoc = await db.collection("tokens").findOne({
            token: cookieToken
        })

        if (!tokenDoc) {
            res.status(403).json({
                error: true,
                message: "Unauthorized access"
            })
        }
        else {
            const usn = tokenDoc.username
            const taskDoc = await db.collection("tasks").findOne({
                username: usn
            })

            if (taskDoc) {
                taskObject._id = Date.now()
                await db.collection("tasks").updateOne(
                    { username: usn },
                    { $push: { list: taskObject }, $inc: { totalTasks: 1 } }
                )
            }
            else {
                taskObject._id = Date.now()
                await db.collection("tasks").insertOne({
                    username: usn,
                    list: [taskObject],
                    totalTasks: 1
                })
            }

            const updatedTaskDoc = await db.collection("tasks").findOne({
                username: usn
            })

            res.status(201).json({
                error: false,
                data: updatedTaskDoc
            })
        }
    }
    catch (error) {
        console.log(error.message)
    }
})

router.post('/delTask', async (req, res) => {
    try {
        let taskObject = req.body
        let id = taskObject._id
        const cookieToken = req.cookies["connect.sid"]
        const tokenDoc = await db.collection("tokens").findOne({
            token: cookieToken
        })

        if (!tokenDoc) {
            res.status(403).json({
                error: true,
                message: "Unauthorized access"
            })
        }
        else {
            const usn = tokenDoc.username
            const taskDoc = await db.collection("tasks").findOne({
                username: usn
            })

            const taskList = taskDoc.list

            let updatedList = taskList.filter((task) => {
                if (task._id != id) {
                    return true;
                }
            })

            // console.log(updatedList)

            await db.collection("tasks").updateOne(
                { username: usn },
                { $set: { list: updatedList }, $inc: { totalTasks: -1 } }
            )

            const updatedTaskDoc = await db.collection("tasks").findOne({
                username: usn
            })

            res.status(200).json({
                error: false,
                data: updatedTaskDoc
            })

        }
    }
    catch (error) {
        console.log(error.message)
    }
})

router.post('/updateTask', async (req, res) => {
    try {
        let taskObject = req.body
        let id = taskObject._id
        let newVal = taskObject.newVal
        const cookieToken = req.cookies["connect.sid"]
        const tokenDoc = await db.collection("tokens").findOne({
            token: cookieToken
        })

        if (!tokenDoc) {
            res.status(403).json({
                error: true,
                message: "Unauthorized access"
            })
        }
        else {
            const usn = tokenDoc.username

            await db.collection("tasks").updateOne(
                {
                    username: usn,
                    "list._id": id
                },
                {$set : {"list.$.name" : newVal}}
            )

            const updatedTaskDoc = await db.collection("tasks").findOne({
                username: usn
            })

            res.status(200).json({
                error: false,
                data: updatedTaskDoc
            })

        }
    }
    catch (error) {
        console.log(error.message)
    }
})

module.exports = router