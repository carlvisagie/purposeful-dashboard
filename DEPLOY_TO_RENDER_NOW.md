# Deploy to Render.com - Quick Start Guide

**Repository Ready:** https://github.com/carlvisagie/purposeful-dashboard

Everything is configured and ready. Follow these steps to deploy in 5 minutes.

---

## 🚀 Quick Deploy Steps

### 1. Go to Render Dashboard
Visit: **https://dashboard.render.com/**

### 2. Create New Web Service
- Click **"New +"** button (top right)
- Select **"Web Service"**

### 3. Connect GitHub Repository
- If not connected, click **"Connect GitHub"**
- Search for: **`purposeful-dashboard`**
- Click **"Connect"** next to the repository

### 4. Configure Service (Auto-detected)

Render will automatically detect the `render.yaml` configuration:

**Basic Settings:**
- **Name:** `purposeful-live-coaching`
- **Environment:** Node
- **Region:** Oregon (or closest to you)
- **Branch:** main

**Build & Deploy:**
- **Build Command:** `pnpm install && pnpm build`
- **Start Command:** `NODE_ENV=production node dist/index.js`

### 5. Environment Variables

Render will auto-generate some variables. You only need to add:

**Required:**
```
NODE_VERSION=22.13.0
VITE_APP_TITLE=Purposeful Live Coaching
OAUTH_SERVER_URL=https://api.manus.im
```

**Optional (for payments):**
```
STRIPE_SECRET_KEY=[your-stripe-secret-key]
STRIPE_PUBLISHABLE_KEY=[your-stripe-publishable-key]
```

### 6. Create Database

Render will automatically create a MySQL database based on `render.yaml`:
- **Name:** purposeful-coaching-db
- **Plan:** Free
- **Database:** purposeful_coaching

The `DATABASE_URL` will be auto-generated and connected.

### 7. Deploy

Click **"Create Web Service"**

Render will:
1. Clone the repository
2. Install dependencies
3. Build the application
4. Start the server
5. Provide you with a URL

**Deployment time:** ~5-10 minutes

---

## 🌐 Your Live URL

After deployment completes, you'll get:

**https://purposeful-live-coaching.onrender.com**

(Or similar, based on availability)

---

## ✅ Verification

Once deployed:

1. Visit your Render URL
2. Verify landing page loads
3. Check AI coaching features work
4. Test subscription pricing display

---

## 🔧 Post-Deployment

### Enable Auto-Deploy
- Go to **Settings** → **Build & Deploy**
- Enable **"Auto-Deploy"**
- Now every GitHub push automatically deploys

### Add Custom Domain (Optional)
- Go to **Settings** → **Custom Domains**
- Add your domain
- Configure DNS as shown
- SSL auto-generated

### Monitor
- **Logs:** Available in dashboard
- **Metrics:** CPU, memory, bandwidth
- **Health Checks:** Automatic

---

## ⚠️ Free Tier Notes

**Render Free Tier:**
- 750 hours/month
- Sleeps after 15 min inactivity
- Spins up on first request (~30 seconds)

**For 24/7 uptime:**
- Upgrade to Starter ($7/month)
- No sleep, always-on

---

## 🆘 Troubleshooting

### Build Fails
- Check logs in Render dashboard
- Verify Node version is 22.13.0
- Ensure pnpm is available

### Database Connection Error
- Verify `DATABASE_URL` is set
- Check database is running
- Run migrations if needed

### App Won't Start
- Check start command is correct
- Verify all env variables set
- Review logs for errors

---

## 📞 Support

If you encounter issues:
1. Check Render logs
2. Review `DEPLOYMENT_GUIDE.md`
3. Consult `AGENT_ONBOARDING.md`

---

**Everything is ready. Just click "Create Web Service" in Render!** 🚀
