# Blog Editor Application

A full-stack blog editor application with auto-save functionality, draft management, and publishing features.

## Features

- **Rich Text Editing**: Fully-featured blog editor with formatting options
- **Draft Management**:
  - Save as Draft button
  - Auto-save draft after 5 seconds of inactivity
  - Visual notifications when an article is auto-saved
  - Edit and update existing drafts
- **Publishing System**:
  - Publish button to make blogs publicly visible
  - Separate displays for published posts and drafts
- **Authentication**: Secure JWT token-based authentication

## Project Structure

The application consists of two main parts:

1. **Frontend**: React application built with Vite
2. **Backend**: Node.js API with PostgreSQL database using Prisma ORM

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/) database

## Usage

1. **Register/Login**: Create an account or log in to access the blog editor
2. **Create New Blog**: Click "New Blog" to open the editor
3. **Auto-Save**: Your content is automatically saved:
   - Every 30 seconds
   - After 5 seconds of inactivity (using debouncing)
   - Visual notification appears when auto-save occurs
4. **Manual Save Options**:
   - "Save as Draft" to manually save your work
   - "Publish" to make your blog publicly available
5. **Manage Content**:
   - View all your published posts and drafts in separate sections
   - Edit existing drafts or published posts

## Technologies

### Frontend
- React (with Vite)
- State management with React Context/Redux
- Debouncing for efficient auto-save functionality

### Backend
- Node.js with Express
- PostgreSQL database
- Prisma ORM
- JWT authentication

## Development

### Auto-Save Implementation

The auto-save feature uses debouncing to detect when the user stops typing for 5 seconds and triggers a save, providing a seamless drafting experience without the need for manual saving.

### Authentication Flow

The application uses JWT tokens for secure authentication:

1. User logs in with credentials
2. Backend validates and returns a JWT token
3. Frontend stores the token for authenticated API requests
4. Protected routes and resources require valid JWT tokens

