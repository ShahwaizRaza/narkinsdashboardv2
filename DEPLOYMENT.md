# Deployment Guide

## 🚀 Deploy Your Dashboard to Production

### Option 1: Vercel (Recommended - Free & Easy)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Build your project:**
```bash
npm run build
```

3. **Deploy:**
```bash
vercel
```

4. **Configure API:**
   - Update `vite.config.js` to point to your production Flask API
   - Or set environment variable: `VITE_API_URL=https://your-api.com`

**Pros:** Free, automatic HTTPS, CDN, instant deployments
**Cons:** Need to host Flask API separately

---

### Option 2: Netlify

1. **Build:**
```bash
npm run build
```

2. **Deploy via Netlify CLI:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Or drag & drop the `dist` folder to netlify.app

**Configure redirects for API:**
Create `public/_redirects`:
```
/api/*  https://your-flask-api.com/api/:splat  200
```

---

### Option 3: Docker (Full Stack)

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://backend:5000

  backend:
    build: ./flask-app
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
```

**Deploy:**
```bash
docker-compose up -d
```

---

### Option 4: Traditional Server (Nginx)

1. **Build:**
```bash
npm run build
```

2. **Copy `dist/` to server:**
```bash
scp -r dist/* user@server:/var/www/narkins-dashboard/
```

3. **Nginx config:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/narkins-dashboard;
    index index.html;
    
    # Serve static files
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to Flask
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Enable gzip
    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

4. **Restart Nginx:**
```bash
sudo systemctl restart nginx
```

---

### Option 5: AWS S3 + CloudFront

1. **Build:**
```bash
npm run build
```

2. **Upload to S3:**
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

3. **Configure CloudFront** for CDN
4. **API Gateway** for Flask API

---

## 🔒 Production Checklist

Before deploying, ensure:

- [ ] Environment variables are set correctly
- [ ] API endpoint is accessible from production
- [ ] CORS is configured on Flask API
- [ ] HTTPS is enabled
- [ ] Error tracking is set up (Sentry, etc.)
- [ ] Analytics are configured (Google Analytics, etc.)
- [ ] Performance monitoring is active
- [ ] Backup strategy is in place

---

## 🔧 Flask API CORS Configuration

Your Flask API needs CORS enabled for production:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["https://your-frontend-domain.com"])
```

Install flask-cors:
```bash
pip install flask-cors
```

---

## 📊 Performance Optimization

1. **Enable compression** in your web server
2. **Use CDN** for static assets
3. **Cache API responses** when appropriate
4. **Implement service worker** for offline support
5. **Lazy load** components if needed

---

## 🔄 CI/CD Pipeline Example (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Dashboard

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🌍 Multi-Environment Setup

Create different configs for dev/staging/prod:

**vite.config.dev.js**
```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
```

**vite.config.prod.js**
```javascript
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

---

## 📱 Mobile App Distribution

Since this is a PWA, users can install it directly from the browser!

**Steps for users:**
1. Open dashboard in mobile browser
2. Tap "Share" or menu button
3. Select "Add to Home Screen"
4. App icon appears on home screen!

---

## 🛡️ Security Best Practices

1. **Never expose API keys** in frontend code
2. **Use environment variables** for sensitive config
3. **Implement rate limiting** on Flask API
4. **Enable HTTPS** in production
5. **Validate all inputs** on backend
6. **Keep dependencies updated**: `npm audit fix`

---

## 📈 Monitoring & Analytics

Add to your `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_ID"></script>

<!-- Error Tracking (Sentry) -->
<script src="https://browser.sentry-cdn.com/..."></script>
```

---

## 🎉 You're Ready to Deploy!

Choose the option that best fits your infrastructure and deploy your lightning-fast dashboard!

**Need help?** Check the troubleshooting section in README.md
