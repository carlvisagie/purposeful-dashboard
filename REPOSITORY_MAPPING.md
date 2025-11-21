# Purposeful Live Coaching - Repository Mapping

**Created:** November 21, 2025  
**Purpose:** Maintain continuity across agent sessions and prevent duplicate work

---

## 📦 GitHub Repositories (Active)

| Repository | Purpose | Last Updated | Status |
| :--- | :--- | :--- | :--- |
| **purposeful-dashboard** | Enterprise platform (B2B) - Full stack | Nov 21, 2025 | ✅ Active - Just deployed |
| **purposeful-individual** | Individual coaching (B2C) | Nov 21, 2025 | ✅ Active |
| **purposeful-ai-backend** | AI backend services | Nov 21, 2025 | ✅ Active |
| **purposeful-enterprise** | Enterprise features | Nov 21, 2025 | ✅ Active |
| **purposeful-live-frontend** | Legacy frontend | Oct 17, 2025 | ⚠️ Older version |

---

## 🚀 Render Deployments (Existing)

Based on your Render dashboard, you have:

| Service Name | Status | Likely Repository | Notes |
| :--- | :--- | :--- | :--- |
| **purposeful-ai-backend** | ✅ Deployed | purposeful-ai-backend | AI services |
| **purposeful-live-frontend** | ✅ Deployed | purposeful-live-frontend | Older frontend |
| **coaching-platform** | ✅ Deployed | Unknown | Need to check |

---

## 🎯 Current Work (This Session)

**Repository:** `purposeful-dashboard`  
**GitHub:** https://github.com/carlvisagie/purposeful-dashboard  
**Local Path:** `/home/ubuntu/purposeful-dashboard`

### What We Did Today

1. ✅ Cloned purposeful-dashboard
2. ✅ Fixed authentication blocking issue
3. ✅ Built for production
4. ✅ Deployed locally (sandbox)
5. ✅ Created render.yaml for deployment
6. ✅ Pushed fixes to GitHub

### Current Deployment Status

- **Sandbox URL:** https://3002-ik39pg39s9zy7fnc7plu0-9a0dfbb1.manusvm.computer
- **Render Status:** NOT YET DEPLOYED to Render
- **Next Step:** Deploy purposeful-dashboard to Render

---

## 🔄 Recommended Action

### Option 1: Create New Render Service (Recommended)

Create a **new** Render service for `purposeful-dashboard`:
- Name: `purposeful-dashboard`
- Repository: `carlvisagie/purposeful-dashboard`
- This keeps it separate from existing deployments

### Option 2: Update Existing Service

Update one of the existing Render services to use `purposeful-dashboard`:
- Check which service is outdated
- Point it to the new repository
- Redeploy

---

## 📋 Repository Architecture

Based on the repositories, the platform has a **modular structure**:

```
purposeful-dashboard (Enterprise B2B)
├── Full-stack application
├── React + TypeScript frontend
├── Node.js + Express backend
├── MySQL database (19 tables)
├── Stripe payments
└── AI coaching features

purposeful-individual (Individual B2C)
├── Individual coaching interface
├── Separate from enterprise
└── B2C focused features

purposeful-ai-backend (AI Services)
├── AI coaching engine
├── LLM integration
└── Shared by both platforms

purposeful-enterprise (Enterprise Features)
├── Enterprise-specific features
├── Corporate wellness
└── B2B tools
```

---

## ⚠️ Preventing Duplicate Work

### For Future Agents

1. **Always check this file first** before deploying
2. **Check Render dashboard** to see what's already deployed
3. **Verify repository** before creating new services
4. **Update this file** when making changes

### Key Questions to Ask

- Which repository am I working on?
- Is this already deployed on Render?
- What's the relationship between repositories?
- Am I duplicating existing work?

---

## 🎯 Next Steps for THIS Repository

**purposeful-dashboard** needs to be deployed to Render:

1. Go to Render dashboard
2. Click "New +" → "Web Service"
3. Select `carlvisagie/purposeful-dashboard`
4. Name it: `purposeful-dashboard` (NOT coaching-platform or purposeful-live-frontend)
5. Use the render.yaml configuration
6. Deploy

**Expected URL:** `https://purposeful-dashboard.onrender.com`

---

## 📞 Contact Points

- **GitHub Account:** carlvisagie
- **Render Account:** [Your Render account]
- **Primary Repository:** purposeful-dashboard (as of Nov 21, 2025)

---

**Last Updated:** November 21, 2025  
**Update this file whenever repository structure or deployments change!**
