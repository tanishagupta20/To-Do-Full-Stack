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

router.post("/login", async (req, res) => {
    try {
        const data = req.body
        const userData = await db.collection("users").findOne({
            username: data.username
        })

        if (!userData) {
            res.status(404).json({
                error: true,
                message: "User not found"
            })
        }
        else {
            if (data.password == userData.password) {
                req.session.username = userData.username

                res.redirect('/auth/verify')
            }
        }
    }
    catch (error) {
        console.log(error.message)
    }
})

router.post("/register", async (req, res) => {
    try {
        const data = req.body
        await db.collection("users").insertOne({
            username: data.username,
            name: data.name,
            email: data.email,
            password: data.password
        })

        res.status(201).json({
            error: false,
            message: "Registered!"
        })
    }
    catch (error) {
        console.log(error.message)
        res.status(500).json({
            error: true,
            message: "Internal server error"
        })
    }
})

router.get('/verify', async (req, res) => {
    try {
        if (!req.session) {
            res.status(403).json({
                error: true,
                message: "Unauthorized access"
            })
        }
        else {
            const token = req.cookies["connect.sid"]
            await db.collection("tokens").insertOne({
                token: token,
                username: req.session.username
            })

            res.status(200).json({
                error: false,
                message: "Logged in!!"
            })
        }
    }
    catch (error) {
        console.log(error.message)
    }
})

router.get("/check", async (req, res) => {
    try {
        const cookieToken = req.cookies["connect.sid"]
        if (cookieToken) {
            const mySession = await db.collection("tokens").findOne({
                token: cookieToken
            })

            if (!mySession) {
                res.status(403).json({
                    error: true,
                    message: "Unauthorized"
                })
            }
            else {
                res.status(200).json({
                    error: false,
                    data: {
                        username: mySession.username
                    }
                })
            }
        }
        else{
            res.status(403).json({
                error : true,
                message : "Unauthorized"
            })
        }
    }
    catch (error) {
        console.log(error.message)
    }
})

router.get('/todo/logout', async (req, res) => {
    try {
        const cookieToken = req.cookies["connect.sid"]
        await db.collection("tokens").deleteOne({
            token : cookieToken
        })
        req.session.destroy()
        res.clearCookie("connect.sid")
        res.status(200).json({
            error: false
        })
    }
    catch (error) {
        console.log(error.message)
    }

})

module.exports = router