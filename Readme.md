# Endurance Claim Detail and Submit for payment (MERN Stack)

This is a full-stack web application for managing insurance claims, built with React (frontend) and Node.js/Express/MongoDB (backend). It allows users to view claim details, track status history, and submit payments for authorized claims via an uploadable invoice and selected payment method. The system handles file uploads as binary data stored directly in MongoDB for security and simplicity.

---

## Features

- **Claim Viewing**
  - Display claim details, sublets, services, totals, and customer info.
- **Status Tracking**
  - Timeline of claim statuses (e.g., Pending, Authorized, Paid) with color-coded badges.
- **Payment Submission**
  - Upload invoice (PDF/JPG/PNG) and choose method (Wire, ACH, Check); updates status to "Paid" without creating duplicate entries.
- **Responsive UI**
  - Built with Mantine UI for a modern, accessible interface.
- **File Handling**
  - Binary storage in DB, using express-formidable for uploads.

---

## Tech Stack

### Frontend
- React
- TailwindCSS
- Mantine UI
- React Icons

### Backend
- Node.js + Express
- MongoDB + Mongoose

---

## Project Structure

 - Endurance/
    - Backend/ → Node.js + Express backend
    - Frontend/ → React frontend
    - README.md → Documentation

---

## SETUP INSTRUCTIONS

 - ### Clone Repository
   - git clone https://github.com/anuskamhzn/Endurance.git
   - cd Endurance

 - ### Setup Server (Backend)
   - cd server
   - npm install

 - ### Seed the Database
   - cd server
   - node scripts/seedClaim.js

   (This command loads the claim seed data into the database.)

 - ### Run Backend:
        - node server.js
        (Backend will run at: http://localhost:5000)

 - ### Setup Frontend
   - cd frontend
   - npm install

 - ### Run Frontend:
        - npm start
        (Frontend will run at: http://localhost:3000)

 - ### Create .env:
   - PORT=5000
   - MONGO_URI=your_mongo_uri

---

## API ENDPOINTS

 - ### AUTHENTICATION:

   - GET /api/claims/:id → Get the user claim
   - POST /api/claims/submit → Submit the payment for claim

---   