# Quick Setup Guide

## Step-by-Step Setup

### 1. Start PostgreSQL Database

```bash
# From project root
docker-compose up -d
```

Verify it's running:
```bash
docker-compose ps
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DATABASE_URL="postgresql://jobportal:jobportal123@localhost:5432/jobportal?schema=public"
JWT_SECRET="change-this-to-a-random-secret-key"
PORT=5000
FRONTEND_URL="http://localhost:3000"
EOF

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Create admin user (optional)
npm run create-admin

# Start backend server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Start frontend server
npm run dev
```

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Prisma Studio**: http://localhost:5555 (run `npm run prisma:studio` in backend)
- **PostgreSQL**: localhost:5432

## Default Credentials

### Database
- User: `jobportal`
- Password: `jobportal123`
- Database: `jobportal`
- Port: `5432`

### Admin User (if created with default script)
- Email: `admin@jobportal.com`
- Password: `admin123`

⚠️ **Change these passwords in production!**

## Troubleshooting

### Database Connection Issues

1. Check if Docker container is running:
```bash
docker-compose ps
```

2. Check database logs:
```bash
docker-compose logs postgres
```

3. Restart the database:
```bash
docker-compose restart postgres
```

### Prisma Issues

1. Regenerate Prisma client:
```bash
cd backend
npm run prisma:generate
```

2. Reset database (⚠️ deletes all data):
```bash
cd backend
npx prisma migrate reset
```

### Port Already in Use

If port 5432 is already in use, you can change it in `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"  # Change 5433 to any available port
```

Then update `DATABASE_URL` in backend `.env` accordingly.
