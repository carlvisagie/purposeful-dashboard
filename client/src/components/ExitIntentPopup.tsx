import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Clock, Gift, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

interface ExitIntentPopupProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Exit-Intent Popup - Master Prompt Compliant
 * High-conversion popup offering special discount to abandoning visitors
 * Follows urgency + scarcity + single CTA principles
 */
export function ExitIntentPopup({ open, onClose }: ExitIntentPopupProps) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    if (!open) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, onClose]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleClaim = () => {
    // Redirect to booking page with discount parameter
    window.location.href = '/book-session?discount=WAIT20';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-4 border-rose-500">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        <div className="bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50 p-8">
          {/* Urgency Timer */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Clock className="h-5 w-5 text-rose-600 animate-pulse" />
            <span className="text-lg font-bold text-rose-600">
              Offer expires in {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>

          {/* Headline - Outcome-Focused */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-full text-sm font-bold mb-4">
              <Gift className="h-5 w-5" />
              <span>WAIT! Special One-Time Offer</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get 20% Off Your First Session
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Don't let anxiety steal another day. Book now and save <span className="font-bold text-rose-600">$40-$60</span> on your first breakthrough session.
            </p>
          </div>

          {/* Value Props - Pain-Agitation-Solution */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Start Today</p>
                  <p className="text-sm text-gray-600">No waiting lists or delays</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">90-Day Guarantee</p>
                  <p className="text-sm text-gray-600">Risk-free money-back promise</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">AI + Human Support</p>
                  <p className="text-sm text-gray-600">24/7 coaching + weekly check-ins</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Proven Results</p>
                  <p className="text-sm text-gray-600">60% anxiety reduction in 30 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Single Clear CTA */}
          <div className="text-center">
            <Button
              size="lg"
              className="bg-rose-500 hover:bg-rose-600 text-white text-xl px-12 py-6 mb-3 w-full md:w-auto"
              onClick={handleClaim}
            >
              <Gift className="mr-2 h-6 w-6" />
              Claim My 20% Discount Now
            </Button>
            <p className="text-sm text-gray-600">
              Limited to first-time visitors only • Expires in {minutes}:{seconds.toString().padStart(2, '0')}
            </p>
          </div>

          {/* Social Proof */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              <span className="font-bold text-gray-900">2,847 people</span> claimed this offer in the last 30 days
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
