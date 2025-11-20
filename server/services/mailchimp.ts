import axios from "axios";
import { ENV } from "../_core/env";

/**
 * Mailchimp Integration Service
 * Handles email list management, subscriber addition, and tagging
 */

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_SERVER = MAILCHIMP_API_KEY?.split("-")[1] || "us22";
const MAILCHIMP_BASE_URL = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0`;

interface MailchimpSubscriber {
  email_address: string;
  status: "subscribed" | "unsubscribed" | "cleaned" | "pending";
  merge_fields?: Record<string, string>;
  tags?: string[];
}

/**
 * Get the default audience ID (list ID) from Mailchimp
 * Falls back to environment variable if set
 */
async function getDefaultAudienceId(): Promise<string> {
  try {
    const response = await axios.get(`${MAILCHIMP_BASE_URL}/lists`, {
      auth: {
        username: "anystring",
        password: MAILCHIMP_API_KEY || "",
      },
    });

    const lists = response.data.lists;
    if (lists && lists.length > 0) {
      return lists[0].id; // Return first list ID
    }
  } catch (error) {
    console.error("[Mailchimp] Failed to get audience ID:", error);
  }

  // Fallback - this should be set in environment
  return process.env.MAILCHIMP_LIST_ID || "";
}

/**
 * Add or update a subscriber in Mailchimp
 */
export async function addSubscriberToMailchimp(
  email: string,
  source: "exit_intent" | "roi_calculator" | "chat",
  leadType: "corporate" | "individual"
): Promise<boolean> {
  try {
    if (!MAILCHIMP_API_KEY) {
      console.warn("[Mailchimp] API key not configured");
      return false;
    }

    const audienceId = await getDefaultAudienceId();
    if (!audienceId) {
      console.warn("[Mailchimp] Audience ID not found");
      return false;
    }

    // Create subscriber object
    const subscriber: MailchimpSubscriber = {
      email_address: email,
      status: "pending", // Requires confirmation
      merge_fields: {
        FNAME: "Lead",
        LTYPE: leadType.toUpperCase(),
        SOURCE: source.toUpperCase(),
      },
      tags: [leadType, source],
    };

    // Add/update subscriber
    const response = await axios.put(
      `${MAILCHIMP_BASE_URL}/lists/${audienceId}/members/${getEmailHash(email)}`,
      subscriber,
      {
        auth: {
          username: "anystring",
          password: MAILCHIMP_API_KEY,
        },
      }
    );

    console.log(`[Mailchimp] Subscriber added: ${email}`);
    return response.status === 200;
  } catch (error) {
    console.error("[Mailchimp] Failed to add subscriber:", error);
    return false;
  }
}

/**
 * Get MD5 hash of email for Mailchimp subscriber ID
 */
function getEmailHash(email: string): string {
  const crypto = require("crypto");
  return crypto.createHash("md5").update(email.toLowerCase()).digest("hex");
}

/**
 * Add tag to existing subscriber
 */
export async function tagSubscriber(
  email: string,
  tags: string[]
): Promise<boolean> {
  try {
    if (!MAILCHIMP_API_KEY) {
      console.warn("[Mailchimp] API key not configured");
      return false;
    }

    const audienceId = await getDefaultAudienceId();
    if (!audienceId) {
      console.warn("[Mailchimp] Audience ID not found");
      return false;
    }

    const response = await axios.post(
      `${MAILCHIMP_BASE_URL}/lists/${audienceId}/members/${getEmailHash(email)}/tags`,
      {
        tags: tags.map((tag) => ({ name: tag, status: "active" })),
      },
      {
        auth: {
          username: "anystring",
          password: MAILCHIMP_API_KEY,
        },
      }
    );

    console.log(`[Mailchimp] Tags added to ${email}:`, tags);
    return response.status === 200;
  } catch (error) {
    console.error("[Mailchimp] Failed to tag subscriber:", error);
    return false;
  }
}

/**
 * Get subscriber info from Mailchimp
 */
export async function getSubscriber(email: string) {
  try {
    if (!MAILCHIMP_API_KEY) {
      console.warn("[Mailchimp] API key not configured");
      return null;
    }

    const audienceId = await getDefaultAudienceId();
    if (!audienceId) {
      console.warn("[Mailchimp] Audience ID not found");
      return null;
    }

    const response = await axios.get(
      `${MAILCHIMP_BASE_URL}/lists/${audienceId}/members/${getEmailHash(email)}`,
      {
        auth: {
          username: "anystring",
          password: MAILCHIMP_API_KEY,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("[Mailchimp] Failed to get subscriber:", error);
    return null;
  }
}
