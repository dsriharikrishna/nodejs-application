# express-app

Node.js + Express + TypeScript REST API with PostgreSQL via Prisma. Deployed independently on AWS EC2 with RDS PostgreSQL.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/express/health` | Health check |
| GET | `/api/express/ready` | Readiness check (tests DB) |
| GET | `/api/express/items` | List items (`?page=1&limit=10&status=ACTIVE`) |
| GET | `/api/express/items/:id` | Get item by ID |
| POST | `/api/express/items` | Create item |
| PUT | `/api/express/items/:id` | Update item |
| DELETE | `/api/express/items/:id` | Archive item (soft delete) |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment |
| `DATABASE_URL` | — | PostgreSQL connection string |
| `LOG_LEVEL` | `info` | Log verbosity |

## Local Development (Docker Compose)

```bash
# 1. Copy env
cp .env.example .env

# 2. Start services
docker compose up -d

# 3. Run migrations
docker compose exec express-app pnpm run db:migrate:deploy

# 4. Seed data
docker compose exec express-app pnpm run db:seed
```

## Local Development (without Docker)

```bash
# Prerequisites: Node 24+, PostgreSQL running locally

pnpm install
cp .env.example .env
# Edit DATABASE_URL to point to your local PostgreSQL

pnpm run db:generate
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
```

## Run Tests

```bash
pnpm test
pnpm run test:coverage
```

## Build for Production

```bash
pnpm run build
# Output in dist/
node dist/server.js
```

## AWS EC2 + RDS Deployment

### 1. RDS PostgreSQL Setup

```bash
# Create RDS instance (replace values)
aws rds create-db-instance \
  --db-instance-identifier express-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username expressuser \
  --master-user-password <SECURE_PASSWORD> \
  --allocated-storage 20 \
  --vpc-security-group-ids <SG_ID> \
  --no-publicly-accessible \
  --storage-encrypted
```

### 2. ECR Image Push

```bash
# Authenticate to ECR
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com

# Build and push
docker build -t express-app .
docker tag express-app:latest <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/express-app:latest
docker push <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/express-app:latest
```

### 3. Run on EC2

```bash
# Pull and run container
docker pull <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/express-app:latest
docker run -d \
  --name express-app \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  -e DATABASE_URL="postgresql://expressuser:<PASSWORD>@<RDS_ENDPOINT>:5432/expressdb?sslmode=require" \
  --restart unless-stopped \
  <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/express-app:latest
```

### 4. Run Migrations on EC2

```bash
docker exec express-app pnpm run db:migrate:deploy
```

