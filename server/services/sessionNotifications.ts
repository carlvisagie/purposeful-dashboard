/**
 * Session notification service
 * Sends email notifications for session bookings, cancellations, and reminders
 */

interface SessionNotificationParams {
  type: "booking" | "cancellation" | "reschedule" | "reminder_24h" | "reminder_1h";
  clientEmail: string;
  clientName: string;
  coachEmail?: string;
  coachName?: string;
  sessionDate: Date;
  sessionType?: string;
  duration: number;
  zoomLink?: string;
  cancellationReason?: string;
}

/**
 * Send session-related email notification
 * Currently logs to console - integrate with email provider when ready
 */
export async function sendSessionNotification(params: SessionNotificationParams): Promise<void> {
  const { type, clientEmail, clientName, coachEmail, coachName, sessionDate, sessionType, duration, zoomLink, cancellationReason } = params;

  let subject: string;
  let htmlBody: string;

  switch (type) {
    case "booking":
      subject = "Session Confirmed - Purposeful Live Coaching";
      htmlBody = getBookingConfirmationTemplate(params);
      break;

    case "cancellation":
      subject = "Session Cancelled - Purposeful Live Coaching";
      htmlBody = getCancellationTemplate(params);
      break;

    case "reschedule":
      subject = "Session Rescheduled - Purposeful Live Coaching";
      htmlBody = getRescheduleTemplate(params);
      break;

    case "reminder_24h":
      subject = "Reminder: Your Session Tomorrow";
      htmlBody = get24HourReminderTemplate(params);
      break;

    case "reminder_1h":
      subject = "Reminder: Your Session Starts in 1 Hour";
      htmlBody = get1HourReminderTemplate(params);
      break;

    default:
      console.error(`[SessionNotification] Unknown notification type: ${type}`);
      return;
  }

  // TODO: Replace with actual email sending service (SendGrid, AWS SES, etc.)
  console.log(`[SessionNotification] Sending ${type} email to ${clientEmail}`);
  console.log(`[SessionNotification] Subject: ${subject}`);
  console.log(`[SessionNotification] Body preview: ${htmlBody.substring(0, 200)}...`);

  // If coach email is provided, send to coach as well
  if (coachEmail && (type === "booking" || type === "cancellation" || type === "reschedule")) {
    console.log(`[SessionNotification] Also sending ${type} email to coach: ${coachEmail}`);
  }

  // For now, just log. In production, integrate with email service:
  // await sendEmailViaProvider({ to: clientEmail, subject, html: htmlBody });
  // if (coachEmail) await sendEmailViaProvider({ to: coachEmail, subject, html: htmlBody });
}

/**
 * Format date and time for display
 */
function formatDateTime(date: Date): { date: string; time: string } {
  return {
    date: date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

/**
 * Booking confirmation email template
 */
function getBookingConfirmationTemplate(params: SessionNotificationParams): string {
  const { clientName, sessionDate, sessionType, duration, zoomLink } = params;
  const { date, time } = formatDateTime(sessionDate);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Session Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f43f5e 0%, #a855f7 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Session Confirmed! ✓</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Hi ${clientName},
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Your coaching session has been successfully scheduled! We're looking forward to connecting with you.
              </p>
              
              <div style="background-color: #f9fafb; border-left: 4px solid #f43f5e; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h2 style="margin: 0 0 15px; font-size: 18px; color: #111827;">Session Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Date:</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 14px;">${date}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Time:</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 14px;">${time}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Duration:</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 14px;">${duration} minutes</td>
                  </tr>
                  ${sessionType ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Type:</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 14px;">${sessionType}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${zoomLink || 'https://zoom.us/j/8201808284'}" style="display: inline-block; background-color: #f43f5e; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Join Zoom Meeting
                </a>
              </div>
              
              <div style="background-color: #eff6ff; border: 1px solid #3b82f6; padding: 15px; border-radius: 6px; margin: 30px 0;">
                <p style="margin: 0; font-size: 14px; color: #1e40af;">
                  <strong>📅 Add to Calendar:</strong> We recommend adding this session to your calendar so you don't miss it!
                </p>
              </div>
              
              <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                Need to reschedule? Visit your <a href="https://purposefullivecoaching.manus.space/my-sessions" style="color: #f43f5e; text-decoration: none;">sessions page</a> or contact us at <a href="mailto:carl@keepyourcontracts.com" style="color: #f43f5e; text-decoration: none;">carl@keepyourcontracts.com</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                © 2025 Purposeful Live Coaching. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Cancellation email template
 */
function getCancellationTemplate(params: SessionNotificationParams): string {
  const { clientName, sessionDate, cancellationReason } = params;
  const { date, time } = formatDateTime(sessionDate);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Session Cancelled</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #6b7280; padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Session Cancelled</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Hi ${clientName},
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Your coaching session scheduled for <strong>${date}</strong> at <strong>${time}</strong> has been cancelled.
              </p>
              
              ${cancellationReason ? `
              <div style="background-color: #f9fafb; border-left: 4px solid #6b7280; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                  <strong>Reason:</strong> ${cancellationReason}
                </p>
              </div>
              ` : ''}
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="https://purposefullivecoaching.manus.space/book-session" style="display: inline-block; background-color: #f43f5e; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Book Another Session
                </a>
              </div>
              
              <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #6b7280; text-align: center;">
                Questions? Contact us at <a href="mailto:carl@keepyourcontracts.com" style="color: #f43f5e; text-decoration: none;">carl@keepyourcontracts.com</a>
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                © 2025 Purposeful Live Coaching. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Reschedule email template
 */
function getRescheduleTemplate(params: SessionNotificationParams): string {
  const { clientName, sessionDate, sessionType, duration, zoomLink } = params;
  const { date, time } = formatDateTime(sessionDate);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Session Rescheduled</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Session Rescheduled</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Hi ${clientName},
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Your coaching session has been rescheduled to a new time.
              </p>
              
              <div style="background-color: #f9fafb; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h2 style="margin: 0 0 15px; font-size: 18px; color: #111827;">New Session Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Date:</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 14px;">${date}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Time:</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 14px;">${time}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Duration:</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 14px;">${duration} minutes</td>
                  </tr>
                </table>
              </div>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${zoomLink || 'https://zoom.us/j/8201808284'}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Join Zoom Meeting
                </a>
              </div>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                © 2025 Purposeful Live Coaching. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * 24-hour reminder email template
 */
function get24HourReminderTemplate(params: SessionNotificationParams): string {
  const { clientName, sessionDate, sessionType, duration, zoomLink } = params;
  const { date, time } = formatDateTime(sessionDate);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Session Reminder - Tomorrow</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #10b981; padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
              <div style="font-size: 48px; margin-bottom: 10px;">⏰</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Your Session is Tomorrow!</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Hi ${clientName},
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                This is a friendly reminder that your coaching session is scheduled for tomorrow.
              </p>
              
              <div style="background-color: #f0fdf4; border: 2px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 8px; text-align: center;">
                <p style="margin: 0 0 10px; font-size: 14px; color: #047857; text-transform: uppercase; font-weight: 600;">Tomorrow</p>
                <p style="margin: 0 0 5px; font-size: 20px; font-weight: bold; color: #065f46;">${date}</p>
                <p style="margin: 0; font-size: 24px; font-weight: bold; color: #065f46;">${time}</p>
              </div>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${zoomLink || 'https://zoom.us/j/8201808284'}" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Join Zoom Meeting
                </a>
              </div>
              
              <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #6b7280; text-align: center;">
                Need to reschedule? <a href="https://purposefullivecoaching.manus.space/my-sessions" style="color: #10b981; text-decoration: none;">Manage your sessions</a>
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                © 2025 Purposeful Live Coaching. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * 1-hour reminder email template
 */
function get1HourReminderTemplate(params: SessionNotificationParams): string {
  const { clientName, sessionDate, zoomLink } = params;
  const { time } = formatDateTime(sessionDate);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Session Starting Soon!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #f59e0b; padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
              <div style="font-size: 48px; margin-bottom: 10px;">🔔</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Your Session Starts in 1 Hour!</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Hi ${clientName},
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Your coaching session starts in <strong>1 hour</strong> at <strong>${time}</strong>.
              </p>
              
              <div style="background-color: #fffbeb; border: 2px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 8px;">
                <p style="margin: 0 0 15px; font-size: 14px; color: #92400e; font-weight: 600;">
                  📝 Quick Preparation Tips:
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #92400e; line-height: 1.8;">
                  <li>Find a quiet, comfortable space</li>
                  <li>Test your camera and microphone</li>
                  <li>Have a glass of water nearby</li>
                  <li>Prepare any topics you'd like to discuss</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${zoomLink || 'https://zoom.us/j/8201808284'}" style="display: inline-block; background-color: #f59e0b; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-weight: 600; font-size: 18px;">
                  Join Zoom Meeting Now
                </a>
              </div>
              
              <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #6b7280; text-align: center;">
                See you soon! 👋
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                © 2025 Purposeful Live Coaching. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
