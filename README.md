# Order Management System

A full-stack **Order Management System** built using **React (Vite)** for the frontend and **Node.js, Express.js, and MongoDB** for the backend.

This application provides a modern interface for managing orders with a scalable backend architecture suitable for production-ready applications.

---

# Table of Contents

- Overview
- Features
- Tech Stack
- Project Structure
- Getting Started
- Installation
- Environment Variables
- Running the Project
- API Overview
- Available Scripts
- Folder Structure
- Deployment

---

# Overview

The Order Management System is designed to simplify order management by providing an intuitive frontend and a secure backend API.

The project follows a clean separation between the frontend and backend which makes it easier to maintain and scale.

---

#  Features

- Modern React UI
- RESTful API
- MongoDB Database
- Order Management
- Responsive Design
- Secure Backend
- Environment Configuration
- Error Handling
- Request Validation
- Logging
- Rate Limiting
- Compression
- Scheduled Background Jobs
- Production Ready Structure

---

#  Tech Stack

## Frontend

- React 19
- Vite
- Tailwind CSS
- Axios
- Framer Motion
- Lucide React

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Express Validator
- Helmet
- CORS
- Compression
- Morgan
- Winston
- UUID
- Node Cron
- Dotenv
- Express Rate Limit

---

# Project Structure

Order-Management-System/
│
| client/
│   |- public/
│   |- src/
│   |- package.json
│   |- vite.config.js
│
|- server/
│   |- src/
│   |- package.json
│   |- .env
│   |- server.js
│
|- README.md


#  Installation

## Clone Repository

```bash
git clone <repository-url>
```

```bash
cd Order-Management-System
```

---

## Install Frontend

```bash
cd client
npm install
```

---

## Install Backend

```bash
cd ../server
npm install
```

---

#  Environment Variables

Create a `.env` file inside the **server** directory.

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

NODE_ENV=development
```

Add additional environment variables required by your project if applicable.

---

#  Running the Project

## Start Backend

```bash
cd server
npm run dev
```

---

## Start Frontend

```bash
cd client
npm run dev
```

The frontend will typically run on

```
http://localhost:5173
```

Backend will typically run on

```
http://localhost:5000
```

---

#  API Overview

The backend exposes REST APIs for managing application data.

Typical endpoints include:

| Method | Description |
|---------|-------------|
| GET | Fetch Data |
| POST | Create Data |
| PUT | Update Data |
| DELETE | Delete Data |

> Refer to the source code inside the `server/src/routes` directory for complete endpoint details.

---

#  Available Scripts

## Frontend

```bash
npm run dev
```

Starts development server.

```bash
npm run build
```

Builds the application.

```bash
npm run preview
```

Preview production build.

---

## Backend

```bash
npm run dev
```

Runs backend with Nodemon.

```bash
npm start
```

Runs backend in production mode.

---

#  Folder Structure

## Client

```
client/
│
|- public/
|- src/
│   |- assets/
│   |- components/
│   |- pages/
│   |- services/
│   |- hooks/
│   |- utils/
│   |- App.jsx
│
|- package.json
|- vite.config.js
```

---

## Server

```
server/
│
|- src/
│   |- config/
│   |- controllers/
│   |- middleware/
│   |- models/
│   |- routes/
│   |- services/
│   |- utils/
│   |- server.js
│
|- package.json
|- .env
```

---

#  Security

The backend includes:

- Helmet
- CORS
- Rate Limiting
- Input Validation
- Environment Variables
- Request Logging
- Error Handling

---

#  Deployment

Frontend deployed on:

- Netlify

Backend deployed on:

- Render


Database:

- MongoDB Atlas

---


#  Future Improvements

- Authentication
- Authorization
- Dashboard Analytics
- Email Notifications
- Export Reports
- PDF Generation
- Docker Support
- CI/CD Pipeline
- Unit Testing
- Integration Testing

---


#  Author

**Gyanendra Prakash**

Built with using React, Node.js, Express.js, and MongoDB.

---
