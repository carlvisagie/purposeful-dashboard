import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar, Clock, CheckCircle2, Shield, Award, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

/**
 * HIGH-CONVERSION BOOKING FLOW
 * Following Master Prompt principles:
 * - Zero cognitive load (3-step linear flow)
 * - Outcome-focused pricing presentation
 * - Trust-heavy positioning
 * - Clear buyer intent CTAs
 * - Data-backed UX patterns
 */

export default function BookSessionNew() {
  const [coachId] = useState(1); // TODO: Get from context
  const [clientId] = useState(1); // TODO: Get from auth context
  
  // Flow state (linear 3-step process)
  const [step, setStep] = useState<"select" | "schedule" | "confirm">("select");
  
  // Selection state
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  
  // UI state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch active session types
  const { data: typesData } = trpc.sessionTypes.list.useQuery({
    coachId,
    activeOnly: true,
  });

  // Get selected type details
  const selectedType = typesData?.sessionTypes.find(t => t.id === selectedTypeId);

  // Fetch weekly availability for scarcity display
  const { data: weeklyData } = trpc.scheduling.getWeeklyAvailability.useQuery(
    {
      coachId,
      sessionDuration: selectedType?.duration || 60,
    },
    {
      enabled: selectedType !== null,
      refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
    }
  );

  // Fetch available slots when date and type are selected
  const { data: slotsData, isLoading: loadingSlots } = trpc.scheduling.getAvailableSlots.useQuery(
    {
      coachId,
      date: selectedDate!,
      duration: selectedType?.duration || 60,
    },
    {
      enabled: selectedDate !== null && selectedType !== null,
    }
  );

  // Create Stripe checkout session
  const createCheckout = trpc.sessionPayments.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      // Redirect to Stripe checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      toast.error(`Payment setup failed: ${error.message}`);
    },
  });

  const handleSelectType = (typeId: number) => {
    setSelectedTypeId(typeId);
    setStep("schedule");
  };

  const handleSelectSlot = (slot: string) => {
    setSelectedSlot(slot);
    setStep("confirm");
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !selectedType) {
      toast.error("Please complete all steps");
      return;
    }

    // Create Stripe checkout session
    createCheckout.mutate({
      sessionTypeId: selectedType.id,
      sessionTypeName: selectedType.name,
      price: selectedType.price,
      duration: selectedType.duration,
      scheduledDate: selectedSlot,
      notes,
      coachId,
      clientId,
    });
  };

  // Calendar helpers
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const isPast = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Trust Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-6xl py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Book Your Transformation Session</h1>
              <p className="text-sm text-muted-foreground">Secure • Confidential • Results-Driven</p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-600" />
                <span>Certified Coach</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl py-12">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step === "select" ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === "select" ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}>
                1
              </div>
              <span className="font-medium">Choose Session</span>
            </div>
            <div className="w-12 h-0.5 bg-border" />
            <div className={`flex items-center gap-2 ${step === "schedule" ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === "schedule" ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}>
                2
              </div>
              <span className="font-medium">Select Time</span>
            </div>
            <div className="w-12 h-0.5 bg-border" />
            <div className={`flex items-center gap-2 ${step === "confirm" ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === "confirm" ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}>
                3
              </div>
              <span className="font-medium">Confirm</span>
            </div>
          </div>
        </div>

        {/* STEP 1: SELECT SESSION TYPE */}
        {step === "select" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Choose Your Transformation Path</h2>
              <p className="text-muted-foreground">
                Select the session that aligns with your goals
              </p>
            </div>

            {/* Scarcity Display */}
            {weeklyData && weeklyData.remainingSpots > 0 && weeklyData.remainingSpots <= 10 && (
              <div className={`
                mx-auto max-w-md mb-8 px-6 py-4 rounded-lg border-2 text-center font-semibold
                ${weeklyData.remainingSpots <= 2 ? 'bg-red-50 border-red-300 text-red-800' : 
                  weeklyData.remainingSpots <= 4 ? 'bg-orange-50 border-orange-300 text-orange-800' : 
                  'bg-yellow-50 border-yellow-300 text-yellow-800'}
              `}>
                <div className="flex items-center justify-center gap-2">
                  {weeklyData.remainingSpots <= 2 && (
                    <span className="animate-pulse text-xl">🔥</span>
                  )}
                  <span>
                    Only <span className="text-2xl font-bold">{weeklyData.remainingSpots}</span> spot{weeklyData.remainingSpots !== 1 ? 's' : ''} remaining this week
                  </span>
                  {weeklyData.remainingSpots <= 2 && (
                    <span className="animate-pulse text-xl">🔥</span>
                  )}
                </div>
                <p className="text-sm mt-1 opacity-80">
                  {weeklyData.remainingSpots === 1 ? "Last spot available!" : "Book now before they're gone"}
                </p>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {typesData?.sessionTypes.map((type, index) => {
                const isRecommended = index === 1; // Middle option as anchor

                return (
                  <Card
                    key={type.id}
                    className={`relative cursor-pointer transition-all hover:shadow-lg ${
                      isRecommended ? "border-primary shadow-md scale-105" : ""
                    }`}
                    onClick={() => handleSelectType(type.id)}
                  >
                    {isRecommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary">Most Popular</Badge>
                      </div>
                    )}
                    
                    <CardHeader>
                      <CardTitle className="text-2xl">{type.name}</CardTitle>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-4xl font-bold">${(type.price / 100).toFixed(0)}</span>
                        <span className="text-muted-foreground">/ session</span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{type.duration} minutes</span>
                      </div>

                      {type.description && (
                        <p className="text-sm leading-relaxed">{type.description}</p>
                      )}

                      <Button className="w-full" variant={isRecommended ? "default" : "outline"}>
                        Select This Session
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-3 gap-8 text-center">
              <div>
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="font-semibold">95% Success Rate</p>
                <p className="text-sm text-muted-foreground">Clients achieve their goals</p>
              </div>
              <div>
                <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="font-semibold">100% Confidential</p>
                <p className="text-sm text-muted-foreground">Your privacy guaranteed</p>
              </div>
              <div>
                <Award className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="font-semibold">Certified Professional</p>
                <p className="text-sm text-muted-foreground">Expert guidance</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT DATE & TIME */}
        {step === "schedule" && selectedType && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Button variant="ghost" onClick={() => setStep("select")} className="mb-4">
                ← Change Session Type
              </Button>
              <h2 className="text-3xl font-bold mb-2">Select Your Preferred Time</h2>
              <p className="text-muted-foreground">
                {selectedType.name} • {selectedType.duration} min • ${(selectedType.price / 100).toFixed(2)}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Choose a Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                      ←
                    </Button>
                    <h3 className="font-semibold">
                      {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </h3>
                    <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                      →
                    </Button>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {["S", "M", "T", "W", "T", "F", "S"].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                        {day}
                      </div>
                    ))}
                    {generateCalendarDays().map((date, index) => (
                      <button
                        key={index}
                        onClick={() => date && !isPast(date) && setSelectedDate(date)}
                        disabled={!date || isPast(date)}
                        className={`
                          aspect-square p-2 text-sm rounded-md transition-colors
                          ${!date ? "invisible" : ""}
                          ${isPast(date) ? "text-muted-foreground cursor-not-allowed" : "hover:bg-accent"}
                          ${isSelected(date) ? "bg-primary text-primary-foreground" : "border border-border"}
                        `}
                      >
                        {date?.getDate()}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Time Slots */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Available Times
                  </CardTitle>
                  {selectedDate && (
                    <CardDescription>
                      {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {!selectedDate ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Select a date to see available times
                    </p>
                  ) : loadingSlots ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Loading available slots...
                    </p>
                  ) : slotsData?.slots.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No available slots on this date
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                      {slotsData?.slots.map(slot => {
                        const slotDate = new Date(slot);
                        const timeString = slotDate.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        });

                        return (
                          <Button
                            key={slot}
                            variant="outline"
                            onClick={() => handleSelectSlot(slot)}
                            className="justify-start"
                          >
                            {timeString}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRM & PAY */}
        {step === "confirm" && selectedType && selectedSlot && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <Button variant="ghost" onClick={() => setStep("schedule")} className="mb-4">
                ← Change Time
              </Button>
              <h2 className="text-3xl font-bold mb-2">Confirm Your Session</h2>
              <p className="text-muted-foreground">Review details and complete booking</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Session Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-muted-foreground">Session Type</span>
                    <span className="font-medium">{selectedType.name}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-medium">
                      {new Date(selectedSlot).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      at{" "}
                      {new Date(selectedSlot).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{selectedType.duration} minutes</span>
                  </div>
                  <div className="flex justify-between py-3 text-lg font-bold">
                    <span>Total</span>
                    <span>${(selectedType.price / 100).toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Additional Notes (Optional)</label>
                  <Textarea
                    placeholder="Any specific topics or concerns you'd like to address?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleConfirmBooking}
                  disabled={createCheckout.isPending}
                  className="w-full"
                  size="lg"
                >
                  {createCheckout.isPending ? "Processing..." : `Proceed to Payment • $${(selectedType.price / 100).toFixed(2)}`}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Secure payment powered by Stripe • 100% money-back guarantee
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <DialogTitle className="text-center text-2xl">Session Booked!</DialogTitle>
            <DialogDescription className="text-center">
              Your transformation session is confirmed. Check your email for details and calendar invite.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => setShowSuccess(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
