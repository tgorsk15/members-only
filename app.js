const express = require('express');
const path = require('path')
const app = express();
const session = require('express-session')
const pool = require('./db/pool')
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport')

require('dotenv').config();
require('./auth/passport')

// set up store
const sessionStore = new pgSession({
    pool: pool,
    createTableIfMissing: true
})
console.log(sessionStore)

// import routers
const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }))

// set up session:
app.use(session({
    store: sessionStore,
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

// ensure passport is used
app.use(passport.session())


const assetsPath = path.join(__dirname, "public")
app.use(express.static(assetsPath))

// use routers here
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/", indexRouter);


const PORT = process.env.PORT || 4000
console.log(PORT)
app.listen(PORT, () => console.log(`always watchin you on ${PORT}`))