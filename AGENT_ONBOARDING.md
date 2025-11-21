# Manus Agent Onboarding: Purposeful Live Coaching Platform

**Version:** 1.0
**Last Updated:** 2025-11-21

## 1. Project Overview

This document provides a comprehensive guide for Manus agents working on the **Purposeful Live Coaching platform**. The platform is a total wellness operating system designed to become the global standard for health, happiness, and prosperity. It consists of three main components:

*   **Enterprise:** The core B2B platform for corporate clients.
*   **Individual:** A B2C platform for individual coaching clients.
*   **Dashboard:** An administrative dashboard for managing the platform.

## 2. Master Prompt Compliance

All work on this project **must** strictly adhere to the user's master prompts. Failure to do so is a critical error. The key principles are:

### **Manus MASTER PROMPT**

*   **Production-Ready Results:** No placeholders, no generic advice, no fluff. All work must be final and executable.
*   **High-Conversion Agency Mode:** Operate as the Chief Revenue Architect. Every element must be optimized for conversion, clarity, and trust.
*   **Billion-Dollar Test:** Every asset must justify its existence by increasing trust, clarity, or conversions. If not, it must be removed or rewritten.
*   **Tone & Execution:** Confident, clear, and authoritative. No filler or vagueness. Build with "quiet, elite, masculine authority."

### **⚡HIGH-CONVERSION AGENCY MODE⚡**

*   **Data-Backed UX:** Follow proven frameworks from top-tier consulting firms (Deloitte, PwC, McKinsey).
*   **Conversion Psychology:** Use direct-response principles (CXL, Nielsen Norman).
*   **High-Ticket Frameworks:** Premium positioning, authority tone, and outcome-focused copy.
*   **Zero Cognitive Load:** Eliminate friction and unnecessary steps.
*   **Trust-Heavy Positioning:** Emphasize security, audit readiness, and credibility.

## 3. Technical Architecture

The platform is a full-stack application with the following technologies:

| Component | Technology |
| :--- | :--- |
| **Frontend** | React, TypeScript, Tailwind CSS, Vite |
| **Backend** | Node.js, Express, tRPC |
| **Database** | MySQL (via Drizzle ORM) |
| **Payments** | Stripe |
| **Package Manager** | pnpm |

### Project Structure

The repository is organized into three main directories:

*   `/client`: Contains the frontend React application.
*   `/server`: Contains the backend Node.js application, including tRPC routers and database logic.
*   `/shared`: Contains code shared between the client and server.

## 4. Deployment Guide (Development)

To set up a local development environment, follow these steps:

1.  **Install Dependencies:**

    ```bash
    pnpm install
    ```

2.  **Configure Environment Variables:**

    Create a `.env` file in the project root and add the following, replacing the placeholder with your MySQL database connection string:

    ```env
    DATABASE_URL="mysql://username:password@localhost:3306/purposeful_coaching"
    ```

3.  **Set Up Database:**

    Ensure your MySQL server is running, then run the following command to create the database tables:

    ```bash
    pnpm db:push
    ```

4.  **Start the Development Server:**

    ```bash
    pnpm dev
    ```

    The application will be available at `http://localhost:3000`.

## 5. Current Priorities

The `MASTER-TODO.md` file outlines the current project priorities. The most critical tasks are:

*   **Fixing the booking flow:** The booking process must work without requiring user authentication.
*   **Resolving the pricing card loading issue:** The pricing cards are not loading on the published site.
*   **Auditing all button functionality:** All buttons on the landing pages and booking flow must be tested and fixed.

## 6. Agent Workflow

All agents must follow this workflow to ensure compliance and efficiency:

1.  **PLAN:** Before starting any task, create a clear plan of action.
2.  **OUTPUT:** Execute the plan, ensuring all work is production-ready and compliant with the master prompts.
3.  **RUN/USE:** Start the application and test the changes in a live environment.
4.  **TEST/VALIDATE:** Thoroughly test the changes to ensure they work as expected and do not introduce any new issues.
5.  **NEXT:** Once the task is complete and validated, move on to the next priority.

