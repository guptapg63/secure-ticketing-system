# Secure Support Ticketing API - Backend Service

This is the backend service for the Support Ticketing System. It is a RESTful API built with Node.js, Express, and MongoDB, designed to handle user authentication, role-based ticket management, and strict data validation.

## Core Features

* Authentication: JWT-based user authentication and password hashing using bcryptjs.
* Role-Based Access Control (RBAC): Differentiates between standard 'Users' (can manage their own tickets) and 'Admins' (can view and update all system tickets).
* Data Security: Strict input validation and sanitization implemented via express-validator.
* Error Handling: Centralized error handling middleware that ensures consistent JSON responses and protects stack traces in production.

## Technology Stack

* Node.js & Express.js
* MongoDB with Mongoose
* JSON Web Tokens (JWT) for session management
* express-validator for payload checking
* Helmet & CORS for API security

## Local Setup & Installation

1. Clone the repository and navigate to the backend directory.
2. Run `npm install` to install all required dependencies.
3. Create a `.env` file in the root directory with the following variables:

   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_custom_secret_key

4. Start the server using: `npm run dev`

## API Endpoints & Local Testing URLs

The server runs on port 5000 by default. You can use Postman to test these endpoints.

### Authentication Endpoints
* Register a new user
  POST http://localhost:5000/api/auth/register
  Access: Public

* Login and receive JWT token
  POST http://localhost:5000/api/auth/login
  Access: Public

### Ticket Management Endpoints (Requires Bearer Token)
* Create a new ticket
  POST http://localhost:5000/api/tickets
  Access: Private (User)
  Body: { "subject": "Issue title", "description": "Details here" }

* Get all tickets for logged-in user
  GET http://localhost:5000/api/tickets
  Access: Private (User)

* Get ALL system tickets (Includes user details)
  GET http://localhost:5000/api/tickets/all
  Access: Private (Admin Only)

* Update ticket status or priority
  PUT http://localhost:5000/api/tickets/:id
  Access: Private (Admin Only)
  Body: { "status": "Resolved", "priority": "High" }

## Testing Flow (For Reviewers)

1. Create a user via the /register endpoint.
2. Login to get the Bearer Token.
3. In Postman, go to the 'Authorization' tab, select 'Bearer Token', and paste the token.
4. Use the /tickets endpoints. If you test the Admin endpoints with a normal user token, you will receive a 403 Forbidden response.