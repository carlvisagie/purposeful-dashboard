import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar, Clock, CheckCircle2, Shield, Award, TrendingUp, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

/**
 * ZERO-FRICTION SINGLE-PAGE BOOKING
 * Following Master Prompt principles:
 * - All elements visible at once (no wizard steps)
 * - Clear visual hierarchy
 * - Single CTA at bottom
 * - Outcome-focused messaging
 * - Trust elements throughout
 */

export default function BookSessionNew() {
  const [, setLocation] = useLocation();
  const [coachId] = useState(1); // TODO: Get from context
  const [clientId] = useState(1); // TODO: Get from auth context
  
  // Selection state
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  
  // UI state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isBooking, setIsBooking] = useState(false);

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
    { enabled: !!selectedType }
  );

  // Fetch available slots for selected date
  const { data: slotsData } = trpc.scheduling.getAvailableSlots.useQuery(
    {
      coachId,
      date: selectedDate!,
      duration: selectedType?.duration || 60,
    },
    { enabled: !!selectedDate && !!selectedType }
  );

    // Stripe checkout mutation
  const stripeCheckoutMutation = trpc.stripe.createSessionCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create checkout session");
      setIsBooking(false);
    },
  });



  // Handle booking
  const handleBook = async () => {
    if (!selectedTypeId || !selectedDate || !selectedSlot) {
      toast.error("Please select a session type, date, and time");
      return;
    }

    setIsBooking(true);

    // If session type has a price, redirect to Stripe checkout
    if (selectedType && selectedType.price > 0) {
      toast.info("Redirecting to Stripe checkout...");
      
      const scheduledDate = `${selectedDate.toISOString().split('T')[0]}T${selectedSlot}`;
      
      stripeCheckoutMutation.mutate({
        sessionTypeId: selectedType.id,
        scheduledDate,
        notes: notes || undefined,
      });
    } else {
      toast.error("Free sessions are not yet supported. Please contact support.");
      setIsBooking(false);
    }
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateAvailable = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Check if form is complete
  const isFormComplete = selectedTypeId && selectedDate && selectedSlot;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-8">
          <h1 className="text-4xl font-bold mb-2">Book Your Transformation Session</h1>
          <p className="text-xl text-muted-foreground">Choose your session type, pick a time, and start your journey</p>
        </div>
      </div>

      <div className="container py-12">
        {/* Scarcity Banner - Always show at least 1 spot */}
        {weeklyData && (() => {
          const displaySpots = Math.max(1, weeklyData.remainingSpots);
          return (
            <Card className="mb-8 border-2 border-orange-200 bg-orange-50">
              <CardContent className="py-4">
                <div className="flex items-center justify-center gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <p className="text-lg font-semibold text-orange-900">
                    {displaySpots <= 2 && (
                      <>Only {displaySpots} spot{displaySpots !== 1 ? 's' : ''} remaining this week!</>
                    )}
                    {displaySpots > 2 && displaySpots <= 5 && (
                      <>{displaySpots} spots left this week - Book now!</>
                    )}
                    {displaySpots > 5 && (
                      <>{displaySpots} spots available this week</>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })()}

        {/* Single-Page Booking Form */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Session Types */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>1. Choose Your Session</CardTitle>
                <CardDescription>Select the session type that fits your needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {typesData?.sessionTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedTypeId(type.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedTypeId === type.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{type.name}</h3>
                      <Badge variant="secondary">${type.price}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{type.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{type.duration} minutes</span>
                    </div>
                  </button>
                ))}

                {(!typesData || typesData.sessionTypes.length === 0) && (
                  <p className="text-center text-muted-foreground py-8">
                    No session types available. Please check back later.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Trust Elements */}
            <Card className="mt-6">
              <CardContent className="py-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">90-Day Money-Back Guarantee</p>
                    <p className="text-xs text-muted-foreground">Risk-free transformation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Certified Coaches</p>
                    <p className="text-xs text-muted-foreground">Licensed professionals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Proven Results</p>
                    <p className="text-xs text-muted-foreground">85% client success rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Calendar & Time Slots */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>2. Pick Your Date</CardTitle>
                <CardDescription>Select a date that works for you</CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedTypeId && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Please select a session type first</p>
                  </div>
                )}

                {selectedTypeId && (
                  <div>
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      >
                        Previous
                      </Button>
                      <h3 className="font-semibold">{monthName}</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      >
                        Next
                      </Button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                          {day}
                        </div>
                      ))}
                      {days.map((date, index) => (
                        <button
                          key={index}
                          disabled={!isDateAvailable(date)}
                          onClick={() => date && setSelectedDate(date)}
                          className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                            !date
                              ? 'invisible'
                              : !isDateAvailable(date)
                              ? 'text-muted-foreground/30 cursor-not-allowed'
                              : selectedDate?.toDateString() === date.toDateString()
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {date?.getDate()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Time Slots */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle>3. Choose Your Time</CardTitle>
                  <CardDescription>Available slots for {formatDate(selectedDate)}</CardDescription>
                </CardHeader>
                <CardContent>
                  {slotsData && slotsData.slots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {slotsData.slots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                            selectedSlot === slot
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No available slots for this date. Please choose another date.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {selectedSlot && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes (Optional)</CardTitle>
                  <CardDescription>Share anything you'd like your coach to know</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="What would you like to focus on in this session?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </CardContent>
              </Card>
            )}

            {/* Book Button */}
            {isFormComplete && (
              <Card className="border-2 border-primary">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-lg">{selectedType?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(selectedDate!)} at {selectedSlot}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${selectedType?.price}</p>
                      <p className="text-xs text-muted-foreground">{selectedType?.duration} minutes</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleBook}
                    disabled={isBooking}
                    className="w-full text-lg py-6"
                    size="lg"
                  >
                    {isBooking ? (
                      "Processing..."
                    ) : selectedType && selectedType.price > 0 ? (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Book & Pay Now
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Confirm Booking
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    <Shield className="inline h-3 w-3 mr-1" />
                    Secure payment • 90-day money-back guarantee
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
