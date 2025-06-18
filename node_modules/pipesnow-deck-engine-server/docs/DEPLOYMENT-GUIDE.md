# 🚀 Guia de Deploy - DeckEngine API

> **Deploy production-ready para sistema administrativo com user management e billing**

## 🎯 **Visão Geral do Deploy**

Este guia cobre o deployment completo do DeckEngine API em produção, incluindo:

- 🏗️ **Infraestrutura** (Docker, Kubernetes, Cloud)
- 🔐 **Segurança** (SSL, secrets, firewalls)
- 💾 **Banco de Dados** (MongoDB, Redis)
- 📊 **Monitoramento** (logs, métricas, alertas)
- 💳 **Integrações** (Stripe, Email, Analytics)

## 🏗️ **Arquitetura de Produção**

```mermaid
graph TB
    subgraph "Internet"
        U[Users/Admin Dashboard]
    end

    subgraph "CDN/Load Balancer"
        LB[Load Balancer]
        CDN[CloudFlare CDN]
    end

    subgraph "Application Tier"
        API1[DeckEngine API #1]
        API2[DeckEngine API #2]
        API3[DeckEngine API #3]
    end

    subgraph "Database Tier"
        MONGO[(MongoDB Cluster)]
        REDIS[(Redis Cluster)]
    end

    subgraph "External Services"
        STRIPE[Stripe API]
        EMAIL[SendGrid/Mailgun]
        ANALYTICS[Google Analytics]
    end

    subgraph "Monitoring"
        LOGS[Centralized Logs]
        METRICS[Prometheus/Grafana]
        ALERTS[PagerDuty/Slack]
    end

    U --> CDN
    CDN --> LB
    LB --> API1
    LB --> API2
    LB --> API3

    API1 --> MONGO
    API1 --> REDIS
    API2 --> MONGO
    API2 --> REDIS
    API3 --> MONGO
    API3 --> REDIS

    API1 --> STRIPE
    API1 --> EMAIL
    API1 --> ANALYTICS

    API1 --> LOGS
    API2 --> LOGS
    API3 --> LOGS

    LOGS --> METRICS
    METRICS --> ALERTS
```

## 🐳 **Containerização**

### **Dockerfile Otimizado**

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS production

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S deckengine -u 1001

WORKDIR /app

# Copiar dependências
COPY --from=builder --chown=deckengine:nodejs /app/node_modules ./node_modules

# Copiar código da aplicação
COPY --chown=deckengine:nodejs . .

# Configurações de segurança
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=1024"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3000}/api/system/health || exit 1

# Expor porta
EXPOSE 3000

# Usuário não-root
USER deckengine

# Comando de inicialização
CMD ["node", "server.js"]
```

### **Docker Compose para Development**

```yaml
# docker-compose.yml
version: "3.8"

services:
  deckengine-api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
      - MONGODB_URI=mongodb://mongo:27017/deckengine
      - REDIS_URL=redis://redis:6379
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - EMAIL_API_KEY=${EMAIL_API_KEY}
    depends_on:
      - mongo
      - redis
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password123
      - MONGO_INITDB_DATABASE=deckengine
    volumes:
      - mongo_data:/data/db
      - ./scripts/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - deckengine-api

volumes:
  mongo_data:
  redis_data:
```

## ⚙️ **Configuração de Produção**

### **Variáveis de Ambiente**

```bash
# .env.production
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/deckengine
REDIS_URL=redis://redis-cluster:6379

# Security
JWT_SECRET=your-super-secret-jwt-key
API_SECRET_KEY=your-api-secret-key

# Rate Limiting
RATE_LIMIT_GLOBAL=10000
RATE_LIMIT_EXECUTION=500
RATE_LIMIT_WINDOW=900000

# External Services
STRIPE_SECRET_KEY=sk_live_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx
SENDGRID_API_KEY=SG.xxxx
GOOGLE_ANALYTICS_ID=GA-xxxx

# Monitoring
SENTRY_DSN=https://xxxx@sentry.io/xxxx
LOG_LEVEL=info
ENABLE_METRICS=true

# Features
ENABLE_WEBHOOKS=true
ENABLE_CACHING=true
ENABLE_RATE_LIMITING=true
ENABLE_REQUEST_LOGGING=true

# Admin Dashboard
ADMIN_EMAIL=admin@yourcompany.com
ADMIN_PANEL_URL=https://admin.yourcompany.com
```

### **Configuração de Segurança**

```javascript
// config/security.js
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const securityConfig = {
  // Helmet configuration
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", "https://api.stripe.com"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  },

  // Rate limiting
  rateLimits: {
    global: rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: process.env.RATE_LIMIT_GLOBAL || 1000,
      message: {
        error: "Muitas requisições, tente novamente em 15 minutos",
      },
      standardHeaders: true,
      legacyHeaders: false,
    }),

    auth: rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5, // 5 tentativas de login por 15 min
      skipSuccessfulRequests: true,
    }),

    api: rateLimit({
      windowMs: 60 * 1000, // 1 minuto
      max: process.env.RATE_LIMIT_API || 60,
    }),
  },

  // CORS configuration
  cors: {
    origin: [
      "https://yourapp.com",
      "https://admin.yourapp.com",
      /\.yourapp\.com$/,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  },
};

module.exports = securityConfig;
```

## 🔄 **CI/CD Pipeline**

### **GitHub Actions Workflow**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:6.0
        env:
          MONGO_INITDB_ROOT_USERNAME: test
          MONGO_INITDB_ROOT_PASSWORD: test
        ports:
          - 27017:27017

      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test
        env:
          NODE_ENV: test
          MONGODB_URI: mongodb://test:test@localhost:27017/deckengine_test
          REDIS_URL: redis://localhost:6379

      - name: Run security audit
        run: npm audit --production

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Deploy to Kubernetes
        run: |
          echo "${{ secrets.KUBECONFIG }}" | base64 -d > kubeconfig
          export KUBECONFIG=kubeconfig

          # Update deployment image
          kubectl set image deployment/deckengine-api \
            deckengine-api=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
            -n production

          # Wait for rollout
          kubectl rollout status deployment/deckengine-api -n production

          # Verify deployment
          kubectl get pods -n production -l app=deckengine-api
```

## ☸️ **Kubernetes Deployment**

### **Deployment Configuration**

```yaml
# k8s/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deckengine-api
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: deckengine-api
  template:
    metadata:
      labels:
        app: deckengine-api
    spec:
      containers:
        - name: deckengine-api
          image: ghcr.io/yourorg/deckengine:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: "production"
            - name: PORT
              value: "3000"
            - name: MONGODB_URI
              valueFrom:
                secretKeyRef:
                  name: deckengine-secrets
                  key: mongodb-uri
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: deckengine-secrets
                  key: redis-url
            - name: STRIPE_SECRET_KEY
              valueFrom:
                secretKeyRef:
                  name: deckengine-secrets
                  key: stripe-secret

          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"

          livenessProbe:
            httpGet:
              path: /api/system/health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10

          readinessProbe:
            httpGet:
              path: /api/system/health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: deckengine-api-service
  namespace: production
spec:
  selector:
    app: deckengine-api
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: deckengine-api-ingress
  namespace: production
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  tls:
    - hosts:
        - api.yourcompany.com
      secretName: deckengine-tls
  rules:
    - host: api.yourcompany.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: deckengine-api-service
                port:
                  number: 80
```

### **Secrets Management**

```yaml
# k8s/secrets.yml
apiVersion: v1
kind: Secret
metadata:
  name: deckengine-secrets
  namespace: production
type: Opaque
data:
  mongodb-uri: <base64-encoded-mongodb-uri>
  redis-url: <base64-encoded-redis-url>
  jwt-secret: <base64-encoded-jwt-secret>
  stripe-secret: <base64-encoded-stripe-key>
  sendgrid-api-key: <base64-encoded-sendgrid-key>
```

## 📊 **Monitoramento e Observabilidade**

### **Logging Configuration**

```javascript
// config/logging.js
const winston = require("winston");
const { ElasticsearchTransport } = require("winston-elasticsearch");

const loggerConfig = {
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: "deckengine-api",
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
  },
  transports: [
    // Console para desenvolvimento
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    // File para produção
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
};

// Elasticsearch para produção
if (process.env.NODE_ENV === "production" && process.env.ELASTICSEARCH_URL) {
  loggerConfig.transports.push(
    new ElasticsearchTransport({
      level: "info",
      clientOpts: {
        node: process.env.ELASTICSEARCH_URL,
        auth: {
          username: process.env.ELASTICSEARCH_USERNAME,
          password: process.env.ELASTICSEARCH_PASSWORD,
        },
      },
      index: "deckengine-logs",
    })
  );
}

module.exports = winston.createLogger(loggerConfig);
```

### **Métricas com Prometheus**

```javascript
// middlewares/metrics.js
const prometheus = require("prom-client");

// Criar métricas customizadas
const httpRequestDuration = new prometheus.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5],
});

const httpRequestTotal = new prometheus.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

const deckEngineOperations = new prometheus.Counter({
  name: "deckengine_operations_total",
  help: "Total DeckEngine operations",
  labelNames: ["operation", "status"],
});

const activeUsers = new prometheus.Gauge({
  name: "active_users_total",
  help: "Total number of active users",
});

const billingRevenue = new prometheus.Gauge({
  name: "monthly_recurring_revenue",
  help: "Monthly recurring revenue in cents",
});

// Middleware para coletar métricas
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;

    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);

    httpRequestTotal.labels(req.method, route, res.statusCode).inc();
  });

  next();
};

// Endpoint de métricas
const metricsEndpoint = (req, res) => {
  res.set("Content-Type", prometheus.register.contentType);
  res.end(prometheus.register.metrics());
};

module.exports = {
  metricsMiddleware,
  metricsEndpoint,
  deckEngineOperations,
  activeUsers,
  billingRevenue,
};
```

## 🚨 **Alertas e Notificações**

### **Alertmanager Configuration**

```yaml
# alertmanager.yml
global:
  smtp_smarthost: "smtp.sendgrid.net:587"
  smtp_from: "alerts@yourcompany.com"
  smtp_auth_username: "apikey"
  smtp_auth_password: "${SENDGRID_API_KEY}"

route:
  group_by: ["alertname"]
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: "web.hook"
  routes:
    - match:
        severity: critical
      receiver: "critical-alerts"
    - match:
        service: billing
      receiver: "billing-alerts"

receivers:
  - name: "web.hook"
    slack_configs:
      - api_url: "${SLACK_WEBHOOK_URL}"
        channel: "#alerts"
        title: "DeckEngine Alert"
        text: "{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}"

  - name: "critical-alerts"
    email_configs:
      - to: "oncall@yourcompany.com"
        subject: "🚨 Critical Alert: {{ .GroupLabels.alertname }}"
        body: |
          Alert: {{ .GroupLabels.alertname }}
          Severity: {{ .CommonLabels.severity }}
          Description: {{ .CommonAnnotations.description }}

    pagerduty_configs:
      - routing_key: "${PAGERDUTY_ROUTING_KEY}"
        description: "{{ .GroupLabels.alertname }}"

  - name: "billing-alerts"
    email_configs:
      - to: "billing@yourcompany.com"
        subject: "💳 Billing Alert: {{ .GroupLabels.alertname }}"
```

### **Prometheus Rules**

```yaml
# prometheus-rules.yml
groups:
  - name: deckengine.rules
    rules:
      # API Health
      - alert: APIDown
        expr: up{job="deckengine-api"} == 0
        for: 30s
        labels:
          severity: critical
        annotations:
          summary: "DeckEngine API is down"
          description: "DeckEngine API has been down for more than 30 seconds"

      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      # Performance
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High response time"
          description: "95th percentile response time is {{ $value }}s"

      # Business Metrics
      - alert: PaymentFailureSpike
        expr: increase(deckengine_operations_total{operation="billing", status="failed"}[1h]) > 10
        for: 5m
        labels:
          severity: critical
          service: billing
        annotations:
          summary: "High payment failure rate"
          description: "{{ $value }} payment failures in the last hour"

      - alert: ChurnRateHigh
        expr: increase(deckengine_operations_total{operation="user_cancellation"}[24h]) / active_users_total > 0.05
        for: 1h
        labels:
          severity: warning
          service: billing
        annotations:
          summary: "High churn rate detected"
          description: "Daily churn rate is {{ $value | humanizePercentage }}"

      # Infrastructure
      - alert: HighMemoryUsage
        expr: (container_memory_usage_bytes / container_spec_memory_limit_bytes) > 0.8
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value | humanizePercentage }}"

      - alert: DatabaseConnectionsHigh
        expr: mongodb_connections{state="current"} > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High database connections"
          description: "MongoDB has {{ $value }} active connections"
```

## 🔄 **Backup e Disaster Recovery**

### **MongoDB Backup Script**

```bash
#!/bin/bash
# scripts/backup-mongodb.sh

set -e

# Configurações
BACKUP_DIR="/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="deckengine_backup_${DATE}"
RETENTION_DAYS=30

# Criar diretório de backup
mkdir -p ${BACKUP_DIR}

# Executar backup
echo "Iniciando backup do MongoDB..."
mongodump \
  --uri="${MONGODB_URI}" \
  --out="${BACKUP_DIR}/${BACKUP_NAME}"

# Comprimir backup
echo "Comprimindo backup..."
tar -czf "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" \
  -C "${BACKUP_DIR}" "${BACKUP_NAME}"

# Remover pasta não comprimida
rm -rf "${BACKUP_DIR}/${BACKUP_NAME}"

# Upload para S3 (opcional)
if [ ! -z "${AWS_S3_BUCKET}" ]; then
  echo "Enviando backup para S3..."
  aws s3 cp "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" \
    "s3://${AWS_S3_BUCKET}/mongodb-backups/"
fi

# Limpar backups antigos
echo "Limpando backups antigos..."
find ${BACKUP_DIR} -name "*.tar.gz" -mtime +${RETENTION_DAYS} -delete

echo "Backup concluído: ${BACKUP_NAME}.tar.gz"
```

### **Disaster Recovery Playbook**

```markdown
## 🚨 Disaster Recovery Playbook

### Cenário 1: API Completamente Down

1. Verificar status do cluster Kubernetes
2. Checar logs dos pods: `kubectl logs -f deployment/deckengine-api`
3. Verificar recursos: `kubectl top pods`
4. Rollback se necessário: `kubectl rollout undo deployment/deckengine-api`

### Cenário 2: Database Failure

1. Verificar status do cluster MongoDB
2. Restaurar do backup mais recente
3. Atualizar connection strings se necessário
4. Validar integridade dos dados

### Cenário 3: Payment System Down

1. Verificar status da integração Stripe
2. Ativar modo de manutenção para billing
3. Notificar usuários sobre problemas temporários
4. Processar pagamentos pendentes após resolução

### Cenário 4: Data Breach

1. Isolar sistemas afetados imediatamente
2. Ativar modo de manutenção
3. Notificar equipe de segurança
4. Análise forense
5. Notificação de usuários se necessário
6. Relatório de incident
```

---

**🚀 DeckEngine API Production Ready!**

> _"Infrastructure as Code + DeckEngine = Sistema Administrativo Resiliente"_ ✨

### **Checklist de Deploy**

- [ ] ✅ **Containerização** configurada
- [ ] 🔐 **Secrets** gerenciados com segurança
- [ ] 📊 **Monitoramento** ativo (logs, métricas, alertas)
- [ ] 💾 **Backup** automatizado
- [ ] 🔄 **CI/CD** pipeline funcionando
- [ ] 🚨 **Disaster recovery** documentado
- [ ] 💳 **Stripe** webhooks configurados
- [ ] 📧 **Email** service integrado
