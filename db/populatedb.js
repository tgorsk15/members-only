const { Client } = require('pg');
require('dotenv').config();

const resetTables = `
    DROP TABLE IF EXISTS users_posts;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS posts;
`

const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        first_name VARCHAR(20) NOT NULL,
        last_name VARCHAR(20) NOT NULL,
        username VARCHAR(25) NOT NULL,
        password VARCHAR(150) NOT NULL,
        isMember BOOLEAN NOT NULL,
        isAdmin BOOLEAN NOT NULL
    )
`

const createPostsTable = `
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        title VARCHAR(100) NOT NULL,
        text VARCHAR (400) NOT NULL,
        time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`

const createUsersToPosts = `
    CREATE TABLE IF NOT EXISTS users_posts (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, post_id)
    )
`

async function main() {
    console.log('running tables')
    try {
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        })

        await client.connect()
        // insert call to reset function here
        await client.query(resetTables);

        const users = await client.query(createUsersTable);
        console.log(users)

        const posts = await client.query(createPostsTable);
        console.log(posts)

        const userToPosts = await client.query(createUsersToPosts);
        console.log('created reference table')

    } catch(err) {
        console.log(err)
    }
}

main()