/**
 * Email Service for Subscription Notifications
 * Sends beautifully formatted HTML emails for subscription events
 */

interface EmailParams {
  type: "new_subscription" | "payment_confirmed" | "payment_failed" | "subscription_cancelled";
  to: string;
  customerName: string;
  productName?: string;
  amount?: number;
  subscriptionId?: string;
  invoiceUrl?: string;
  cancellationDate?: Date;
}

/**
 * Send subscription-related email
 * Currently logs to console - integrate with email provider when ready
 */
export async function sendSubscriptionEmail(params: EmailParams): Promise<void> {
  const { type, to, customerName } = params;

  let subject: string;
  let htmlBody: string;

  switch (type) {
    case "new_subscription":
      subject = "Welcome to Purposeful Live Coaching! 🎉";
      htmlBody = getNewSubscriptionTemplate(params);
      break;

    case "payment_confirmed":
      subject = "Payment Confirmed - Purposeful Live Coaching";
      htmlBody = getPaymentConfirmedTemplate(params);
      break;

    case "payment_failed":
      subject = "Action Required: Payment Failed";
      htmlBody = getPaymentFailedTemplate(params);
      break;

    case "subscription_cancelled":
      subject = "Subscription Cancelled - We'll Miss You";
      htmlBody = getSubscriptionCancelledTemplate(params);
      break;

    default:
      console.error(`[Email] Unknown email type: ${type}`);
      return;
  }

  // TODO: Replace with actual email sending service (SendGrid, AWS SES, etc.)
  console.log(`[Email] Sending ${type} email to ${to}`);
  console.log(`[Email] Subject: ${subject}`);
  console.log(`[Email] Body preview: ${htmlBody.substring(0, 200)}...`);

  // For now, just log. In production, integrate with email service:
  // await sendEmailViaProvider({ to, subject, html: htmlBody });
}

/**
 * Format currency for display
 */
function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Email template for new subscription
 */
function getNewSubscriptionTemplate(params: EmailParams): string {
  const { customerName, productName, amount } = params;
  const price = amount ? formatCurrency(amount) : "N/A";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Purposeful Live Coaching</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f43f5e 0%, #a855f7 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Welcome to Purposeful Live! 🎉</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Hi ${customerName},
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Thank you for subscribing to <strong>${productName || "Purposeful Live Coaching"}</strong>! 
                We're thrilled to have you on this transformational journey toward emotional resilience and well-being.
              </p>
              
              <div style="background-color: #f9fafb; border-left: 4px solid #f43f5e; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Your Subscription</p>
                <p style="margin: 0; font-size: 24px; font-weight: bold; color: #111827;">${price}/month</p>
              </div>
              
              <h2 style="margin: 30px 0 15px; font-size: 20px; color: #111827;">What Happens Next?</h2>
              
              <ul style="margin: 0 0 30px; padding-left: 20px; color: #374151; line-height: 1.8;">
                <li>Access your dashboard to start tracking your emotional resilience</li>
                <li>Begin journaling and receive AI-powered insights</li>
                <li>Schedule your first coaching session</li>
                <li>Explore personalized coping strategies</li>
              </ul>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="https://purposefullivecoaching.manus.space/dashboard" style="display: inline-block; background-color: #f43f5e; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Get Started Now →
                </a>
              </div>
              
              <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                Questions? Reply to this email or contact us at <a href="mailto:carl@keepyourcontracts.com" style="color: #f43f5e; text-decoration: none;">carl@keepyourcontracts.com</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                © 2025 Purposeful Live Coaching. All rights reserved.
              </p>
              <p style="margin: 10px 0 0; font-size: 12px; color: #9ca3af;">
                You're receiving this email because you subscribed to Purposeful Live Coaching.
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
 * Email template for payment confirmation
 */
function getPaymentConfirmedTemplate(params: EmailParams): string {
  const { customerName, amount, invoiceUrl } = params;
  const price = amount ? formatCurrency(amount) : "N/A";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #10b981; padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
              <div style="font-size: 48px; margin-bottom: 10px;">✓</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Payment Confirmed</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Hi ${customerName},
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Your payment has been successfully processed. Thank you for continuing your journey with Purposeful Live Coaching!
              </p>
              
              <div style="background-color: #f0fdf4; border: 2px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 8px; text-align: center;">
                <p style="margin: 0 0 10px; font-size: 14px; color: #047857; text-transform: uppercase; font-weight: 600;">Amount Paid</p>
                <p style="margin: 0; font-size: 32px; font-weight: bold; color: #065f46;">${price}</p>
              </div>
              
              ${invoiceUrl ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${invoiceUrl}" style="display: inline-block; background-color: #6b7280; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                  View Invoice
                </a>
              </div>
              ` : ''}
              
              <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                Your subscription will automatically renew next month. You can manage your subscription anytime from your dashboard.
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
 * Email template for payment failure
 */
function getPaymentFailedTemplate(params: EmailParams): string {
  const { customerName, amount, invoiceUrl } = params;
  const price = amount ? formatCurrency(amount) : "N/A";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Failed - Action Required</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #ef4444; padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
              <div style="font-size: 48px; margin-bottom: 10px;">⚠️</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Payment Failed - Action Required</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Hi ${customerName},
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                We were unable to process your recent payment of <strong>${price}</strong>. This could be due to:
              </p>
              
              <ul style="margin: 0 0 30px; padding-left: 20px; color: #374151; line-height: 1.8;">
                <li>Insufficient funds</li>
                <li>Expired card</li>
                <li>Incorrect billing information</li>
                <li>Card declined by your bank</li>
              </ul>
              
              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #991b1b; font-weight: 600;">
                  ⏰ Please update your payment method within 7 days to avoid service interruption.
                </p>
              </div>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${invoiceUrl || 'https://purposefullivecoaching.manus.space/dashboard'}" style="display: inline-block; background-color: #ef4444; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Update Payment Method
                </a>
              </div>
              
              <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                Need help? Contact us at <a href="mailto:carl@keepyourcontracts.com" style="color: #f43f5e; text-decoration: none;">carl@keepyourcontracts.com</a>
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
 * Email template for subscription cancellation
 */
function getSubscriptionCancelledTemplate(params: EmailParams): string {
  const { customerName, cancellationDate } = params;
  const cancelDate = cancellationDate ? cancellationDate.toLocaleDateString() : "today";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Cancelled</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #6b7280; padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Subscription Cancelled</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Hi ${customerName},
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Your subscription to Purposeful Live Coaching has been cancelled as of ${cancelDate}. 
                We're sorry to see you go, and we hope we were able to help you on your journey.
              </p>
              
              <div style="background-color: #f9fafb; border-left: 4px solid #6b7280; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280; font-weight: 600;">What This Means</p>
                <ul style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.8;">
                  <li>You will not be charged again</li>
                  <li>You'll have access until the end of your current billing period</li>
                  <li>Your data will be securely stored for 90 days</li>
                </ul>
              </div>
              
              <h2 style="margin: 30px 0 15px; font-size: 20px; color: #111827;">We'd Love Your Feedback</h2>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                Your feedback helps us improve. Would you mind sharing why you cancelled? 
                Reply to this email—we read every response.
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="https://purposefullivecoaching.manus.space" style="display: inline-block; background-color: #f43f5e; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Reactivate Subscription
                </a>
              </div>
              
              <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #6b7280; text-align: center;">
                Changed your mind? You can reactivate anytime—your progress will be waiting for you.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                © 2025 Purposeful Live Coaching. All rights reserved.
              </p>
              <p style="margin: 10px 0 0; font-size: 12px; color: #9ca3af;">
                Thank you for being part of our community.
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
