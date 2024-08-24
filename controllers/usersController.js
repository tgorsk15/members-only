const db = require("../db/queries")
const passport = require("passport")
const bcrypt = require('bcryptjs')

exports.homePageGet = async (req,res) => {
    console.log(req.body)
    console.log('here is user', req.user)
    res.render('index', {
        title: 'Home',
        user: req.user
    })
}

// logging in
exports.loginFormGet = async (req, res) => {
    console.log(req.session)
    let message = ''
    if (req.session.messages && req.session.messages.length > 0) {
        message = req.session.messages[0]
    }
    if (message.length > 1 && message) {
        message = message.charAt(0).toUpperCase() + message.slice(1)   
    }
    console.log(message)
    req.session.messages = []

    res.render('login', {
        title: "Log In",
        message: message
    })
}

exports.loginFormPost = async (req, res) => {
    console.log('logging in')
    console.log(req.session)
    try {
        console.log('authenticated?')

    } catch(err) {
        console.log(err)
    }
}

//logout
exports.logoutGet = async (req, res) => {
    console.log('logging out')
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