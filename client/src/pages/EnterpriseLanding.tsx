import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, Building, Users, BarChart } from "lucide-react";

export default function EnterpriseLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION - B2B Focus */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl text-center mx-auto">
            <Badge className="mb-4 bg-blue-200 text-blue-900">For Your Business</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
              Unlock Your Team's Full Potential
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Purposeful Live Coaching provides a scalable, AI-powered platform to enhance employee well-being, reduce burnout, and boost productivity. Give your team the confidential, 24/7 support they need to thrive.
            </p>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            >
              Request a Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">A Strategic Investment in Your People</h2>
            <p className="mt-4 text-lg text-gray-600">Drive business outcomes by prioritizing mental and emotional wellness.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mx-auto">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900">Reduce Burnout & Turnover</h3>
              <p className="mt-2 text-base text-gray-600">Provide proactive support to prevent employee burnout, leading to higher retention rates and reduced hiring costs.</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mx-auto">
                <BarChart className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900">Increase Productivity & Focus</h3>
              <p className="mt-2 text-base text-gray-600">Equip your team with tools to manage stress and improve focus, directly impacting performance and output.</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mx-auto">
                <Building className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900">Build a Resilient Culture</h3>
              <p className="mt-2 text-base text-gray-600">Demonstrate a commitment to employee well-being, fostering a positive and resilient workplace culture.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Flexible Plans for Every Organization</h2>
            <p className="mt-4 text-lg text-gray-600">Choose the plan that best fits your team's size and needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pricing Cards Here */}
          </div>
        </div>
      </section>
    </div>
  );
}
