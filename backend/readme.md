# Backend API

This repository contains the backend API for our application. Follow the setup instructions below to get the server up and running locally.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/) database

## Setup Instructions

### 1. Install Dependencies

Install the required dependencies:

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your-secure-jwt-secret"
```

Make sure to:
- Replace the `DATABASE_URL` with your PostgreSQL connection string
- Set a secure value for `JWT_SECRET` (used for authentication)

### 3. Database Setup

Initialize and set up the database with Prisma by running:

```bash
npx prisma migrate dev
```

This command will:
- Apply all migrations to your database
- Create tables based on your schema

Next, generate the Prisma client:

```bash
npx prisma generate
```

### 4. Start the Server

Start the development server with:

```bash
npm run start
```

The server should now be running at `http://localhost:5000`.