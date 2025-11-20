import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  metric: string;
  metricValue: string;
  videoUrl: string;
  thumbnail: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "VP of People Operations",
    company: "Fortune 500 Tech Company",
    metric: "Healthcare Cost Savings",
    metricValue: "$2.3M",
    videoUrl: "https://example.com/video1.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=450&fit=crop",
    quote:
      "Implementing this platform reduced our healthcare costs by 20% while improving employee satisfaction. The ROI was immediate.",
  },
  {
    id: "2",
    name: "Dr. James Mitchell",
    title: "Chief Medical Officer",
    company: "Healthcare Network",
    metric: "Burnout Reduction",
    metricValue: "42%",
    videoUrl: "https://example.com/video2.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop",
    quote:
      "Our clinical staff experienced a dramatic reduction in burnout. The emotional resilience coaching made a real difference in their wellbeing.",
  },
  {
    id: "3",
    name: "Lisa Rodriguez",
    title: "Chief People Officer",
    company: "Financial Services Firm",
    metric: "Retention Improvement",
    metricValue: "38%",
    videoUrl: "https://example.com/video3.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=450&fit=crop",
    quote:
      "Employee retention improved significantly. Our people feel supported and valued. This platform is a game-changer for retention.",
  },
];

/**
 * Video Testimonials Component
 * Displays carousel of video testimonials with metrics
 * Research shows 80% conversion lift potential
 */
export function VideoTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const current = testimonials[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setPlayingId(null);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setPlayingId(null);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Hear From Enterprise Leaders
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how leading organizations transformed their employee wellbeing and bottom line
          </p>
        </div>

        {/* Video Carousel */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Video Player */}
          <div className="relative">
            <Card className="overflow-hidden border-0 shadow-2xl">
              <div className="relative bg-black aspect-video flex items-center justify-center group">
                <img
                  src={current.thumbnail}
                  alt={current.name}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition"
                />
                <button
                  onClick={() => setPlayingId(current.id)}
                  className="absolute inset-0 flex items-center justify-center z-10 group-hover:scale-110 transition"
                >
                  <div className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-6 shadow-lg">
                    <Play className="h-8 w-8 fill-white" />
                  </div>
                </button>

                {/* Play indicator */}
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ▶ PLAY VIDEO
                </div>
              </div>
            </Card>

            {/* Navigation Arrows */}
            <div className="flex gap-4 mt-6 justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Testimonial Content */}
          <div className="space-y-8">
            {/* Quote */}
            <div>
              <p className="text-2xl font-semibold text-gray-900 mb-6 leading-relaxed">
                "{current.quote}"
              </p>
            </div>

            {/* Speaker Info */}
            <div className="border-l-4 border-blue-600 pl-6">
              <p className="text-xl font-semibold text-gray-900">{current.name}</p>
              <p className="text-gray-600">{current.title}</p>
              <p className="text-gray-500 text-sm">{current.company}</p>
            </div>

            {/* Metric Highlight */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-6">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
                {current.metric}
              </p>
              <p className="text-4xl font-bold text-blue-900">{current.metricValue}</p>
            </Card>

            {/* Testimonial Indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveIndex(idx);
                    setPlayingId(null);
                  }}
                  className={`h-2 rounded-full transition ${
                    idx === activeIndex
                      ? "bg-blue-600 w-8"
                      : "bg-gray-300 w-2 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            {/* CTA */}
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-8 text-lg w-full">
              Schedule Your Strategy Call
            </Button>
          </div>
        </div>

        {/* Trust Metrics */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 pt-12 border-t border-gray-200">
          {[
            { value: "$2.3M", label: "Average Savings Per Client" },
            { value: "42%", label: "Average Burnout Reduction" },
            { value: "38%", label: "Average Retention Improvement" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
