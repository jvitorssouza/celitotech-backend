# User Management API

Welcome to the User Management API! This API provides functionality for user registration, authentication, and management, with support for both regular and admin users.

## Features

### Authentication Module

- **User Registration (Signup)**: Allows new users to register in the system.
- **User Authentication**: Users can log in by providing their credentials.
- **View Personal Data**: Authenticated users can view their profile information.

### User Module

- **Password Change (Regular User)**: Users can change their own passwords exclusively.
- **User Management (Admin User)**:
  - Create new users for the account.
  - Update any user's information.
  - Delete users from the system.
  - List all registered users.
- **Update Data (Regular User)**: Users can update their own data.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v20.X or higher)
- [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jvitorssouza/celitotech-backend.git
   ```
2. Navigate to the project directory:
   ```bash
   cd celitotech-backend
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Configure environment variables by creating a `.env` file based on `.env.example`.

### Usage

1. Start the API:
   ```bash
   pnpm start
   ```
2. Access the API at [http://localhost:3000](http://localhost:3000) (or the port configured in your environment variables).

### Endpoints

#### Authentication

- **POST /auth/signup**: Registers a new user.
- **POST /auth/login**: Authenticates a user with email and password.
- **GET /auth/me**: Returns data for the authenticated user.

#### Users

- **GET /users**: (Admin) Lists all users.
- **GET /users/:id**: (Admin) Lists user by ID.
- **POST /users**: (Admin) Creates a new user.
- **PATCH /users/:id**: (Admin, User) Updates data for a specific user.
- **PATCH /users/update-password**: Allows a regular user to change their password.
- **DELETE /users/:id**: (Admin) Deletes a specific user.

### Security

- Uses token-based authentication (JWT).
- Specific permissions for regular users and administrators.

## Testing

Run tests with:
```bash
pnpm test
```
