
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, ScanLine, MicVocal, LineChart, Apple as NutritionIcon, type Icon } from 'lucide-react';

interface FeatureCardProps {
  icon: Icon;
  title: string;
  description: string;
}

function FeatureCard({ icon: IconComponent, title, description }: FeatureCardProps) {
  return (
    <Card className="glassmorphic-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <IconComponent className="h-10 w-10 text-accent flex-shrink-0" />
        <CardTitle className="text-xl font-semibold">{title}</CardTitle> 
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-card-foreground/80">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function FeaturesSnapshotSection() {
  const features: FeatureCardProps[] = [
    {
      icon: Brain,
      title: 'Adaptive AI Workouts',
      description: 'Personalized plans that evolve with your progress, fitness level, and goals.',
    },
    {
      icon: ScanLine,
      title: 'Real-time Form Analysis',
      description: 'Instant feedback on your exercise form via webcam to maximize results and prevent injury.',
    },
    {
      icon: MicVocal,
      title: 'AI Coach & Voice Assistant',
      description: 'Get guidance, motivation, and answers in English & Hindi through chat or voice.',
    },
    {
      icon: LineChart,
      title: 'Progress Tracking Dashboard',
      description: 'Visualize your journey with comprehensive metrics for workouts, health, and habits.',
    },
    {
      icon: NutritionIcon,
      title: 'AI Nutrition Planner',
      description: 'Get personalized meal plans and dietary advice tailored to your goals and preferences.',
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-background/5">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl md:text-5xl text-foreground mb-16">
          Unlock Your Fitness Potential
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"> {/* Adjusted grid for 5 items */}
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
