# EC2 + Docker Deployment Guide & Command Reference

Complete step-by-step commands to deploy and maintain the Node.js application on AWS EC2.

---

## 1. Instance & Database Details
- **EC2 Public IP:** `18.60.49.33`
- **EC2 Public DNS:** `ec2-18-60-49-33.ap-south-2.compute.amazonaws.com`
- **EC2 User:** `ubuntu`
- **Region:** `ap-south-2` (Hyderabad)
- **Local Key Path:** `C:\Users\Signi\Documents\AWS\aws-learning\KEYS\nodejs-app-key.pem`
- **AWS RDS Endpoint:** `database-1-instance-1.c54gokgechym.ap-south-2.rds.amazonaws.com`
- **RDS Engine & Port:** PostgreSQL on Port `5432`

---

## 2. Connect to EC2 via SSH

### From Local Git Bash:
```bash
# Set key file permissions (run once if needed)
chmod 400 "/c/Users/Signi/Documents/AWS/aws-learning/KEYS/nodejs-app-key.pem"

# SSH connection command
ssh -i "/c/Users/Signi/Documents/AWS/aws-learning/KEYS/nodejs-app-key.pem" ubuntu@18.60.49.33
```

### From Local PowerShell:
```powershell
# Fix Windows key file permissions (run once if getting Bad Permissions error)
icacls "C:\Users\Signi\Documents\AWS\aws-learning\KEYS\nodejs-app-key.pem" /reset
icacls "C:\Users\Signi\Documents\AWS\aws-learning\KEYS\nodejs-app-key.pem" /grant:r "$($env:USERNAME):(R)"
icacls "C:\Users\Signi\Documents\AWS\aws-learning\KEYS\nodejs-app-key.pem" /inheritance:r

# Connect
ssh -i "C:\Users\Signi\Documents\AWS\aws-learning\KEYS\nodejs-app-key.pem" ubuntu@18.60.49.33
```

---

## 3. Server Setup on EC2 (Run Once)

Execute inside your EC2 SSH session:

```bash
# 1. Update system packages
sudo apt update && sudo apt upgrade -y

# 2. Install Git, Docker, and utilities
sudo apt install -y docker.io git curl htop

# 3. Install Docker Compose standalone binary
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo ln -s /usr/local/bin/docker-compose /usr/local/lib/docker/cli-plugins/docker-compose

# 4. Enable Docker service on boot
sudo systemctl enable --now docker

# 5. Allow ubuntu user to run Docker without sudo
sudo usermod -aG docker $USER
newgrp docker

# 6. Verify installations
docker --version
docker compose version
git --version
```

---

## 4. Deploy Application with Docker Compose

```bash
# 1. Navigate to home and clone repository
cd ~
git clone <YOUR_GITHUB_REPO_URL> app
cd app

# 2. Create production .env file
nano .env
```

Paste into `.env`:
```ini
PORT=3001
NODE_ENV=production
DATABASE_URL=postgresql://expressuser:expresspass@postgres:5432/expressdb
LOG_LEVEL=info
```
*(Press `Ctrl + O`, `Enter` to save, then `Ctrl + X` to exit).*

```bash
# 3. Build images and start all containers in background
docker compose up -d --build

# 4. Verify containers status
docker compose ps
```

---

## 5. Live App URLs

- **Health Check (Nginx Port 80):** [http://18.60.49.33/health](http://18.60.49.33/health)
- **Direct App Health Check (Port 3001):** [http://18.60.49.33:3001/health](http://18.60.49.33:3001/health)
- **API Base (via Nginx proxy):** [http://18.60.49.33/api/express/](http://18.60.49.33/api/express/)
- **AWS Public DNS URL:** [http://ec2-18-60-49-33.ap-south-2.compute.amazonaws.com/health](http://ec2-18-60-49-33.ap-south-2.compute.amazonaws.com/health)

> **AWS Security Group Requirement:**
> Ensure Inbound rules include:
> - Port `22` (SSH)
> - Port `80` (HTTP)
> - Port `3001` (Custom TCP)

---

## 6. Daily Operations & Troubleshooting

### View Logs
```bash
# View live logs for all services
docker compose logs -f

# View live logs for only express app
docker compose logs -f express-app

# Last 100 log lines
docker logs --tail 100 express-app
```

### Restart Services
```bash
# Restart entire stack
docker compose restart

# Restart only express-app container
docker compose restart express-app
```

### Database Migrations (Prisma)
```bash
# Run migrations inside running express-app container
docker exec -it express-app npx prisma migrate deploy
```

### Update Deployment (Deploy New Code)
```bash
cd ~/app
git pull origin main
docker compose up -d --build
```

### Stop / Clean Up
```bash
# Stop containers without losing database data
docker compose down

# Stop and wipe database data volume
docker compose down -v

# Clean up unused Docker cache and dangling images to save disk space
docker system prune -f
```

