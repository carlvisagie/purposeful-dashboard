# Button Issue Analysis

## Problem Identified

When clicking "Start Essential" (or any subscription button), the app redirects to:
```
https://api.manus.im/app-auth?appId=default-app-id&redirectUri=https://purposeful-dashboard.onrender.com/api/oauth/callback
```

This results in a "Not Found" error.

## Root Cause

The buttons are trying to authenticate users through the Manus OAuth system, but:
1. The `appId` is set to `default-app-id` (placeholder)
2. The OAuth callback endpoint may not be properly configured
3. The app should go directly to Stripe checkout, not OAuth first

## Solution Needed

The subscription buttons should:
1. Create a Stripe checkout session directly
2. Skip the OAuth requirement for subscription purchases
3. Allow users to subscribe without logging in first (or handle auth differently)

## Files to Check

- `client/src/pages/Individual.tsx` - Landing page with pricing buttons
- `client/src/const.ts` - OAuth configuration
- `server/routers/stripe.ts` - Stripe checkout session creation
- Environment variables for OAuth configuration
