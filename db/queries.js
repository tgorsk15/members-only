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

async function getPostByTitle(title) {
    const { rows } = await pool.query(`
        SELECT * FROM posts
        WHERE title = $1
    `, [title])
            
    return rows[0]
}

async function insertNewUser(userInfo, hashedPassword) {
    const insert = await pool.query(`
        INSERT INTO users (first_name, last_name, username, password, ismember, isadmin)
        VALUES
            ($1, $2, $3, $4, $5, $6)
    `, [userInfo.firstName, userInfo.lastName, userInfo.username, 
        hashedPassword, userInfo.isMember, userInfo.isAdmin])
}

async function insertNewPost(postHeader, postContent) {
    const insert = await pool.query(`
        INSERT INTO posts (title, text, time)
        VALUES
            ($1, $2, CURRENT_TIMESTAMP)
    `, [postHeader, postContent])
}

async function insertNewReference(userId, postId) {
    const insert = await pool.query(`
        INSERT INTO users_posts (user_id, post_id)
        VALUES
            ($1, $2)
    `, [userId, postId])
}

// possible map: an entry into user_messages table does not
// have to be inserted until a new message is actually created

module.exports = {
    getUserByUsername,
    getUserById,
    getPostByTitle,
    insertNewUser,
    insertNewPost,
    insertNewReference
}