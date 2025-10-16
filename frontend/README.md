# OCTA Space Fixture Management System

### Project Overview
This is a **web application** for managing fixtures (like racks, shelves, and other storage units) in a warehouse or store.  
It allows users to **add, view, update, delete, and search fixtures** with details like dimensions, location, category, and availability.

---

### Key Features

- **CRUD Operations**
  - **Create**: Add a new fixture with details, categories, and images.
  - **Read**: View all fixtures or search/filter based on multiple criteria.
  - **Update**: Edit existing fixture information and categories.
  - **Delete**: Remove fixtures if not needed.

- **Categories Management**
  - Each fixture can have multiple categories.
  - You can assign **allocated space** and **elasticity coefficient** for each category.

- **Image Upload**
  - Upload multiple images for each fixture.
  - Images can be removed individually.

- **Search & Filters**
  - Search by Fixture ID, Description, Type, Code, Location, Category, or Unique Identifier.

- **UI**
  - Clean and simple interface built with **React.js**.
  - Status displayed as buttons with color indication.

- **Auto Increment Fixture ID**
  - New fixtures automatically get a unique ID.

---

### Tech Stack

- **Frontend**: React.js, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **APIs**: RESTful API endpoints
- **Others**: Axios, React Router, React Toastify

---

### Project Structure
frontend/ # React.js frontend
backend/ # Node.js + Express backend
├─ controllers/ # Handles CRUD logic
├─ models/ # Database models
├─ routes/ # API routes
└─ db/ # Database connection


### How to Run -----------------------------------------------

1. **Backend**
   cd backend
   npm install
   npm start

1. **Frontend**
    cd frontend
    npm install
    npm start

    Open your browser at =>  http://localhost:3000
