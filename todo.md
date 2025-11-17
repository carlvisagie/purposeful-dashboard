# Purposeful Live Coaching Platform - Development TODO

## Core Features (Production-Ready)

### Backend Infrastructure
- [x] Database schema for coaches, clients, and journal entries
- [x] Emotional resilience tracking data model
- [x] User authentication and authorization
- [x] API endpoints for client management
- [x] API endpoints for journal entries
- [x] API endpoints for emotional tracking
- [x] Session management and security

### Frontend Application
- [x] Landing page with high-conversion design
- [x] Coach dashboard with client overview
- [x] Client management interface (CRUD)
- [x] Journal entry interface with emotional tracking
- [x] Emotional resilience dashboard with charts
- [x] Login/authentication UI
- [x] Responsive design for mobile and desktop

### Emotional Resilience Features
- [x] Emotion logging with intensity tracking
- [x] Trigger identification and tracking
- [x] Coping strategy effectiveness analysis
- [x] Pattern detection and insights
- [x] Progress visualization (charts and graphs)
- [x] Resilience score calculation

### AI-Powered Features
- [ ] AI insights engine for pattern detection
- [ ] Smart coping recommendations
- [ ] Emotional trend analysis
- [ ] Crisis detection and alerts
- [ ] Personalized coaching suggestions

### Revenue Generation
- [ ] Subscription management
- [ ] Payment processing integration
- [ ] Insurance partnership data export
- [ ] Analytics and reporting
- [ ] Client retention metrics

### Deployment & Documentation
- [ ] Production build configuration
- [ ] Environment setup guide
- [ ] Deployment instructions for local laptop
- [ ] User manual for coaches
- [ ] Client onboarding guide
- [ ] Backup and recovery procedures

## Technical Debt & Quality
- [ ] Comprehensive error handling
- [ ] Input validation on all forms
- [ ] Security audit and hardening
- [ ] Performance optimization
- [ ] Automated tests for critical paths
- [ ] Code documentation

## Future Enhancements (Post-Launch)
- [ ] Mobile app development
- [ ] Video session integration
- [ ] Group coaching features
- [ ] Advanced analytics dashboard
- [ ] Multi-language support for Kosovo deployment


## Master Prompt Compliance Audit

### High-Conversion Agency Mode
- [x] Implement Hero → Stakes → Services → Process → Proof → FAQ → Final CTA structure
- [x] Apply direct-response conversion psychology (PAS framework)
- [x] Add high-ticket landing page frameworks with premium positioning
- [x] Eliminate cognitive load and friction points
- [x] Implement trust-heavy compliance positioning
- [x] Optimize CTAs based on buyer intent (primary: Book Call, secondary: View Packages)

### Production-Ready Standards
- [ ] Verify all code runs out-of-the-box with no placeholders
- [ ] Ensure all features are final-ready for paying clients
- [ ] Add comprehensive error handling and user support
- [ ] Implement audit logging for compliance
- [ ] Remove any "coming soon" or incomplete features
- [ ] Ensure operational simplicity for solo operator

### Billion-Dollar Test
- [ ] Review every section: "Would removing this decrease sales?"
- [ ] Verify every element increases trust, clarity, or conversions
- [ ] Remove all friction points and unnecessary elements
- [ ] Eliminate personal preferences, keep only what makes money

### Trust & Authority Elements
- [x] Add security badges and compliance certifications
- [x] Display credentials and professional authority
- [x] Include social proof and testimonials
- [x] Add risk-reversal guarantees
- [x] Show U.S.-based support and audit readiness

### Revenue Optimization
- [x] Implement Stripe payment integration
- [x] Create tiered pricing packages
- [ ] Add insurance partnership data export
- [x] Build conversion-optimized landing page
- [ ] Add booking/scheduling system for strategy calls


## CRITICAL BUGS TO FIX

- [x] Fix broken "Book Your Strategy Call" button URL
- [ ] Test all CTAs and navigation links
- [ ] Verify OAuth login flow works correctly
- [ ] Test Stripe checkout flow end-to-end
- [x] Fix broken /login page (404 error)
- [x] Create proper login/authentication page

## OpenAI Integration (Ready to Add When Needed)

- [x] Implement AI insights generation using invokeLLM
- [x] Add crisis detection and red flag monitoring
- [x] Create pattern analysis for journal entries
- [x] Build automated coaching recommendations
- [ ] Test AI features with OpenAI API key (requires user to add OPENAI_API_KEY)

## CRITICAL BUG - USER REPORTED

- [ ] Fix broken "Book Strategy Call" button (user reports it doesn't work)
- [ ] Test all CTA buttons on published platform
- [ ] Verify button functionality after republishing

## NEW FEATURES - INDIVIDUAL COACHING

- [x] Create individual coaching landing page (B2C focus)
- [x] Add personal transformation messaging
- [x] Create individual pricing tiers ($99-$299/month)
- [x] Integrate Calendly booking system
- [x] Add Calendly to all "Book Strategy Call" CTAs
- [ ] Test both landing pages (enterprise and individual)
- [ ] Publish updated platform with dual landing pages

## CRITICAL FIXES - USER REPORTED

- [x] Fix broken bottom button on both landing pages (final CTA section)
- [x] Enhance individual landing page to match enterprise conversion power
- [x] Apply Master Prompt standards to individual page
- [x] Apply High-Conversion Agency Mode tactics to individual page
- [x] Make individual coaching the primary revenue focus
- [ ] Test all buttons on published site before delivery

## USER-REPORTED ISSUE - LANDING PAGE FIX

- [ ] Remove separate /individual page (wrong approach)
- [ ] Add "Individual Coaching" section to main landing page
- [ ] Include B2C pricing ($99-$299/month) for individuals
- [ ] Keep enterprise section for organizations
- [ ] Make ONE unified landing page serving both audiences
- [ ] Test all buttons work correctly

## RESEARCH REQUIRED - LANDING PAGE STRATEGY

- [x] Research B2B vs B2C landing page best practices
- [x] Research conversion data for combined vs separate landing pages
- [x] Research user psychology - does mixing enterprise and individual pricing hurt conversion?
- [x] Analyze findings and recommend optimal strategy
- [ ] Implement research-backed solution (IN PROGRESS)

## COMPETITIVE ANALYSIS - INDIVIDUAL PRICING

- [x] Research competitor pricing for emotional resilience/mental wellness coaching
- [x] Research competitor features and service offerings
- [x] Analyze pricing tiers and value propositions
- [x] Compare our platform to competitors
- [x] Validate $99-$299/month pricing strategy
- [x] Deliver competitive analysis report with recommendations

## ZOOM INTEGRATION

- [x] Add Zoom PMI (820 180 8284) to landing pages
- [x] Add Zoom link to coach dashboard
- [x] Add Zoom session button to client detail pages
- [x] Add Zoom info to coach profile setup
- [ ] Test all Zoom links work correctly

## PAYPAL INTEGRATION

- [x] Replace Stripe with PayPal Business account (carl@keepyourcontracts.com)
- [x] Add PayPal subscription buttons for Individual packages ($99, $199, $299/month)
- [x] Add PayPal buy now buttons for Enterprise packages
- [ ] Remove Stripe dependencies and code
- [ ] Test PayPal payment flow

## EMAIL NOTIFICATION SYSTEM

- [x] Set up Stripe webhook endpoint for subscription events
- [x] Create webhook handler for checkout.session.completed
- [x] Create webhook handler for invoice.payment_succeeded
- [x] Create webhook handler for invoice.payment_failed
- [x] Create webhook handler for customer.subscription.deleted
- [x] Design email template for new subscription confirmation
- [x] Design email template for payment confirmation
- [x] Design email template for payment failure
- [x] Design email template for subscription cancellation
- [x] Implement email sending service (using built-in notification or SMTP)
- [ ] Test webhook integration with Stripe CLI (requires user setup)
- [x] Create setup guide for webhook configuration
- [ ] Add email notification settings to admin panel (future enhancement)

## NATIVE SCHEDULING SYSTEM

### Database Schema
- [x] Create sessions table (client, coach, date/time, status, type, notes)
- [x] Create coach availability table (recurring weekly schedule)
- [x] Create availability exceptions table (time off, holidays)
- [x] Add session reminders table for tracking sent notifications

### Backend API (tRPC)
- [x] Create session booking procedure (check availability, create session)
- [x] Create session rescheduling procedure (validate new time, update session)
- [x] Create session cancellation procedure (update status, handle refunds)
- [x] Create get available slots procedure (calculate from coach availability)
- [x] Create coach availability management procedures (CRUD)
- [x] Create session list procedures (upcoming, past, cancelled)

### Coach Dashboard Features
- [x] Availability management interface (set weekly schedule)
- [x] Time-off/exception management (block specific dates)
- [ ] Session calendar view with all bookings (future enhancement)
- [ ] Session details modal (view/edit/cancel) (future enhancement)
- [ ] Upcoming sessions list with client info (future enhancement)

### Client Booking Features
- [x] Session booking page with calendar picker
- [x] Available time slots display based on coach availability
- [x] Session type selection (initial consultation, follow-up, etc.)
- [x] Booking confirmation with calendar invite
- [x] My sessions page (upcoming, past, cancelled)
- [ ] Reschedule interface (select new time from available slots) (future enhancement)
- [x] Cancel session with confirmation dialog

### Notifications & Reminders
- [x] Email notification on new booking (to coach and client)
- [x] Email notification on reschedule (to both parties)
- [x] Email notification on cancellation (to both parties)
- [x] 24-hour reminder email before session
- [x] 1-hour reminder email before session
- [x] Integration with existing email service

### UI Components
- [x] Calendar component for date selection
- [x] Time slot picker component
- [x] Session card component (display session details)
- [x] Availability editor component (weekly schedule grid)
- [x] Session status badges (scheduled, completed, cancelled, no-show)

### Integration
- [ ] Replace Calendly links with native booking links (manual task for Carl)
- [ ] Add "Book Session" CTA to client dashboard (future enhancement)
- [ ] Add "Manage Availability" to coach dashboard (future enhancement)
- [ ] Generate .ics calendar files for email invites (future enhancement)
- [x] Add Zoom meeting link to session confirmations

## SESSION TYPES WITH PRICING

### Database Schema
- [x] Create sessionTypes table (name, description, duration, price, isActive)
- [x] Add sessionTypeId foreign key to sessions table
- [x] Add paymentStatus field to sessions table (pending, paid, refunded)
- [x] Add stripePaymentIntentId to sessions table

### Backend API
- [x] Create session type management procedures (CRUD)
- [ ] Update booking procedure to require payment (Stripe integration pending)
- [ ] Create Stripe payment intent for session booking (next phase)
- [x] Update available slots to filter by session type duration
- [x] Add session type pricing to booking confirmation

### Admin Interface
- [x] Create session types management page
- [x] Add/edit/delete session types
- [x] Set pricing and duration for each type
- [x] Toggle active/inactive status
- [x] Preview how types appear to clients

### Client Booking Flow
- [x] Update session type selector with prices
- [x] Show price prominently during booking
- [ ] Integrate Stripe checkout before booking confirmation (next phase)
- [ ] Handle payment success/failure (next phase)
- [x] Update booking confirmation to show payment receipt
- [ ] Add payment status to session cards (after Stripe integration)

### Payment Integration
- [x] Create Stripe checkout session for one-time payments
- [ ] Handle payment webhooks for session bookings (webhook handler exists, needs testing)
- [ ] Update session status after successful payment (webhook handler exists, needs testing)
- [ ] Send payment receipt email (email service exists, needs webhook integration)
- [ ] Handle refunds for cancelled sessions (future enhancement)

## REAL-TIME SCARCITY FEATURE

- [x] Create backend procedure to calculate weekly available spots
- [x] Count booked sessions for current week
- [x] Calculate total weekly capacity from coach availability
- [x] Return remaining spots count
- [x] Add scarcity display component to booking page
- [x] Show "X spots remaining this week" with urgency styling
- [x] Update count dynamically when session type changes
- [x] Add color-coded urgency (green: 5+, yellow: 2-4, red: 1)
- [x] Test scarcity calculations with different availability settings

## EXIT-INTENT POPUP WITH DISCOUNT

- [ ] Create discount codes table in database
- [ ] Add discount code validation procedure
- [ ] Create exit-intent detection hook
- [ ] Build popup component with 10% discount offer
- [ ] Add urgency messaging and countdown timer
- [ ] Implement single-use discount code generation
- [ ] Track popup displays and conversions
- [ ] Integrate discount into Stripe checkout
- [ ] Apply discount to session price calculation
- [ ] Test exit-intent trigger on mouse movement
- [ ] Prevent popup from showing multiple times per session

## INDIVIDUAL PAGE MODERNIZATION

- [x] Replace PayPal pricing section with Stripe session types
- [x] Add real-time scarcity display above pricing
- [x] Update "View Pricing" CTAs to scroll to session types
- [x] Update "Book" CTAs to link to /book-session
- [x] Integrate session types data from backend
- [x] Show session type cards with pricing
- [x] Add "Book This Session" buttons linking to booking flow
- [ ] Test pricing section with real session types (needs user to create session types)
- [x] Verify scarcity counter updates in real-time
