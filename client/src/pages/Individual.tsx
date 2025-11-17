import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { 
  Heart, 
  Sparkles, 
  Brain, 
  Shield, 
  CheckCircle2, 
  Star,
  Lock,
  TrendingUp,
  Clock,
  Users,
  ChevronRight,
  Zap
} from "lucide-react";

export default function Individual() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-rose-500" />
              <span className="text-xl font-bold text-gray-900">Purposeful Live Coaching</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost">
                  For Organizations
                </Button>
              </Link>
              <Button 
                variant="ghost"
                onClick={() => window.location.href = getLoginUrl()}
              >
                Sign In
              </Button>
              <Button 
                className="bg-rose-500 hover:bg-rose-600"
                onClick={() => window.open('https://calendly.com/carlhvisagie-rxgb', '_blank')}
              >
                Start Your Journey
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-rose-50 via-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-rose-100 text-rose-800 border-rose-200">
                <Sparkles className="h-3 w-3 mr-1 inline" />
                Personal Transformation Coaching
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Build Unshakeable Emotional Resilience
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform stress into strength with AI-powered emotional coaching. Track your patterns, 
                understand your triggers, and build lasting resilience—all with the support of certified coaches 
                who truly care about your journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-rose-500 hover:bg-rose-600 text-lg px-8 py-6"
                  onClick={() => window.open('https://calendly.com/carlhvisagie-rxgb', '_blank')}
                >
                  Start Your Journey
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
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>100% Private & Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>10,000+ Lives Changed</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="text-sm text-gray-600">Emotional Resilience Score</p>
                      <p className="text-3xl font-bold text-green-600">8.4/10</p>
                    </div>
                    <TrendingUp className="h-12 w-12 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div>
                      <p className="text-sm text-gray-600">Days of Progress</p>
                      <p className="text-3xl font-bold text-purple-600">127</p>
                    </div>
                    <Clock className="h-12 w-12 text-purple-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <p className="text-sm text-gray-600">AI Insights Generated</p>
                      <p className="text-3xl font-bold text-blue-600">342</p>
                    </div>
                    <Brain className="h-12 w-12 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN POINTS SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              You Deserve Better Than Just "Getting By"
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Life's challenges don't have to control your emotional well-being. It's time to break free from the cycle.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-red-200 bg-red-50/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Feeling Overwhelmed</h3>
                <p className="text-gray-600">
                  Stress, anxiety, and emotional exhaustion are draining your energy and joy. You're tired of feeling like you're barely keeping it together.
                </p>
              </CardContent>
            </Card>
            <Card className="border-orange-200 bg-orange-50/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Repeating Patterns</h3>
                <p className="text-gray-600">
                  The same triggers keep setting you off. You react the same way every time, and you don't know how to break the cycle.
                </p>
              </CardContent>
            </Card>
            <Card className="border-yellow-200 bg-yellow-50/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Lacking Support</h3>
                <p className="text-gray-600">
                  You feel alone in your struggles. Traditional therapy is expensive, and you need support that fits your life and budget.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-rose-100 text-rose-800 border-rose-200">
              How It Works
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Personal Emotional Resilience System
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Science-backed tools and human support working together to help you thrive
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="bg-rose-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Insights</h3>
                <p className="text-gray-600">
                  Advanced AI analyzes your emotional patterns, identifies triggers, and provides personalized insights 24/7.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Certified Coach Support</h3>
                <p className="text-gray-600">
                  Real humans who care. Connect with certified emotional resilience coaches for guidance when you need it most.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Track Your Progress</h3>
                <p className="text-gray-600">
                  See your resilience grow with visual dashboards tracking your emotional patterns, triggers, and victories.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Crisis Detection</h3>
                <p className="text-gray-600">
                  AI monitors for warning signs and automatically connects you with support before small issues become crises.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Coping Strategies</h3>
                <p className="text-gray-600">
                  Build your personal toolkit of proven coping strategies that work for YOUR unique triggers and patterns.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">100% Private</h3>
                <p className="text-gray-600">
                  Bank-level encryption and HIPAA compliance ensure your journey is completely private and secure.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-rose-100 text-rose-800 border-rose-200">
              Real Stories, Real Results
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lives Transformed Through Emotional Resilience
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-rose-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "I finally understand my anxiety triggers. The AI insights helped me see patterns I never noticed, 
                  and my coach gave me tools that actually work. I feel like myself again."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                    <span className="text-rose-600 font-bold">JM</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Jessica M.</p>
                    <p className="text-sm text-gray-600">Marketing Manager, 34</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-green-600">Resilience score improved from 4.2 to 8.7</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "After my divorce, I was a mess. This platform helped me track my emotions and connect with a coach 
                  who understood. 6 months later, I'm stronger than I've ever been."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-bold">MT</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Michael T.</p>
                    <p className="text-sm text-gray-600">Teacher, 41</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-green-600">Zero crisis episodes in 6 months</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "I was skeptical about AI coaching, but the combination of technology and human support is incredible. 
                  It's like having a therapist in my pocket, but way more affordable."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">SR</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Sarah R.</p>
                    <p className="text-sm text-gray-600">Entrepreneur, 29</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-green-600">Stress levels reduced by 65%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-rose-100 text-rose-800 border-rose-200">
              Simple, Transparent Pricing
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Invest In Your Emotional Well-Being
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs. All plans include AI insights, crisis detection, and private journaling.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Essential Plan */}
            <Card className="border-gray-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Essential</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">Perfect for getting started with emotional resilience tracking</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Unlimited journal entries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">AI-powered pattern detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Crisis detection & alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Progress tracking dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Email support</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-gray-900 hover:bg-gray-800"
                  size="lg"
                  onClick={() => window.open('https://calendly.com/carlhvisagie-rxgb', '_blank')}
                >
                  Start Essential Plan
                </Button>
              </CardContent>
            </Card>

            {/* Growth Plan - Most Popular */}
            <Card className="border-rose-500 border-2 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-rose-500 text-white">Most Popular</Badge>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Growth</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$179</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">Everything in Essential, plus personalized coach support</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Everything in Essential</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">2 monthly coach sessions (30 min)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Personalized coping strategies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Advanced AI insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Priority support</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-rose-500 hover:bg-rose-600"
                  size="lg"
                  onClick={() => window.open('https://calendly.com/carlhvisagie-rxgb', '_blank')}
                >
                  Start Growth Plan
                </Button>
              </CardContent>
            </Card>

            {/* Transformation Plan */}
            <Card className="border-gray-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Transformation</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$299</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">Maximum support for deep, lasting transformation</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Everything in Growth</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">4 monthly coach sessions (45 min)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Dedicated coach relationship</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Custom resilience plan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">24/7 priority support</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-gray-900 hover:bg-gray-800"
                  size="lg"
                  onClick={() => window.open('https://calendly.com/carlhvisagie-rxgb', '_blank')}
                >
                  Start Transformation Plan
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto border-green-200 bg-green-50/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">30-Day Money-Back Guarantee</h3>
                <p className="text-gray-700">
                  Try any plan risk-free for 30 days. If you don't see improvements in your emotional resilience, 
                  we'll refund your first month—no questions asked.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Common Questions
            </h2>
          </div>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Is this a replacement for therapy?</h3>
                <p className="text-gray-600">
                  No. We're a complementary tool that helps you build emotional resilience between therapy sessions or 
                  as a first step before therapy. Our coaches are certified but not licensed therapists. For serious 
                  mental health concerns, we recommend working with a licensed professional.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">How does the AI work?</h3>
                <p className="text-gray-600">
                  Our AI analyzes your journal entries, emotional patterns, and triggers to identify trends and provide 
                  personalized insights. It's trained on evidence-based emotional resilience frameworks and continuously 
                  learns from your unique patterns.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Is my data private and secure?</h3>
                <p className="text-gray-600">
                  Absolutely. We use bank-level encryption, are HIPAA compliant, and never share your data with third 
                  parties. Your emotional journey is completely private and secure.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-600">
                  Yes. There are no long-term contracts. Cancel anytime with one click, and you'll have access until 
                  the end of your billing period.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">What if I'm in crisis?</h3>
                <p className="text-gray-600">
                  Our AI monitors for crisis indicators and will immediately alert you with resources and connect you 
                  with emergency support. We also provide 24/7 crisis hotline numbers and can escalate to licensed 
                  professionals when needed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-20 bg-gradient-to-br from-rose-500 to-purple-600 text-white" id="start-journey">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready To Build Unshakeable Emotional Resilience?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of people who are transforming stress into strength. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-rose-600 hover:bg-gray-100 text-lg px-8 py-6"
              onClick={() => window.location.href = getLoginUrl()}
            >
              Start Your Free Trial
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
          <div className="mt-8 flex items-center justify-center gap-8 text-sm opacity-75">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>100% Private & Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              <span>30-Day Money-Back</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Cancel Anytime</span>
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
                Transform stress into strength with AI-powered emotional resilience coaching.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">How It Works</a></li>
                <li><Link href="/" className="hover:text-white">For Organizations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
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
    </div>
  );
}
