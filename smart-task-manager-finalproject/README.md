# Smart Task Manager

The Smart Task Manager is a web-based To-Do List application that assists users in organizing their daily tasks. It features user authentication, task management (CRUD), and a responsive design.

## Features

User Authentication: Secure registration and login using JWT.
Task Management: Create, view, edit, and delete tasks.
Filtering & Sorting: Filter tasks by status (pending/completed) and sort by due date or creation date.
Responsive Design: Works seamlessly on desktop and mobile devices.
Database Integration: Stores all data in a MySQL database.

## Technology Stack

Frontend: HTML5, CSS3, JavaScript
Backend: Node.js, Express.js
Database: MySQL
Authentication: BCrypt, JSON Web Token (JWT)

## Setup Instructions

1.  Clone the repository:
   
    git clone https://github.com/gdibba86/CSC322-WebProgramming.git
    cd smart-task-manager
    

2.  Install dependencies:

    npm install
    

3.  Database Setup:
    Ensure MySQL is running.
    Create the database and tables using the `database/schema.sql` script.
    Update the `.env` file with your database credentials.

4.  Start the server:
    
    npm run dev
   
    The server will start on `http://localhost:5000`.

5.  Run the application:
    

## API Endpoints

`POST /api/auth/register`: Register a new user.
`POST /api/auth/login`: Login user.
`GET /api/tasks`: Get all tasks (supports `status` and `sort` query params).
`POST /api/tasks`: Create a new task.
`PUT /api/tasks/:id`: Update a task.
`DELETE /api/tasks/:id`: Delete a task.

## License

This project is open-source and available under the MIT License.
