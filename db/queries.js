const { use } = require('passport')
const pool = require('./pool')

async function getUserByUsername(username) {
    const { rows } = await pool.query(`
        SELECT * FROM users
        WHERE username = $1
    `, [username])
            
    return rows[0]
}

async function getUserById(id) {
    const { rows } = await pool.query(`
        SELECT * FROM users
        WHERE id = $1
    `, [id])
            
    return rows[0]
}

async function insertNewUser(userInfo) {
    const insert = await pool.query(`
        INSERT INTO users (first_name, last_name, username, password, ismember, isadmin)
        VALUES
            ($1, $2, $3, $4, $5, $6)
    `, [userInfo.firstName, userInfo.lastName, userInfo.username, 
        userInfo.password, userInfo.isMember, userInfo.isAdmin])
}

// possible map: an entry into user_messages table does not
// have to be inserted until a new message is actually created

module.exports = {
    getUserByUsername,
    getUserById,
    insertNewUser
}