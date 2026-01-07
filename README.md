# Job Portal - Full Stack Application

A modern, dark-themed job portal built with Next.js and Node.js/Express.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **File Storage**: Local filesystem for resume uploads

## Project Structure

```
job-portal/
├── frontend/          # Next.js application
├── backend/           # Node.js/Express API
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose (for database)

## Setup Instructions

### 1. Start PostgreSQL Database with Docker

From the project root directory, start the PostgreSQL database:

```bash
docker-compose up -d
```

This will start PostgreSQL on port 5432 with the following default credentials:
- **Database**: jobportal
- **User**: jobportal
- **Password**: jobportal123
- **Port**: 5432

To stop the database:
```bash
docker-compose down
```

To view database logs:
```bash
docker-compose logs -f postgres
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example` if available):
```bash
cp .env.example .env
```

Or create `.env` manually with the following variables:
```
DATABASE_URL="postgresql://jobportal:jobportal123@localhost:5432/jobportal?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

**Note**: Make sure to change `JWT_SECRET` to a secure random string in production.

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

6. Start the server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
cp .env.local.example .env.local
```

Or create `.env.local` manually:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Quick Start (All Services)

To start everything at once:

1. **Start the database:**
```bash
docker-compose up -d
```

2. **Set up and start the backend** (in a new terminal):
```bash
cd backend
npm install
cp .env.example .env  # Edit .env if needed
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

3. **Set up and start the frontend** (in another terminal):
```bash
cd frontend
npm install
cp .env.local.example .env.local  # Edit if needed
npm run dev
```

## Database Management

### Accessing the Database

You can connect to the PostgreSQL database using any PostgreSQL client:

- **Host**: localhost
- **Port**: 5432
- **Database**: jobportal
- **Username**: jobportal
- **Password**: jobportal123

### Using Prisma Studio

To view and manage data through a GUI:

```bash
cd backend
npm run prisma:studio
```

This will open Prisma Studio at `http://localhost:5555`

### Creating a Migration

After modifying the Prisma schema:

```bash
cd backend
npm run prisma:migrate
```

### Resetting the Database

⚠️ **Warning**: This will delete all data!

```bash
cd backend
npx prisma migrate reset
```

### Creating an Admin User

After setting up the database, create an admin user:

```bash
cd backend
npm run create-admin
```

Or with custom credentials:
```bash
npm run create-admin admin@example.com password123 "Admin Name"
```

Default admin credentials (if no arguments provided):
- **Email**: admin@jobportal.com
- **Password**: admin123
- **Name**: Admin User

⚠️ **Important**: Change the default password after first login!

### Seeding Dummy Job Data

To populate the database with sample job listings:

```bash
cd backend
npm run seed
```

This will:
- Create an admin user (if it doesn't exist)
- Add 15+ sample job listings across different categories
- Include jobs with various job types (full-time, part-time, contract)
- Include jobs with different experience levels (entry, mid, senior, executive)
- Include jobs from different locations (San Francisco, New York, London, Remote)

The seed script will delete existing jobs before adding new ones. To keep existing jobs, modify the seed script.

## Features

- User authentication (signup/login)
- Job listing with advanced filtering and sorting
- Job bookmarking and application tracking
- Resume upload and management
- Admin panel for job management
- Dark theme UI
- Responsive design

## API Endpoints

See the plan document for complete API documentation.
