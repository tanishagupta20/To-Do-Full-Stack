const express = require("express")
const app = express()
const session = require("express-session")
const cors = require("cors")
const authRoutes = require('./routes/authRoutes.js')
const todoRoutes = require('./routes/todoRoutes.js')
const cookieParser = require("cookie-parser")
const path = require('path')
const PORT = process.env.PORT || 3001

app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(session({
    secret: "g3hyjerdkj7839&&#@3485r90",
    cookie: { maxAge: 80000 },
    resave: false,
    saveUninitialized: false,
}))
app.use(cors())
app.use(cookieParser())
app.use('/auth', authRoutes)
app.use('/api/todo', todoRoutes)

app.get("/test", (req, res) => {
    res.send("bye :)")
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})