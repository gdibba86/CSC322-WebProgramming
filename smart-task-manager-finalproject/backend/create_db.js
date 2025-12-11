const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

connection.connect((err) => {
    if (err) {
        console.error('Failed to connect to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL server.');

    connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
        if (err) {
            console.error('Failed to create database:', err);
            process.exit(1);
        }
        console.log(`Database '${process.env.DB_NAME}' created or already exists.`);

        const useDbQuery = `USE ${process.env.DB_NAME}`;
        connection.query(useDbQuery, (err) => {
            if (err) {
                console.error('Failed to switch to database:', err);
                process.exit(1);
            }

            // Drop tables in correct order (tasks depends on users)
            const dropTasks = `DROP TABLE IF EXISTS tasks`;
            const dropUsers = `DROP TABLE IF EXISTS users`;

            connection.query(dropTasks, (err) => {
                if (err) console.error('Error dropping tasks table:', err);

                connection.query(dropUsers, (err) => {
                    if (err) console.error('Error dropping users table:', err);

                    // Create users table
                    const createUsersTableQuery = `
                        CREATE TABLE IF NOT EXISTS users (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            username VARCHAR(50) NOT NULL UNIQUE,
                            email VARCHAR(100) NOT NULL UNIQUE,
                            password_hash VARCHAR(255) NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        )
                    `;

                    connection.query(createUsersTableQuery, (err) => {
                        if (err) {
                            console.error('Failed to create users table:', err);
                            process.exit(1);
                        }
                        console.log('Users table ready.');

                        // Create tasks table
                        const createTasksTableQuery = `
                            CREATE TABLE IF NOT EXISTS tasks (
                                id INT AUTO_INCREMENT PRIMARY KEY,
                                user_id INT NOT NULL,
                                title VARCHAR(255) NOT NULL,
                                description TEXT,
                                status ENUM('pending', 'completed') DEFAULT 'pending',
                                due_date DATE,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                            )
                        `;

                        connection.query(createTasksTableQuery, (err) => {
                            if (err) {
                                console.error('Failed to create tasks table:', err);
                            } else {
                                console.log('Tasks table ready.');
                            }
                            connection.end();
                        });
                    });
                });
            });
        });
    });
});
