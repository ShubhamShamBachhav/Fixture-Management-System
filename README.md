# Fullstack Fixture Management Project

## Description
This is a fullstack web application to manage fixtures with CRUD operations.
It is built using React.js for the frontend, Node.js / Express for the backend, and MySQL for the database.
The app allows users to add, edit, delete, and search fixture details efficiently.

## Technologies Used
- Frontend: React.js, HTML, CSS, JavaScript
- Backend: Node.js
- Database: MySQL, 
- Other: Axios for API requests,

## Folder Structure
- frontend/ - # React frontend code
- backend/ - # Node.js backend code
- fixture_database.sql - SQL file to create tables  #MySQL database setup file

## How to Run Locally
1. **Database**: Create a MySQL database and import `fixture_database.sql`.
  Open MySQL.
  Create a new database, e.g., fixturedb.
  Import fixture_database.sql to create all tables.

2. **Backend**:
    Open terminal and navigate to backend folder:
    cd backend
    
    Install dependencies:
    npm install
    
    Create a .env file (if needed) with database credentials:
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=fixturedb
    PORT=5000
   
    Start the backend server:
    npm start

    Backend runs on => http://localhost:5000

2. **Frontend**:
    Open a new terminal and navigate to frontend folder:
    cd frontend
    
    Install dependencies:
    npm install
    
    Start the frontend:
    npm start
    
    Frontend runs on => http://localhost:3000

 
 **Features:**

    Add new fixtures with description, type, code, start date, and end date
    
    Edit existing fixture details
    
    Delete fixtures
    
    Search and filter fixtures
    
    All data is saved in MySQL database
    
**Notes:**
    Update .env in backend if MySQL credentials are different
    
    You can deploy frontend on Vercel and backend + database on Render/Railway for live demo


    
    Contact:
    Shubham Bachhav
    Email: shubhambachhavcareer@gmail.com
    
    Phone: +91 7499229404
