# Deploy em Produção

Guia completo para deploy do Home Buddy em ambiente de produção, incluindo configuração de servidor, SSL, monitoramento e boas práticas de segurança.

## Visão Geral

Este guia cobre o deploy completo do Home Buddy em ambiente de produção, desde a configuração do servidor até o monitoramento e manutenção.

## Arquitetura de Produção

```mermaid
graph TB
    subgraph "Load Balancer"
        A[Nginx]
    end

    subgraph "Application Servers"
        B[Frontend Container]
        C[Backend Container]
        D[Matcher Container]
    end

    subgraph "Data Layer"
        E[PostgreSQL Primary]
        F[PostgreSQL Replica]
        G[Redis Cluster]
    end

    subgraph "External Services"
        H[OpenAI API]
        I[Google OAuth]
        J[CDN]
    end

    subgraph "Monitoring"
        K[Prometheus]
        L[Grafana]
        M[AlertManager]
    end

    A --> B
    A --> C
    A --> D
    C --> E
    C --> F
    C --> G
    D --> H
    C --> I
    B --> J
    C --> K
    D --> K
    K --> L
    K --> M
```

## Pré-requisitos

### Servidor

- **OS**: Ubuntu 20.04+ ou CentOS 8+
- **RAM**: Mínimo 4GB, recomendado 8GB+
- **CPU**: Mínimo 2 cores, recomendado 4 cores+
- **Storage**: Mínimo 50GB SSD
- **Network**: IP público com portas 80/443 abertas

### Software Necessário

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y docker.io docker-compose git nginx certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install -y docker docker-compose git nginx certbot python3-certbot-nginx
```

## Configuração do Servidor

### 1. Instalação do Docker

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# CentOS/RHEL
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
sudo systemctl enable docker
```

### 2. Configuração do Docker Compose

```bash
# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3. Configuração do Nginx

```nginx
# /etc/nginx/sites-available/home-buddy
upstream backend {
    server 127.0.0.1:3001;
}

upstream matcher {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name homebuddy.com www.homebuddy.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name homebuddy.com www.homebuddy.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/homebuddy.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/homebuddy.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Matcher API
    location /matcher/ {
        proxy_pass http://matcher/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health Check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

## Configuração de Ambiente

### Variáveis de Produção

```env
# .env.production
# Database
DATABASE_URL=postgresql://homebuddy:secure_password@postgres:5432/home_buddy_prod
POSTGRES_USER=homebuddy
POSTGRES_PASSWORD=secure_password_here
POSTGRES_DB=home_buddy_prod

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=secure_redis_password

# JWT Secrets (gerar com openssl rand -base64 32)
JWT_ACCESS_SECRET=your-super-secure-access-secret-key
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Internal Communication
INTERNAL_TOKEN=your-super-secure-internal-token

# Frontend
NEXT_PUBLIC_API_BASE_URL=https://homebuddy.com/api

# Environment
NODE_ENV=production

# Security
COOKIE_DOMAIN=homebuddy.com
FRONTEND_URL=https://homebuddy.com
```

### Geração de Secrets

```bash
# Gerar secrets seguros
openssl rand -base64 32  # Para JWT secrets
openssl rand -hex 32     # Para tokens internos
```

## Deploy com Docker Compose

### 1. Preparação do Ambiente

```bash
# Clonar repositório
git clone https://github.com/home-buddy/home-buddy-monorepo.git
cd home-buddy-monorepo

# Configurar variáveis de ambiente
cp .env.example .env.production
# Editar .env.production com valores reais
```

### 2. Configuração SSL

```bash
# Instalar certificado SSL
sudo certbot --nginx -d homebuddy.com -d www.homebuddy.com

# Configurar renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. Deploy dos Serviços

```bash
# Build e deploy
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Verificar status
docker-compose -f docker-compose.prod.yml ps
```

### 4. Configuração do Nginx

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/home-buddy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Monitoramento

### Prometheus Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'home-buddy-backend'
    static_configs:
      - targets: ['backend:3000']
    metrics_path: '/metrics'

  - job_name: 'home-buddy-matcher'
    static_configs:
      - targets: ['matcher:8000']
    metrics_path: '/metrics'

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']
```

### Grafana Dashboards

```json
{
  "dashboard": {
    "title": "Home Buddy Production",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{instance}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "5xx errors"
          }
        ]
      }
    ]
  }
}
```

## Backup e Recuperação

### Script de Backup

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Criar diretório de backup
mkdir -p $BACKUP_DIR/$DATE

# Backup do PostgreSQL
docker-compose exec -T postgres pg_dump -U homebuddy home_buddy_prod > $BACKUP_DIR/$DATE/database.sql

# Backup do Redis
docker-compose exec redis redis-cli BGSAVE
docker cp $(docker-compose ps -q redis):/data/dump.rdb $BACKUP_DIR/$DATE/redis.rdb

# Backup dos volumes
docker run --rm -v home-buddy_postgres_data:/data -v $BACKUP_DIR/$DATE:/backup alpine tar czf /backup/postgres_data.tar.gz -C /data .

# Compactar backup
tar czf $BACKUP_DIR/home-buddy-backup-$DATE.tar.gz -C $BACKUP_DIR $DATE

# Remover backup temporário
rm -rf $BACKUP_DIR/$DATE

# Manter apenas últimos 7 backups
ls -t $BACKUP_DIR/home-buddy-backup-*.tar.gz | tail -n +8 | xargs -r rm

echo "Backup concluído: home-buddy-backup-$DATE.tar.gz"
```

### Script de Restore

```bash
#!/bin/bash
# restore.sh

if [ -z "$1" ]; then
    echo "Uso: $0 <arquivo-backup>"
    exit 1
fi

BACKUP_FILE=$1
TEMP_DIR="/tmp/restore-$(date +%s)"

# Extrair backup
mkdir -p $TEMP_DIR
tar xzf $BACKUP_FILE -C $TEMP_DIR

# Parar serviços
docker-compose down

# Restaurar PostgreSQL
docker-compose up -d postgres
sleep 10
docker-compose exec -T postgres psql -U homebuddy -d home_buddy_prod < $TEMP_DIR/database.sql

# Restaurar Redis
docker cp $TEMP_DIR/redis.rdb $(docker-compose ps -q redis):/data/dump.rdb

# Restaurar volumes
docker run --rm -v home-buddy_postgres_data:/data -v $TEMP_DIR:/backup alpine tar xzf /backup/postgres_data.tar.gz -C /data

# Reiniciar serviços
docker-compose up -d

# Limpar arquivos temporários
rm -rf $TEMP_DIR

echo "Restore concluído"
```

### Agendamento de Backups

```bash
# Configurar cron para backup diário
crontab -e

# Adicionar linha:
0 2 * * * /path/to/backup.sh
```

## Segurança

### Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw deny 3000/tcp   # Frontend (apenas local)
sudo ufw deny 3001/tcp   # Backend (apenas local)
sudo ufw deny 8000/tcp   # Matcher (apenas local)
sudo ufw deny 5432/tcp   # PostgreSQL (apenas local)
sudo ufw deny 6379/tcp   # Redis (apenas local)
```

### Fail2Ban Configuration

```ini
# /etc/fail2ban/jail.local
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
```

### Docker Security

```yaml
# docker-compose.prod.yml
services:
  backend:
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
      - /var/tmp
    user: '1000:1000'
```

## Performance

### Otimizações do Nginx

```nginx
# /etc/nginx/nginx.conf
worker_processes auto;
worker_cpu_affinity auto;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=app_cache:10m max_size=1g inactive=60m use_temp_path=off;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
}
```

### Otimizações do Docker

```yaml
# docker-compose.prod.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'
    environment:
      - NODE_OPTIONS=--max-old-space-size=1024
```

## Logs e Debugging

### Configuração de Logs

```yaml
# docker-compose.prod.yml
services:
  backend:
    logging:
      driver: 'json-file'
      options:
        max-size: '10m'
        max-file: '5'
```

### Log Rotation

```bash
# /etc/logrotate.d/docker-containers
/var/lib/docker/containers/*/*.log {
    daily
    rotate 7
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}
```

### Monitoring de Logs

```bash
# Instalar ELK Stack (opcional)
docker run -d --name elasticsearch -p 9200:9200 elasticsearch:7.15.0
docker run -d --name kibana --link elasticsearch:elasticsearch -p 5601:5601 kibana:7.15.0
docker run -d --name logstash -p 5044:5044 logstash:7.15.0
```

## Manutenção

### Atualizações

```bash
# Atualizar aplicação
git pull origin main
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Atualizar dependências do sistema
sudo apt update && sudo apt upgrade -y
```

### Limpeza

```bash
# Limpar containers parados
docker container prune -f

# Limpar imagens não utilizadas
docker image prune -a -f

# Limpar volumes não utilizados
docker volume prune -f

# Limpar rede não utilizada
docker network prune -f
```

### Health Checks

```bash
# Script de health check
#!/bin/bash
# health-check.sh

FRONTEND_URL="https://homebuddy.com"
API_URL="https://homebuddy.com/api/health"
MATCHER_URL="https://homebuddy.com/matcher/health"

# Verificar frontend
if ! curl -f -s $FRONTEND_URL > /dev/null; then
    echo "Frontend está fora do ar"
    exit 1
fi

# Verificar API
if ! curl -f -s $API_URL > /dev/null; then
    echo "API está fora do ar"
    exit 1
fi

# Verificar matcher
if ! curl -f -s $MATCHER_URL > /dev/null; then
    echo "Matcher está fora do ar"
    exit 1
fi

echo "Todos os serviços estão funcionando"
```

## Troubleshooting

### Problemas Comuns

#### 1. Serviço não responde

```bash
# Verificar logs
docker-compose logs -f service-name

# Verificar recursos
docker stats

# Reiniciar serviço
docker-compose restart service-name
```

#### 2. Problemas de SSL

```bash
# Verificar certificado
sudo certbot certificates

# Renovar certificado
sudo certbot renew --dry-run

# Testar SSL
openssl s_client -connect homebuddy.com:443
```

#### 3. Problemas de performance

```bash
# Verificar uso de CPU/Memória
htop

# Verificar conexões de rede
netstat -tulpn

# Verificar logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Próximos Passos

### Melhorias Futuras

1. **CDN**: Implementar CloudFlare ou AWS CloudFront
2. **Load Balancer**: Múltiplos servidores com HAProxy
3. **Database Clustering**: PostgreSQL com replicação
4. **Redis Cluster**: Redis com alta disponibilidade
5. **Kubernetes**: Orquestração com K8s
6. **CI/CD**: Pipeline automatizado com GitHub Actions
7. **Monitoring**: APM com New Relic ou DataDog
8. **Security**: WAF com ModSecurity
