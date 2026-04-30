# Secure Support Ticketing & Infrastructure System

This project is a comprehensive Full-Stack solution for managing technical support requests. It consists of a robust Node.js/Express backend and a responsive React.js frontend, designed with a focus on security, role-based access, and professional UI/UX standards.

## Project Vision
The system provides a seamless bridge between users and administrators. Users can securely report incidents, while administrators have the tools to oversee global system health and manage ticket lifecycles efficiently.

## Core Functionalities

### For Authorized Users
* **Authenticated Access**: Secure registration and login protocols.
* **Incident Reporting**: Ability to create detailed support tickets with subject, description, and priority levels.
* **Personal Management**: A private dashboard to track the status of self-raised tickets and delete inactive records.

### For Administrative Oversight
* **Global Monitoring**: A centralized command center to view all tickets across the entire organization.
* **Operational Metrics**: Real-time analytics showing total volume, pending requests, and critical priority incidents.
* **Lifecycle Control**: Authority to update ticket statuses from 'Open' to 'Resolved' or 'Closed'.

## Technical Architecture & Security

### Backend Infrastructure
* **Security Framework**: Implementation of JWT (JSON Web Tokens) for session-based authorization.
* **Data Protection**: Industry-standard password hashing using Bcrypt.js.
* **Validation Layer**: Strict server-side payload checking via express-validator to prevent malformed data entry.
* **Role Isolation**: Middleware-level checks to ensure administrative endpoints are inaccessible to standard users.

### Frontend Interface
* **Modern Stack**: Developed using React.js and Vite for high-performance rendering.
* **Responsive Styling**: Crafted with Tailwind CSS to ensure a professional look on both mobile and desktop devices.
* **Real-time Feedback**: Integrated toast notifications for immediate system response feedback.

## Installation and Deployment Steps

### 1. Environment Configuration
Create a `.env` file in the root directory with the following parameters:
* `MONGO_URI`: Your MongoDB connection string.
* `JWT_SECRET`: A secure string for token encryption.
* `PORT`: Server port (default is 5000).

### 2. Dependency Management
Install all required packages for both environments:
```bash
# Install backend core dependencies
npm install

# Install frontend assets
cd client && npm install

3. Execution
Run the full-stack application in development mode:

From the project root
npm run dev

API Testing Protocol
The system's integrity can be verified using tools like Postman by following these steps:

Register a user and login to receive a Bearer Token.

Include the token in the Authorization header for all private requests.

Accessing the /api/tickets/all route without an 'admin' role in the database will result in a 403 Forbidden response, confirming the security of the administrative layer.