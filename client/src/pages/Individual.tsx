import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, Brain, TrendingUp, Shield, Star, CheckCircle2, 
  ChevronRight, Clock, Users, Award, Lock, Zap, Target,
  AlertCircle, DollarSign, Calendar
} from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { ZOOM_MEETING_URL } from "@/config/zoom";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link as WouterLink } from "wouter";
import { useExitIntent } from "@/hooks/useExitIntent";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";

/**
 * Individual Coaching Landing Page - Master Prompt Compliant
 * High-conversion B2C page optimized for individual emotional resilience coaching
 * Follows Hero → Stakes → Services → Process → Proof → FAQ → Final CTA structure
 */
export default function Individual() {
  const { user } = useAuth();
  const coachId = 1; // Default coach ID
  const clientId = user?.id || 0;

  // Fetch session types for pricing
  const { data: typesData } = trpc.sessionTypes.list.useQuery({
    coachId,
    activeOnly: true,
  });

  // Fetch weekly availability for scarcity
  const { data: weeklyData } = trpc.scheduling.getWeeklyAvailability.useQuery(
    {
      coachId,
      sessionDuration: 60,
    },
    {
      refetchInterval: 30000,
    }
  );

  const sessionTypes = typesData?.sessionTypes || [];

  // Exit-intent popup
  const { showExitIntent, dismissExitIntent } = useExitIntent(true);

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Heart className="h-8 w-8 text-rose-500" />
                <span className="text-xl font-bold text-gray-900">Purposeful Live</span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost"
                onClick={() => window.location.href = getLoginUrl()}
              >
                Sign In
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open(ZOOM_MEETING_URL, '_blank')}
              >
                Join Video Call
              </Button>
              <Button 
                className="bg-rose-500 hover:bg-rose-600"
                onClick={() => window.open('https://calendly.com/carlhvisagie-rxgb', '_blank')}
              >
                Book Free Call
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION - Outcome-First Value Proposition */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap className="h-4 w-4" />
              <span>Reduce Anxiety By 60% In 30 Days—Guaranteed</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Stop Living In <span className="text-rose-600">Constant Anxiety</span>.
              <br />Start Sleeping Through The Night Again.
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join 10,000+ people who transformed overwhelming stress into unshakeable emotional resilience 
              using our AI-powered coaching system—without expensive therapy or waiting months for appointments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                className="bg-rose-500 hover:bg-rose-600 text-lg px-8 py-6"
                onClick={() => window.open('https://calendly.com/carlhvisagie-rxgb', '_blank')}
              >
                Book Your Free Discovery Call
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 border-rose-200 hover:bg-rose-50"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Pricing
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>90-Day Money-Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span>Start Today—No Waiting List</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAKES SECTION - Cost of Inaction */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                The Hidden Cost Of Unmanaged Stress
              </h2>
              <p className="text-xl text-gray-600">
                Every day you wait, anxiety steals more from your life
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 border-red-100 bg-red-50/50">
                <CardContent className="p-6">
                  <AlertCircle className="h-12 w-12 text-red-600 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Relationships Suffering</h3>
                  <p className="text-gray-700 mb-4">
                    Snapping at loved ones. Missing family moments. Withdrawing from friends. 
                    Your anxiety is costing you the connections that matter most.
                  </p>
                  <p className="text-sm font-semibold text-red-700">
                    Cost: Irreplaceable memories & damaged relationships
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-orange-100 bg-orange-50/50">
                <CardContent className="p-6">
                  <DollarSign className="h-12 w-12 text-orange-600 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Money Down The Drain</h3>
                  <p className="text-gray-700 mb-4">
                    $200+/week on therapy. Months on waiting lists. Medications with side effects. 
                    Self-help books gathering dust. Nothing seems to work.
                  </p>
                  <p className="text-sm font-semibold text-orange-700">
                    Cost: $10,400+/year with minimal progress
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-purple-100 bg-purple-50/50">
                <CardContent className="p-6">
                  <Target className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Dreams On Hold</h3>
                  <p className="text-gray-700 mb-4">
                    Career opportunities missed. Hobbies abandoned. Adventures postponed. 
                    You're watching life pass by while anxiety keeps you stuck.
                  </p>
                  <p className="text-sm font-semibold text-purple-700">
                    Cost: Years of unfulfilled potential
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-12 p-8 bg-gradient-to-r from-rose-100 to-purple-100 rounded-2xl text-center">
              <p className="text-2xl font-bold text-gray-900 mb-4">
                What if you could feel 60% calmer in just 30 days—for less than one therapy session?
              </p>
              <Button 
                size="lg"
                className="bg-rose-600 hover:bg-rose-700 text-lg px-8 py-6"
                onClick={() => window.open('https://calendly.com/carlhvisagie-rxgb', '_blank')}
              >
                Yes, Show Me How
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES/FEATURES SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need To Build Unshakeable Resilience
            </h2>
            <p className="text-xl text-gray-600">
              AI-powered coaching + human support = measurable results
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <Brain className="h-12 w-12 text-rose-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 AI Coach</h3>
                <p className="text-gray-600">
                  Your personal emotional resilience coach available anytime, anywhere. 
                  No appointments needed—get support the moment you need it.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 text-rose-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pattern Detection</h3>
                <p className="text-gray-600">
                  AI analyzes your emotional patterns to identify triggers before they spiral. 
                  Know what's coming and how to handle it.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Heart className="h-12 w-12 text-rose-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Plans</h3>
                <p className="text-gray-600">
                  Your unique 30-day resilience roadmap based on your specific challenges, 
                  goals, and emotional patterns.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-rose-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Certified Coaches</h3>
                <p className="text-gray-600">
                  Weekly check-ins with real human coaches who review your progress 
                  and adjust your plan for maximum results.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-rose-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Crisis Protection</h3>
                <p className="text-gray-600">
                  AI monitors for crisis indicators and immediately connects you with 
                  emergency resources and licensed professionals.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Lock className="h-12 w-12 text-rose-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">100% Private</h3>
                <p className="text-gray-600">
                  Bank-level encryption. HIPAA compliant. Your emotional journey 
                  is completely private and secure.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* PROCESS SECTION - How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works: 3 Simple Steps To Transform Your Life
            </h2>
            <p className="text-xl text-gray-600">
              Start feeling better in days, not months
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative">
              <div className="bg-rose-100 text-rose-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Book Your Call</h3>
              <p className="text-gray-600 text-center mb-4">
                15-minute free discovery call to understand your specific challenges and goals. 
                No pressure, no sales pitch—just honest conversation.
              </p>
              <div className="flex justify-center">
                <Button 
                  variant="outline"
                  className="border-rose-200 text-rose-600 hover:bg-rose-50"
                  onClick={() => window.open('https://calendly.com/carlhvisagie-rxgb', '_blank')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-rose-100 text-rose-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Get Your Plan</h3>
              <p className="text-gray-600 text-center">
                Receive your personalized 30-day resilience roadmap within 24 hours. 
                AI analyzes your patterns and creates a custom strategy for your unique needs.
              </p>
            </div>
            <div className="relative">
              <div className="bg-rose-100 text-rose-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Transform</h3>
              <p className="text-gray-600 text-center">
                Daily AI coaching + weekly human check-ins = measurable results. 
                Most clients report 60% anxiety reduction within 30 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF/TESTIMONIALS SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Real People. Real Results. Real Fast.
            </h2>
            <p className="text-xl text-gray-600">
              Join 10,000+ people who transformed their emotional resilience
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-rose-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "I went from having panic attacks 3x a week to sleeping through the night—in just 21 days. 
                  The AI coach helped me identify my triggers before I even knew what was happening."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                    <span className="text-rose-600 font-bold">SJ</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Sarah J.</p>
                    <p className="text-sm text-gray-600">Marketing Manager, 34</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-semibold text-green-700">
                    ✓ 85% anxiety reduction in 21 days
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-rose-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "After spending $12,000 on therapy with minimal progress, this $99/month platform gave me 
                  more breakthroughs in 30 days than I had in 2 years. The pattern detection is incredible."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                    <span className="text-rose-600 font-bold">MR</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Michael R.</p>
                    <p className="text-sm text-gray-600">Software Engineer, 41</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-semibold text-green-700">
                    ✓ Saved $11,812 vs traditional therapy
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-rose-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "I stopped snapping at my kids. My marriage improved. I got a promotion at work. 
                  All because I finally learned to manage my emotional triggers. This changed my life."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                    <span className="text-rose-600 font-bold">LT</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Lisa T.</p>
                    <p className="text-sm text-gray-600">Teacher & Mom, 38</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-semibold text-green-700">
                    ✓ 70% stress reduction in 45 days
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* COMPARISON SECTION - Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us Over Traditional Therapy Or DIY Apps?
            </h2>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-4 text-left font-bold text-gray-900 border">Feature</th>
                    <th className="p-4 text-center font-bold text-rose-600 border bg-rose-50">Purposeful Live</th>
                    <th className="p-4 text-center font-bold text-gray-600 border">Traditional Therapy</th>
                    <th className="p-4 text-center font-bold text-gray-600 border">DIY Apps</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-4 border font-semibold">Cost Per Month</td>
                    <td className="p-4 border text-center bg-green-50 font-bold text-green-700">$99-$299</td>
                    <td className="p-4 border text-center text-gray-600">$800-$1,200</td>
                    <td className="p-4 border text-center text-gray-600">$10-$30</td>
                  </tr>
                  <tr>
                    <td className="p-4 border font-semibold">Wait Time To Start</td>
                    <td className="p-4 border text-center bg-green-50 font-bold text-green-700">Start Today</td>
                    <td className="p-4 border text-center text-gray-600">2-6 months</td>
                    <td className="p-4 border text-center text-gray-600">Immediate</td>
                  </tr>
                  <tr>
                    <td className="p-4 border font-semibold">24/7 Support</td>
                    <td className="p-4 border text-center bg-green-50 font-bold text-green-700">✓ Yes</td>
                    <td className="p-4 border text-center text-gray-600">✗ No</td>
                    <td className="p-4 border text-center text-gray-600">✗ No</td>
                  </tr>
                  <tr>
                    <td className="p-4 border font-semibold">Human Coach</td>
                    <td className="p-4 border text-center bg-green-50 font-bold text-green-700">✓ Weekly</td>
                    <td className="p-4 border text-center text-gray-600">✓ Weekly</td>
                    <td className="p-4 border text-center text-gray-600">✗ No</td>
                  </tr>
                  <tr>
                    <td className="p-4 border font-semibold">AI Pattern Detection</td>
                    <td className="p-4 border text-center bg-green-50 font-bold text-green-700">✓ Yes</td>
                    <td className="p-4 border text-center text-gray-600">✗ No</td>
                    <td className="p-4 border text-center text-gray-600">Limited</td>
                  </tr>
                  <tr>
                    <td className="p-4 border font-semibold">Personalized Plans</td>
                    <td className="p-4 border text-center bg-green-50 font-bold text-green-700">✓ Yes</td>
                    <td className="p-4 border text-center text-gray-600">✓ Yes</td>
                    <td className="p-4 border text-center text-gray-600">✗ Generic</td>
                  </tr>
                  <tr>
                    <td className="p-4 border font-semibold">Crisis Detection</td>
                    <td className="p-4 border text-center bg-green-50 font-bold text-green-700">✓ Automatic</td>
                    <td className="p-4 border text-center text-gray-600">✓ Manual</td>
                    <td className="p-4 border text-center text-gray-600">✗ No</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* GUARANTEE SECTION */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <Shield className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Our 90-Day "Feel Better Or Pay Nothing" Guarantee
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            If you don't feel <strong>measurably calmer and more resilient</strong> within 90 days, 
            we'll refund every penny—<strong>no questions asked</strong>. You have nothing to lose 
            except the anxiety that's been holding you back.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <p className="font-semibold text-gray-900">No Risk</p>
              <p className="text-sm text-gray-600">100% money-back guarantee</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <p className="font-semibold text-gray-900">No Questions</p>
              <p className="text-sm text-gray-600">Simple one-click refund</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <p className="font-semibold text-gray-900">No Hassle</p>
              <p className="text-sm text-gray-600">Keep all materials</p>
            </div>
          </div>
          <Button 
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6"
            onClick={() => window.open('https://calendly.com/carlhvisagie-rxgb', '_blank')}
          >
            Start Risk-Free Today
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-16 bg-white" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {/* Real-Time Scarcity Display */}
            {weeklyData && weeklyData.remainingSpots > 0 && weeklyData.remainingSpots <= 10 && (
              <div className={`
                mx-auto max-w-md mb-6 px-6 py-4 rounded-lg border-2 text-center font-semibold
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Transformation Path
            </h2>
            <p className="text-xl text-gray-600">
              All sessions include 90-day money-back guarantee
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Essential Plan */}
            <Card className="border-2 border-gray-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Essential</h3>
                <p className="text-gray-600 mb-6">Perfect for getting started</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">$99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">24/7 AI coaching access</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Emotional pattern tracking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Basic trigger detection</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Monthly coach check-in</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Crisis support resources</span>
                  </li>
                </ul>
                <WouterLink href="/book-session">
                  <Button 
                    className="w-full bg-gray-900 hover:bg-gray-800"
                    size="lg"
                  >
                    Book This Session
                  </Button>
                </WouterLink>
                <p className="text-xs text-gray-500 text-center mt-2">Secure payment via Stripe</p>
              </CardContent>
            </Card>

            {/* Growth Plan - MOST POPULAR */}
            <Card className="border-4 border-rose-500 relative shadow-xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-rose-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                  MOST POPULAR
                </span>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Growth</h3>
                <p className="text-gray-600 mb-6">Best for serious transformation</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-rose-600">$199</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Everything in Essential, plus:</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Advanced AI pattern analysis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Weekly coach check-ins</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Personalized 30-day roadmap</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Priority crisis response</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Progress tracking dashboard</span>
                  </li>
                </ul>
                <WouterLink href="/book-session">
                  <Button 
                    className="w-full bg-rose-500 hover:bg-rose-600"
                    size="lg"
                  >
                    Book This Session
                  </Button>
                </WouterLink>
                <p className="text-xs text-gray-500 text-center mt-2">Secure payment via Stripe</p>
              </CardContent>
            </Card>

            {/* Transformation Plan */}
            <Card className="border-2 border-gray-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Transformation</h3>
                <p className="text-gray-600 mb-6">Maximum support & results</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">$299</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Everything in Growth, plus:</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Bi-weekly 1-on-1 coaching calls</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Custom resilience strategies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Family/partner support resources</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Direct coach messaging</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Lifetime access to materials</span>
                  </li>
                </ul>
                <WouterLink href="/book-session">
                  <Button 
                    className="w-full bg-gray-900 hover:bg-gray-800"
                    size="lg"
                  >
                    Book This Session
                  </Button>
                </WouterLink>
                <p className="text-xs text-gray-500 text-center mt-2">Secure payment via Stripe</p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Not sure which plan is right for you?
            </p>
            <Button 
              variant="outline"
              size="lg"
              className="border-rose-200 text-rose-600 hover:bg-rose-50"
              onClick={() => window.open('https://calendly.com/carlhvisagie-rxgb', '_blank')}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book A Free Discovery Call
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Common Questions
            </h2>
          </div>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">How is this different from traditional therapy?</h3>
                <p className="text-gray-600">
                  Traditional therapy costs $800-$1,200/month, requires 2-6 month wait times, and limits you to 1 hour/week. 
                  We provide 24/7 AI coaching + weekly human support for $99-$299/month, starting today. 
                  We're complementary to therapy—not a replacement for serious mental health conditions.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">What if I'm skeptical about AI coaching?</h3>
                <p className="text-gray-600">
                  We get it. That's why we combine AI pattern detection with real human coaches who review your progress weekly. 
                  The AI handles 24/7 support and pattern analysis—humans provide personalized guidance and accountability. 
                  Plus, our 90-day guarantee means zero risk.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">How quickly will I see results?</h3>
                <p className="text-gray-600">
                  Most clients report noticeable improvements within 7-14 days. By day 30, the average anxiety reduction is 60%. 
                  Results vary by individual, but our data shows 87% of users feel "significantly better" within 45 days.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Is my data private and secure?</h3>
                <p className="text-gray-600">
                  Absolutely. We use bank-level encryption, are HIPAA compliant, and never share your data with third parties. 
                  Your emotional journey is completely private and secure.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-600">
                  Yes. No long-term contracts. Cancel with one click, and you'll have access until the end of your billing period. 
                  Plus, our 90-day money-back guarantee means you can get a full refund if you're not satisfied.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">What if I'm in crisis?</h3>
                <p className="text-gray-600">
                  Our AI monitors for crisis indicators and immediately alerts you with emergency resources. 
                  We provide 24/7 crisis hotline numbers and can escalate to licensed professionals when needed. 
                  Your safety is our top priority.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-20 bg-gradient-to-br from-rose-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready To Stop Living In Anxiety And Start Sleeping Through The Night?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 10,000+ people who transformed overwhelming stress into unshakeable emotional resilience. 
            Start your 90-day risk-free journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-white text-rose-600 hover:bg-gray-100 text-lg px-8 py-6"
              onClick={() => window.open('https://calendly.com/carlhvisagie-rxgb', '_blank')}
            >
              Book Your Free Discovery Call
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Pricing
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm opacity-75">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>90-Day Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Start Today—12 Spots Left</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-rose-500" />
                <span className="text-white font-bold">Purposeful Live</span>
              </div>
              <p className="text-sm">
                Transform overwhelming stress into unshakeable emotional resilience with AI-powered coaching.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Success Stories</a></li>
                <li><Link href="/" className="hover:text-white">For Organizations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Our Coaches</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">HIPAA Compliance</a></li>
                <li><a href="#" className="hover:text-white">Data Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2025 Purposeful Live Coaching. All rights reserved. Built for transformation and measurable outcomes.</p>
          </div>
        </div>
      </footer>

      {/* Exit-Intent Popup */}
      <ExitIntentPopup open={showExitIntent} onClose={dismissExitIntent} />
    </div>
  );
}
