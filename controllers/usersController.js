const db = require("../db/queries")
const passport = require("passport")
const bcrypt = require('bcryptjs')

exports.homePageGet = async (req,res) => {
    console.log(req.body)
    res.render('index', {
        title: 'Home'
    })
}

// logging in
exports.loginFormGet = async (req, res) => {
    res.render('login', {
        title: "Log In"
    })
}

exports.loginFormPost = async (req, res) => {
    console.log('logging in')
    console.log(req.session)
    try {
        passport.authenticate("local", {
            successRedirect: "/post/posts",
            failureRedirect: "/user/login"
        })
        console.log('authenticated?')
        // res.redirect("/")

    } catch(err) {
        console.log(err)
    }
}

// signing up
exports.signupFormGet = async (req, res) => {
    console.log('this is sign up function')
    res.render('signup', {
        title: 'Sign Up'
    })
}

exports.signupPost = async (req, res, next) => {
    // use passport to store user in session
    try {
        const userInfo = req.body
        userInfo.isMember = false
        userInfo.isAdmin = false
        console.log(userInfo)
        
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            console.log(hashedPassword)
            await db.insertNewUser(userInfo, hashedPassword)
        })

        // if it works, let user know it worked
        res.render("signup", {
            title: 'Sign Up',
            joined: true
        })
    } catch(err) {
        return next(err)
    }

    console.log('profile created')
}