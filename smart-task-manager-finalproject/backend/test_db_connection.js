const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

// Try to load .env from root
const result = dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (result.error) {
    console.error('Error loading .env file:', result.error);
} else {
    console.log('.env file loaded successfully');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_PASSWORD type:', typeof process.env.DB_PASSWORD);
    console.log('DB_PASSWORD length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 'undefined');
    console.log('DB_PASSWORD value (quoted):', `'${process.env.DB_PASSWORD}'`);
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
    } else {
        console.log('Connected to MySQL database successfully!');
        connection.release();
    }
    process.exit();
});
