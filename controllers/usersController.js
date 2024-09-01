const db = require("../db/queries")
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
const adminErr = "Wrong Code"

const validateCode = [
    body("clubhouseCode").trim()
        .custom((value) => {
            if (value !== process.env.CLUB_SECRET) {
                throw new Error(secretErr)
            }
            return true
        })
]

const validateAdmin = [
    body("adminCode").trim()
        .custom((value) => {
            if (value !== process.env.ADMIN_SECRET) {
                throw new Error(adminErr)
            }
            return true
        })
]



exports.homePageGet = async (req,res) => {
    console.log('here is user', req.user)
    res.render('index', {
        title: 'Home',
        user: req.user
    })
}

// logging in
exports.loginFormGet = async (req, res) => {
    let message = ''
    if (req.session.messages && req.session.messages.length > 0) {
        message = req.session.messages[0]
    }
    if (message.length > 1 && message) {
        message = message.charAt(0).toUpperCase() + message.slice(1)   
    }
    req.session.messages = []

    res.render('login', {
        title: "Log In",
        message: message
    })
}

exports.loginFormPost = async (req, res) => {
    console.log('logging in')
    try {

    } catch(err) {
        console.log(err)
    }
}

//logout
exports.logoutGet = async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        res.redirect("/")
    })
}


// signing up
exports.signupFormGet = async (req, res) => {
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
            
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                console.log(hashedPassword)
                await db.insertNewUser(userInfo, hashedPassword)
            })

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
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).render("membership", {
                    title: "Member Status",
                    user: req.user,
                    repeatMember: false,
                    errors: errors.array()
                })
            };

            if (req.user.ismember) {
                return res.render("membership", {
                    title: "Member Status",
                    user: req.user,
                    repeatMember: true
                })
            }
            const isMember = true
            const makeMember = await db.updateMemberStatus(req.user.id, isMember)

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


// admin status
exports.adminFormGet = async (req, res) => {
    res.render("admin", {
        title: 'Admin Status',
        user: req.user,
        repeatAdmin: false
    })
}

exports.adminFormPost = [
    validateAdmin,
    async (req, res, next) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                console.log('failing')
                return res.status(400).render("admin", {
                    title: "Admin Status",
                    user: req.user,
                    repeatAdmin: false,
                    errors: errors.array()
                })
            };

            if (req.user.isadmin) {
                return res.render("admin", {
                    title: "Admin Status",
                    user: req.user,
                    repeatAdmin: true
                })
            }

            const isAdmin = true
            const makeAdmin = await db.updateAdminStatus(req.user.id, isAdmin)
            console.log('now admin')

            res.render("admin", {
                title: "Admin Status",
                user: req.user,
                repeatAdmin: false,
                adminSuccess: true
            })

        } catch(err) {
            return next(err)
        }
    }
]

    

