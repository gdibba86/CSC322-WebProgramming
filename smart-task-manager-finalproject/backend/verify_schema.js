const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const promisePool = pool.promise();

async function verify() {
    try {
        // Test the query that was failing
        const [rows] = await promisePool.query('SELECT * FROM users WHERE email = ? OR username = ?', ['test@example.com', 'testuser']);
        console.log('Query executed successfully. Result:', rows);
        console.log('Schema fix verified: email column exists.');
    } catch (error) {
        console.error('Verification failed:', error);
    } finally {
        pool.end();
    }
}

verify();
