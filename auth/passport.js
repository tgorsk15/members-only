const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../db/queries');

const strategy = new LocalStrategy(async (username, password, done) => {
    try {
        // call search DB query here
        const user = await db.getUserByUsername(username);
        // console.log(user)

        if (!user) {
            return done(null, false, { message: "incorrect username" })
        }

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            return done(null, false, { message: "incorrect password" })
        }
        console.log('username and password worked')
        return done(null,user)

    } catch (err) {
        return done(err)
    }
})

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.getUserById(id)
        // console.log(user)

        done(null, user)
    } catch(err) {
        done(err)
    }
})