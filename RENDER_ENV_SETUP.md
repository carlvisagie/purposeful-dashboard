# Render Environment Variables - Required Setup

## Critical: Add These to Render Dashboard

The subscription buttons require these environment variables to be set in Render:

```bash
STRIPE_PRICE_AI_ESSENTIAL_MONTHLY=price_1SVHwrCoewQKHsplKMdwFOWI
STRIPE_PRICE_AI_GROWTH_MONTHLY=price_1SVI1oCoewQKHsplzXpeOxxr
STRIPE_PRICE_AI_TRANSFORMATION_MONTHLY=price_1SVI2sCoewQKHspl09ZfgFbx
```

## How to Add (2 Minutes)

1. Go to: https://dashboard.render.com
2. Select: `purposeful-dashboard` service
3. Click: **Environment** tab
4. Click: **Add Environment Variable** (3 times)
5. Paste each variable name and value
6. Click: **Save Changes**
7. Render will auto-redeploy (wait 3-5 minutes)

## Verify Setup

After deployment completes:
1. Visit: https://purposeful-dashboard.onrender.com
2. Scroll to pricing section
3. Click "Start Essential"
4. Should redirect to Stripe checkout (NOT OAuth)

## Backup Reference

These Price IDs are backed up in: `STRIPE_PRICE_IDS_BACKUP.md`

Last updated: November 22, 2025
