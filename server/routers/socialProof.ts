import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

// In-memory store for real-time activity (will be replaced with database for production)
// Format: { pageType: { count: number, lastUpdated: timestamp } }
const activityStore = new Map<string, { count: number; lastUpdated: number }>();

// Real-time page view tracking (simulated)
const pageViews = new Map<string, number>();

// Recent bookings (simulated - in production, query from sessions table)
const recentBookings: Array<{
  id: string;
  name: string;
  sessionType: string;
  timestamp: number;
}> = [];

/**
 * Track page view for social proof
 */
function trackPageView(pageType: string) {
  const current = pageViews.get(pageType) || 0;
  pageViews.set(pageType, current + 1);

  // Keep activity count between 3-8 for realistic social proof
  // (in production, this would be actual concurrent users)
  const randomCount = Math.floor(Math.random() * 6) + 3;
  activityStore.set(pageType, {
    count: randomCount,
    lastUpdated: Date.now(),
  });
}

/**
 * Add a simulated recent booking for social proof
 */
function addRecentBooking(name: string, sessionType: string) {
  const booking = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    sessionType,
    timestamp: Date.now(),
  };

  recentBookings.unshift(booking);

  // Keep only last 10 bookings
  if (recentBookings.length > 10) {
    recentBookings.pop();
  }
}

export const socialProofRouter = router({
  /**
   * Get current page activity (people viewing)
   */
  getPageActivity: publicProcedure
    .input(
      z.object({
        pageType: z.enum([
          "decision-tree",
          "ai-coaching",
          "book-session",
          "enterprise",
        ]),
      })
    )
    .query(({ input }) => {
      trackPageView(input.pageType);

      const activity = activityStore.get(input.pageType);
      return {
        pageType: input.pageType,
        viewersCount: activity?.count || 0,
        lastUpdated: activity?.lastUpdated || Date.now(),
      };
    }),

  /**
   * Get recent bookings for social proof notifications
   */
  getRecentBookings: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).default(5),
      })
    )
    .query(({ input }) => {
      // Return most recent bookings
      return recentBookings.slice(0, input.limit).map((booking) => ({
        id: booking.id,
        name: booking.name,
        sessionType: booking.sessionType,
        timeAgo: getTimeAgo(booking.timestamp),
      }));
    }),

  /**
   * Simulate a new booking (for demo/testing)
   * In production, this would be called from the actual booking flow
   */
  simulateBooking: publicProcedure
    .input(
      z.object({
        name: z.string(),
        sessionType: z.string(),
      })
    )
    .mutation(({ input }) => {
      addRecentBooking(input.name, input.sessionType);
      return { success: true };
    }),

  /**
   * Get urgency metrics for scarcity display
   */
  getUrgencyMetrics: publicProcedure.query(() => {
    // In production, calculate from actual booking data
    const totalViewers = Array.from(pageViews.values()).reduce(
      (a, b) => a + b,
      0
    );
    const conversionRate = Math.floor(Math.random() * 15) + 8; // 8-23%

    return {
      totalViewers,
      recentBookings: recentBookings.length,
      conversionRate,
      lastUpdated: Date.now(),
    };
  }),
});

/**
 * Helper: Format timestamp as "X minutes ago"
 */
function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
