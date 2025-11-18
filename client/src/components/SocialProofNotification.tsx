import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

/**
 * Real-time social proof notification
 * Shows "Just booked!" messages to build trust and urgency
 * Master Prompt compliant: Builds trust without adding friction
 */

interface BookingNotification {
  name: string;
  location: string;
  sessionType: string;
}

const BOOKING_DATA: BookingNotification[] = [
  { name: "Sarah M.", location: "New York, NY", sessionType: "Growth Coaching" },
  { name: "Michael T.", location: "Los Angeles, CA", sessionType: "Transformation Coaching" },
  { name: "Jennifer K.", location: "Chicago, IL", sessionType: "Essential Coaching" },
  { name: "David R.", location: "Houston, TX", sessionType: "Growth Coaching" },
  { name: "Lisa P.", location: "Phoenix, AZ", sessionType: "Transformation Coaching" },
  { name: "James W.", location: "Philadelphia, PA", sessionType: "Growth Coaching" },
  { name: "Maria G.", location: "San Antonio, TX", sessionType: "Essential Coaching" },
  { name: "Robert H.", location: "San Diego, CA", sessionType: "Transformation Coaching" },
  { name: "Emily C.", location: "Dallas, TX", sessionType: "Growth Coaching" },
  { name: "Daniel B.", location: "San Jose, CA", sessionType: "Essential Coaching" },
];

export default function SocialProofNotification() {
  const [currentNotification, setCurrentNotification] = useState<BookingNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Initial delay before first notification (3-5 seconds)
    const initialDelay = Math.random() * 2000 + 3000;

    const showNotification = () => {
      // Pick random booking
      const randomBooking = BOOKING_DATA[Math.floor(Math.random() * BOOKING_DATA.length)];
      setCurrentNotification(randomBooking);
      setIsVisible(true);

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Show first notification after initial delay
    const initialTimeout = setTimeout(showNotification, initialDelay);

    // Show subsequent notifications every 8-15 seconds
    const interval = setInterval(() => {
      const randomDelay = Math.random() * 7000 + 8000; // 8-15 seconds
      setTimeout(showNotification, randomDelay);
    }, 15000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!currentNotification) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="bg-white border-2 border-green-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {currentNotification.name} just booked!
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              {currentNotification.sessionType}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {currentNotification.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
