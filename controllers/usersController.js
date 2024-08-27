const db = require("../db/queries")
const passport = require("passport")
const bcrypt = require('bcryptjs')
const { body, validationResult } = require("express-validator")

const nameErr = "First and Last name both need to be between 2 and 20 characters"
const usernameErr = "Username must be between 5 and 25 characters"
const passwordErr = "Password must be at least 7 character long"

const validateUser = [
    body("firstName").trim()
        .isLength({ min: 2, max: 20 }).withMessage(nameErr),
    body("lastName").trim()
        .isLength({ min: 2, max: 20 }).withMessage(nameErr),
    body("username").trim()
        .isLength({ min: 5, max: 25}).withMessage(usernameErr),
    body("password").trim()
    .isLength({ min: 7 }).withMessage(passwordErr)
        .custom((value) => {
            const specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if (!specialChar.test(value)){
                throw new Error("Password must include at least one special character")
            }
            return true
        })
]

const secretErr = "Wrong Password"

const validateCode = [
    body("clubhouseCode").trim()
        .custom((value) => {
            value === process.env.CLUB_SECRET;
            return true
        }).withMessage(secretErr)
]


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
exports.logoutGet = async (req, res, next) => {
    console.log('logging out')
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        res.redirect("/")
    })
}


// signing up
exports.signupFormGet = async (req, res) => {
    console.log('this is sign up function')
    res.render('signup', {
        title: 'Sign Up'
    })
}

exports.signupPost = [
    validateUser,
    async (req, res, next) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).render("signup", {
                    title: "Sign Up",
                    errors: errors.array()
                })
            };

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
    }
]

// membership status
exports.membershipFormGet = async (req, res) => {
    res.render("membership", {
        title: "Member Status",
        user: req.user,
        repeatMember: false
    })
}

exports.membershipFormPost = [
    validateCode,
    async (req, res, next) => {
        try {
            console.log(req.user)
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).render("membership", {
                    title: "Member Status",
                    user: req.user,
                    repeatMember: false,
                    errors: errors.array()
                })
            };
            req.user.ismember = false
            if (req.user.ismember) {
                return res.render("membership", {
                    title: "Member Status",
                    user: req.user,
                    repeatMember: true
                })
            }

            // if it works, update user status
            const isMember = true
            const makeMember = await db.updateMemberStatus(req.user.id, isMember)
            console.log('congrats you\'re in')

            res.render("membership", {
                title: "Member Status",
                user: req.user,
                repeatMember: false,
                memberSuccess: true
            })


        } catch(err) {
            return next(err)
        }
    }
]

    

