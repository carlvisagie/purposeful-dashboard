# Stripe Setup Required - Revenue Blocker

## Problem
Subscription buttons redirect to OAuth instead of Stripe checkout because **Stripe Product Price IDs are missing**.

## Root Cause
The platform expects these environment variables in Render:
- `STRIPE_PRICE_AI_ESSENTIAL_MONTHLY` (for $49/month tier)
- `STRIPE_PRICE_AI_GROWTH_MONTHLY` (for $79/month tier)
- `STRIPE_PRICE_AI_TRANSFORMATION_MONTHLY` (for $99/month tier)

These Price IDs don't exist yet in your Stripe account.

## Solution (5 Minutes)

### Step 1: Create Products in Stripe Dashboard

1. Go to https://dashboard.stripe.com/products
2. Click **"+ Add product"** three times to create:

**Product 1: AI Essential**
- Name: `AI Essential`
- Description: `24/7 AI coaching support with unlimited check-ins and crisis detection`
- Pricing: `$49.00 USD` / month (recurring)
- Click "Save product"
- **Copy the Price ID** (starts with `price_...`)

**Product 2: AI Growth**
- Name: `AI Growth`
- Description: `Advanced AI coaching with personalized insights and monthly human coach check-ins`
- Pricing: `$79.00 USD` / month (recurring)
- Click "Save product"
- **Copy the Price ID** (starts with `price_...`)

**Product 3: AI Transformation**
- Name: `AI Transformation`
- Description: `Premium AI coaching with bi-weekly human sessions and custom goal tracking`
- Pricing: `$99.00 USD` / month (recurring)
- Click "Save product"
- **Copy the Price ID** (starts with `price_...`)

### Step 2: Add Price IDs to Render

1. Go to https://dashboard.render.com
2. Select **purposeful-dashboard** service
3. Click **Environment** tab
4. Click **"Add Environment Variable"** three times:

```
STRIPE_PRICE_AI_ESSENTIAL_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_AI_GROWTH_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_AI_TRANSFORMATION_MONTHLY=price_xxxxxxxxxxxxx
```

5. Click **"Save Changes"**
6. Render will automatically redeploy (takes ~2-3 minutes)

### Step 3: Test

1. Visit https://purposeful-dashboard.onrender.com
2. Scroll to pricing section
3. Click "Start Essential" button
4. Should redirect to Stripe checkout (NOT OAuth)
5. Complete test purchase

## Status

- ❌ Stripe Products: NOT CREATED
- ❌ Price IDs: NOT CONFIGURED  
- ❌ Revenue: BLOCKED

Once you complete Steps 1-2 above, the platform will be 100% revenue-ready.

---

**Next:** I'm fixing the button implementation to remove the auth requirement while you set up Stripe.
