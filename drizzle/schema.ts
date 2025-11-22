import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Coaches table - extends users with coaching-specific information
 */
export const coaches = mysqlTable("coaches", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  specialization: text("specialization"),
  bio: text("bio"),
  certifications: text("certifications"),
  yearsExperience: int("yearsExperience"),
  isActive: mysqlEnum("isActive", ["true", "false"]).default("true").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Coach = typeof coaches.$inferSelect;
export type InsertCoach = typeof coaches.$inferInsert;

/**
 * Clients table - people being coached
 */
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  coachId: int("coachId").notNull().references(() => coaches.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  dateOfBirth: timestamp("dateOfBirth"),
  goals: text("goals"),
  notes: text("notes"),
  status: mysqlEnum("status", ["active", "inactive", "completed"]).default("active").notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Journal entries with emotional resilience tracking
 */
export const journalEntries = mysqlTable("journalEntries", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().references(() => clients.id),
  entryDate: timestamp("entryDate").defaultNow().notNull(),
  content: text("content").notNull(),
  mood: varchar("mood", { length: 50 }),
  moodIntensity: int("moodIntensity"), // 1-10 scale
  emotions: text("emotions"), // JSON array of emotions
  triggers: text("triggers"), // What triggered the emotions
  copingStrategies: text("copingStrategies"), // What they did to cope
  copingEffectiveness: int("copingEffectiveness"), // 1-10 scale
  resilienceScore: int("resilienceScore"), // Calculated resilience score
  isPrivate: mysqlEnum("isPrivate", ["true", "false"]).default("false").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = typeof journalEntries.$inferInsert;

/**
 * Emotion logs - detailed tracking of emotional states
 */
export const emotionLogs = mysqlTable("emotionLogs", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().references(() => clients.id),
  journalEntryId: int("journalEntryId").references(() => journalEntries.id),
  logDate: timestamp("logDate").defaultNow().notNull(),
  emotionType: varchar("emotionType", { length: 100 }).notNull(), // joy, sadness, anger, fear, etc.
  intensity: int("intensity").notNull(), // 1-10 scale
  trigger: text("trigger"),
  physicalSensations: text("physicalSensations"),
  thoughts: text("thoughts"),
  behaviors: text("behaviors"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmotionLog = typeof emotionLogs.$inferSelect;
export type InsertEmotionLog = typeof emotionLogs.$inferInsert;

/**
 * Coping strategies library and effectiveness tracking
 */
export const copingStrategies = mysqlTable("copingStrategies", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().references(() => clients.id),
  strategyName: varchar("strategyName", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }), // breathing, physical, social, cognitive, etc.
  timesUsed: int("timesUsed").default(0).notNull(),
  averageEffectiveness: int("averageEffectiveness"), // Average rating 1-10
  lastUsed: timestamp("lastUsed"),
  isRecommended: mysqlEnum("isRecommended", ["true", "false"]).default("false").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CopingStrategy = typeof copingStrategies.$inferSelect;
export type InsertCopingStrategy = typeof copingStrategies.$inferInsert;

/**
 * AI insights and pattern detection results
 */
export const aiInsights = mysqlTable("aiInsights", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().references(() => clients.id),
  insightDate: timestamp("insightDate").defaultNow().notNull(),
  insightType: varchar("insightType", { length: 100 }).notNull(), // pattern, trend, recommendation, alert
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("low").notNull(),
  actionable: text("actionable"), // Suggested actions
  isRead: mysqlEnum("isRead", ["true", "false"]).default("false").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AiInsight = typeof aiInsights.$inferSelect;
export type InsertAiInsight = typeof aiInsights.$inferInsert;

/**
 * Session types - configurable session offerings with pricing
 */
export const sessionTypes = mysqlTable("sessionTypes", {
  id: int("id").autoincrement().primaryKey(),
  coachId: int("coachId").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  duration: int("duration").notNull(), // in minutes
  price: int("price").notNull(), // in cents (e.g., 7500 = $75.00)
  stripePriceId: varchar("stripePriceId", { length: 255 }), // Stripe recurring price ID for subscriptions
  oneTimePriceId: varchar("oneTimePriceId", { length: 255 }), // Stripe one-time price ID for single sessions
  subscriptionPrice: int("subscriptionPrice"), // Monthly subscription price in cents (optional, defaults to price)
  isActive: mysqlEnum("isActive", ["true", "false"]).default("true").notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SessionType = typeof sessionTypes.$inferSelect;
export type InsertSessionType = typeof sessionTypes.$inferInsert;

/**
 * Sessions/appointments between coach and client
 */
export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  coachId: int("coachId").notNull().references(() => coaches.id),
  clientId: int("clientId").notNull().references(() => clients.id),
  sessionTypeId: int("sessionTypeId").references(() => sessionTypes.id),
  scheduledDate: timestamp("scheduledDate").notNull(),
  duration: int("duration").notNull(), // in minutes
  price: int("price"), // in cents - captured at booking time
  sessionType: varchar("sessionType", { length: 100 }), // legacy field, kept for backward compatibility
  notes: text("notes"),
  status: mysqlEnum("status", ["scheduled", "completed", "cancelled", "no-show"]).default("scheduled").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "refunded", "failed"]).default("pending"),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }), // Stripe checkout session ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

/**
 * Subscriptions table for tracking Stripe subscriptions
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripePriceId: varchar("stripePriceId", { length: 255 }),
  productId: varchar("productId", { length: 64 }).notNull(),
  status: mysqlEnum("status", ["active", "cancelled", "past_due", "unpaid"]).default("active").notNull(),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  cancelledAt: timestamp("cancelledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;
/**
 * Coach availability - recurring weekly schedule
 */
export const coachAvailability = mysqlTable("coachAvailability", {
  id: int("id").autoincrement().primaryKey(),
  coachId: int("coachId").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  dayOfWeek: int("dayOfWeek").notNull(), // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: varchar("startTime", { length: 5 }).notNull(), // HH:MM format (e.g., "09:00")
  endTime: varchar("endTime", { length: 5 }).notNull(), // HH:MM format (e.g., "17:00")
  isActive: mysqlEnum("isActive", ["true", "false"]).default("true").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CoachAvailability = typeof coachAvailability.$inferSelect;
export type InsertCoachAvailability = typeof coachAvailability.$inferInsert;

/**
 * Availability exceptions - time off, holidays, blocked dates
 */
export const availabilityExceptions = mysqlTable("availabilityExceptions", {
  id: int("id").autoincrement().primaryKey(),
  coachId: int("coachId").notNull().references(() => coaches.id, { onDelete: "cascade" }),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  reason: varchar("reason", { length: 255 }), // vacation, holiday, personal, etc.
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AvailabilityException = typeof availabilityExceptions.$inferSelect;
export type InsertAvailabilityException = typeof availabilityExceptions.$inferInsert;

/**
 * Session reminders - track sent reminder emails
 */
export const sessionReminders = mysqlTable("sessionReminders", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  reminderType: mysqlEnum("reminderType", ["24_hour", "1_hour"]).notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SessionReminder = typeof sessionReminders.$inferSelect;
export type InsertSessionReminder = typeof sessionReminders.$inferInsert;

/**
 * Discount codes table - for promotional offers and exit-intent popups
 */
export const discountCodes = mysqlTable("discountCodes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  discountPercent: int("discountPercent").notNull(), // 10 for 10%
  discountAmount: int("discountAmount"), // Fixed amount in cents (optional)
  maxUses: int("maxUses"), // null = unlimited
  usedCount: int("usedCount").default(0).notNull(),
  expiresAt: timestamp("expiresAt"),
  isActive: mysqlEnum("isActive", ["true", "false"]).default("true").notNull(),
  createdBy: int("createdBy").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DiscountCode = typeof discountCodes.$inferSelect;
export type InsertDiscountCode = typeof discountCodes.$inferInsert;

/**
 * Discount code usage tracking
 */
export const discountCodeUsage = mysqlTable("discountCodeUsage", {
  id: int("id").autoincrement().primaryKey(),
  discountCodeId: int("discountCodeId").notNull().references(() => discountCodes.id),
  userId: int("userId").references(() => users.id),
  sessionId: int("sessionId").references(() => sessions.id),
  usedAt: timestamp("usedAt").defaultNow().notNull(),
});

export type DiscountCodeUsage = typeof discountCodeUsage.$inferSelect;
export type InsertDiscountCodeUsage = typeof discountCodeUsage.$inferInsert;

/**
 * AI chat conversations - 24/7 AI coaching chat history
 */
export const aiChatConversations = mysqlTable("aiChatConversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  clientId: int("clientId").references(() => clients.id, { onDelete: "cascade" }), // Optional link to client profile
  title: varchar("title", { length: 255 }), // Auto-generated conversation title
  lastMessageAt: timestamp("lastMessageAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AiChatConversation = typeof aiChatConversations.$inferSelect;
export type InsertAiChatConversation = typeof aiChatConversations.$inferInsert;

/**
 * AI chat messages - individual messages in conversations
 */
export const aiChatMessages = mysqlTable("aiChatMessages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull().references(() => aiChatConversations.id, { onDelete: "cascade" }),
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  content: text("content").notNull(),
  emotionDetected: varchar("emotionDetected", { length: 100 }), // AI-detected emotion from user message
  crisisFlag: mysqlEnum("crisisFlag", ["none", "low", "medium", "high", "critical"]).default("none").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AiChatMessage = typeof aiChatMessages.$inferSelect;
export type InsertAiChatMessage = typeof aiChatMessages.$inferInsert;

/**
 * Platform settings - global configuration for the coaching platform
 */
export const platformSettings = mysqlTable("platformSettings", {
  id: int("id").autoincrement().primaryKey(),
  aiCoachingEnabled: mysqlEnum("aiCoachingEnabled", ["true", "false"]).default("false").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PlatformSetting = typeof platformSettings.$inferSelect;
export type InsertPlatformSetting = typeof platformSettings.$inferInsert;


/**
 * Video Testimonials - real client video testimonials
 */
export const videoTestimonials = mysqlTable("videoTestimonials", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // Client name
  title: varchar("title", { length: 255 }).notNull(), // Client title/role
  company: varchar("company", { length: 255 }).notNull(), // Client company
  quote: text("quote").notNull(), // Text quote/testimonial
  metric: varchar("metric", { length: 255 }).notNull(), // Metric name (e.g., "Healthcare Cost Savings")
  metricValue: varchar("metricValue", { length: 100 }).notNull(), // Metric value (e.g., "$2.3M")
  videoUrl: text("videoUrl"), // S3 URL to video file
  videoKey: varchar("videoKey", { length: 500 }), // S3 key for video file
  thumbnailUrl: text("thumbnailUrl"), // S3 URL to thumbnail image
  thumbnailKey: varchar("thumbnailKey", { length: 500 }), // S3 key for thumbnail
  duration: int("duration"), // Video duration in seconds
  isPublished: mysqlEnum("isPublished", ["true", "false"]).default("false").notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VideoTestimonial = typeof videoTestimonials.$inferSelect;
export type InsertVideoTestimonial = typeof videoTestimonials.$inferInsert;

// Emergency Contacts for Crisis Management
export const emergencyContacts = mysqlTable("emergency_contacts", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("client_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  relationship: varchar("relationship", { length: 100 }),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 320 }),
  isPrimary: boolean("is_primary").default(false),
  notifyOnCrisis: boolean("notify_on_crisis").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Crisis Events Tracking
export const crisisEvents = mysqlTable("crisis_events", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("client_id").notNull(),
  detectedAt: timestamp("detected_at").defaultNow(),
  severity: mysqlEnum("severity", ["medium", "high", "critical"]).notNull(),
  triggerType: varchar("trigger_type", { length: 100 }),
  triggerData: text("trigger_data"),
  actionsTaken: text("actions_taken"),
  notificationsSent: text("notifications_sent"),
  resolvedAt: timestamp("resolved_at"),
  notes: text("notes"),
});

// Safety Plans
export const safetyPlans = mysqlTable("safety_plans", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("client_id").notNull(),
  warningSign: text("warning_sign"),
  copingStrategy: text("coping_strategy"),
  socialSupport: text("social_support"),
  professionalContact: text("professional_contact"),
  environmentSafety: text("environment_safety"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Gamification - User Points
export const userPoints = mysqlTable("user_points", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  points: int("points").default(0),
  level: int("level").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Achievements
export const achievements = mysqlTable("achievements", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 255 }),
  pointValue: int("point_value").default(0),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Achievements
export const userAchievements = mysqlTable("user_achievements", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  achievementId: int("achievement_id").notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Streaks
export const streaks = mysqlTable("streaks", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  activityType: varchar("activity_type", { length: 100 }).notNull(),
  currentStreak: int("current_streak").default(0),
  longestStreak: int("longest_streak").default(0),
  lastActivityDate: date("last_activity_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Wearable Devices
export const wearableDevices = mysqlTable("wearable_devices", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  deviceType: varchar("device_type", { length: 100 }).notNull(),
  deviceId: varchar("device_id", { length: 255 }),
  isActive: boolean("is_active").default(true),
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Health Metrics
export const healthMetrics = mysqlTable("health_metrics", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  metricDate: timestamp("metric_date").notNull(),
  heartRate: int("heart_rate"),
  hrv: int("hrv"),
  steps: int("steps"),
  sleepDuration: int("sleep_duration"),
  sleepQuality: int("sleep_quality"),
  restingHeartRate: int("resting_heart_rate"),
  activeMinutes: int("active_minutes"),
  calories: int("calories"),
  deviceId: int("device_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// A/B Tests
export const abTests = mysqlTable("ab_tests", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  status: mysqlEnum("status", ["draft", "active", "completed", "archived"]).default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
});

// A/B Test Variants
export const abTestVariants = mysqlTable("ab_test_variants", {
  id: int("id").primaryKey().autoincrement(),
  testId: int("test_id").notNull(),
  variantName: varchar("variant_name", { length: 100 }).notNull(),
  description: text("description"),
  trafficAllocation: int("traffic_allocation").default(50),
  conversions: int("conversions").default(0),
  impressions: int("impressions").default(0),
});

// User Cohorts
export const userCohorts = mysqlTable("user_cohorts", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  cohortDate: date("cohort_date").notNull(),
  acquisitionChannel: varchar("acquisition_channel", { length: 100 }),
  initialPlan: varchar("initial_plan", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Revenue Metrics
export const revenueMetrics = mysqlTable("revenue_metrics", {
  id: int("id").primaryKey().autoincrement(),
  date: date("date").notNull(),
  mrr: int("mrr").default(0),
  arr: int("arr").default(0),
  newMrr: int("new_mrr").default(0),
  churnedMrr: int("churned_mrr").default(0),
  expansionMrr: int("expansion_mrr").default(0),
  activeSubscriptions: int("active_subscriptions").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Video Sessions
export const videoSessions = mysqlTable("video_sessions", {
  id: int("id").primaryKey().autoincrement(),
  sessionId: int("session_id").notNull(),
  zoomMeetingId: varchar("zoom_meeting_id", { length: 255 }),
  recordingUrl: varchar("recording_url", { length: 500 }),
  duration: int("duration"),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Health Records
export const healthRecords = mysqlTable("health_records", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("client_id").notNull(),
  recordType: varchar("record_type", { length: 100 }).notNull(),
  recordDate: timestamp("record_date").notNull(),
  provider: varchar("provider", { length: 255 }),
  diagnosis: text("diagnosis"),
  treatment: text("treatment"),
  medications: text("medications"),
  labResults: text("lab_results"),
  notes: text("notes"),
  fhirResourceId: varchar("fhir_resource_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Medications
export const medications = mysqlTable("medications", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("client_id").notNull(),
  medicationName: varchar("medication_name", { length: 255 }).notNull(),
  dosage: varchar("dosage", { length: 100 }),
  frequency: varchar("frequency", { length: 100 }),
  startDate: date("start_date"),
  endDate: date("end_date"),
  prescribedBy: varchar("prescribed_by", { length: 255 }),
  purpose: text("purpose"),
  sideEffects: text("side_effects"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Lab Results
export const labResults = mysqlTable("lab_results", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("client_id").notNull(),
  testDate: timestamp("test_date").notNull(),
  testName: varchar("test_name", { length: 255 }).notNull(),
  result: varchar("result", { length: 255 }),
  unit: varchar("unit", { length: 50 }),
  referenceRange: varchar("reference_range", { length: 100 }),
  status: mysqlEnum("status", ["normal", "abnormal", "critical"]),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});
