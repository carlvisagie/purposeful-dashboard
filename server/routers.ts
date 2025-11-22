import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

import {
  coachesRouter,
  clientsRouter,
  journalRouter,
  emotionLogsRouter,
  copingStrategiesRouter,
  sessionsRouter,
} from "./routers/coaching";

import { aiInsightsRouter } from "./routers/aiInsights";
import { stripeRouter } from "./routers/stripe";
import { schedulingRouter } from "./routers/scheduling";
import { sessionTypesRouter } from "./routers/sessionTypes";
import { sessionPaymentsRouter } from "./routers/sessionPayments";
import { aiChatRouter } from "./routers/aiChat";
import { platformSettingsRouter } from "./routers/platformSettings";
import { socialProofRouter } from "./routers/socialProof";
import { aiFeedbackRouter } from "./routers/aiFeedback";
import { emailCaptureRouter } from "./routers/emailCapture";
import { abTestingRouter } from "./routers/abTesting";
import { chatRouter } from "./routers/chat";
import { analyticsRouter } from "./routers/analytics";
import { videoTestimonialsRouter } from "./routers/videoTestimonials";

// ✅ FIXED imports — using default exports from your new MVP routers:
import crisisManagement from "./routers/crisisManagement";
import psychologicalProfiling from "./routers/psychologicalProfiling";
import traumaCare from "./routers/traumaCare";

import { emergencyContactsRouter } from "./routers/emergencyContacts";
import { safetyPlansRouter } from "./routers/safetyPlans";
import { gamificationRouter } from "./routers/gamification";
import { wearablesRouter } from "./routers/wearables";
import { businessIntelligenceRouter } from "./routers/businessIntelligence";
import { healthRecordsRouter } from "./routers/healthRecords";
import { environmentalHealthRouter } from "./routers/environmentalHealth";
import { smartHomeRouter } from "./routers/smartHome";
import { digitalWellnessRouter } from "./routers/digitalWellness";
import { professionalNetworkRouter } from "./routers/professionalNetwork";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Coaching platform routers
  coaches: coachesRouter,
  clients: clientsRouter,
  journal: journalRouter,
  emotionLogs: emotionLogsRouter,
  copingStrategies: copingStrategiesRouter,
  aiInsights: aiInsightsRouter,
  sessions: sessionsRouter,
  stripe: stripeRouter,
  scheduling: schedulingRouter,
  sessionTypes: sessionTypesRouter,
  sessionPayments: sessionPaymentsRouter,
  aiChat: aiChatRouter,
  platformSettings: platformSettingsRouter,
  socialProof: socialProofRouter,
  aiFeedback: aiFeedbackRouter,
  emailCapture: emailCaptureRouter,
  abTesting: abTestingRouter,
  chat: chatRouter,
  analytics: analyticsRouter,
  videoTestimonials: videoTestimonialsRouter,

  // 🚀 FIXED: MVP-safe versions of advanced routers
  crisisManagement: crisisManagement,
  psychologicalProfiling: psychologicalProfiling,
  traumaCare: traumaCare,

  emergencyContacts: emergencyContactsRouter,
  safetyPlans: safetyPlansRouter,
  gamification: gamificationRouter,
  wearables: wearablesRouter,
  businessIntelligence: businessIntelligenceRouter,
  healthRecords: healthRecordsRouter,
  environmentalHealth: environmentalHealthRouter,
  smartHome: smartHomeRouter,
  digitalWellness: digitalWellnessRouter,
  professionalNetwork: professionalNetworkRouter,
});

export type AppRouter = typeof appRouter;

