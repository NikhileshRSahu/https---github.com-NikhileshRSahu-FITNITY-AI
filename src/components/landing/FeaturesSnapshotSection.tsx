
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, ScanLine, MicVocal, LineChart, Icon } from 'lucide-react';

interface FeatureCardProps {
  icon: Icon;
  title: string;
  description: string;
}

function FeatureCard({ icon: IconComponent, title, description }: FeatureCardProps) {
  return (
    <Card className="glassmorphic-card hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <IconComponent className="h-10 w-10 text-accent" />
        <CardTitle className="text-xl font-semibold">{title}</CardTitle> 
      </CardHeader>
      <CardContent>
        <p className="text-card-foreground/80">{description}</p>
      </CardContent>
    </Card>
  );
}
// Note: CardTitle inside glassmorphic-card will use card-foreground as per globals.css, which is correct.
// Description also uses card-foreground/80.

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
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-background/5"> {/* Changed bg-white/5 to bg-background/5 for theme consistency */}
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl md:text-5xl text-foreground mb-12">
          Unlock Your Fitness Potential
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
