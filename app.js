const express = require('express');
const path = require('path')
const app = express();
require('dotenv').config();
// import routers
const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }))

const assetsPath = path.join(__dirname, "public")
app.use(express.static(assetsPath))

// use routers here
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/", indexRouter);



const PORT = process.env.PORT || 4000
console.log(PORT)
app.listen(PORT, () => console.log(`always watchin you on ${PORT}`))