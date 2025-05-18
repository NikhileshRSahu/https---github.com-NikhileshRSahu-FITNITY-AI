
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Dumbbell, TrendingUp, Icon } from 'lucide-react';

interface StepCardProps {
  icon: Icon;
  stepNumber: number;
  title: string;
  description: string;
}

function StepCard({ icon: IconComponent, stepNumber, title, description }: StepCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out rounded-lg">
      <div className="relative mb-4">
        <div className="p-3 sm:p-4 bg-accent/20 rounded-full ring-2 sm:ring-4 ring-accent/30">
          <IconComponent className="h-10 w-10 sm:h-12 sm:w-12 text-accent" />
        </div>
        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-accent text-accent-foreground rounded-full h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center font-bold text-xs sm:text-sm">
          {stepNumber}
        </div>
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-foreground/80">{description}</p>
    </div>
  );
}

export default function HowItWorksSection() {
  const steps: Omit<StepCardProps, 'stepNumber'>[] = [
    {
      icon: Target,
      title: 'Set Your Goals',
      description: 'Tell us what you want to achieve, your preferences, and current fitness level.',
    },
    {
      icon: Dumbbell,
      title: 'Work Out Smarter',
      description: 'Follow AI-generated workouts with real-time form correction and guidance.',
    },
    {
      icon: TrendingUp,
      title: 'Track & Improve',
      description: 'Monitor your progress, get insights, and let the AI adapt your plan for continuous growth.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center text-foreground mb-12 md:mb-16 animate-fade-in-up">
          Getting Started is Easy
        </h2>
        <div className="grid gap-8 sm:gap-12 grid-cols-1 md:grid-cols-3 items-start relative">
          {/* Dashed line connector for desktop */}
          <div className="hidden md:block absolute top-[calc(50% - 1px)] left-1/4 right-1/4 h-0.5 -translate-y-1/2 opacity-30">
             <svg width="100%" height="2px">
                <line x1="0" y1="1" x2="100%" y2="1" strokeDasharray="10,10" stroke="hsl(var(--foreground))" strokeWidth="2"/>
            </svg>
          </div>
          {steps.map((step, index) => (
            <div key={step.title} className="relative z-10 animate-fade-in-up" style={{ animationDelay: `${index * 0.15 + 0.3}s` }}>
                 <StepCard {...step} stepNumber={index + 1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
