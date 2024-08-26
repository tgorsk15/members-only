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

async function getUserByPost(postId) {
    const { rows } = await pool.query(`
        SELECT * FROM users
        JOIN users_posts ON user_id = id
        WHERE post_id = $1
    `, [postId])

    return rows[0]
}

async function getPostByTitle(title) {
    const { rows } = await pool.query(`
        SELECT * FROM posts
        WHERE title = $1
    `, [title])
            
    return rows[0]
}

async function getAllPosts() {
    const { rows } = await pool.query(`
        SELECT * FROM posts
    `)
    return rows
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
        INSERT INTO posts (title, text)
        VALUES
            ($1, $2)
    `, [postHeader, postContent])
}

async function insertNewReference(userId, postId) {
    const insert = await pool.query(`
        INSERT INTO users_posts (user_id, post_id)
        VALUES
            ($1, $2)
    `, [userId, postId])
}

async function updateMemberStatus( userId, isMember) {
    const updateStatus = await pool.query(`
            UPDATE users
            SET ismember = $2
            WHERE id = $1
        `, [userId, isMember])
}


module.exports = {
    getUserByUsername,
    getUserById,
    getUserByPost,
    getPostByTitle,
    getAllPosts,
    insertNewUser,
    insertNewPost,
    insertNewReference,
    updateMemberStatus
}