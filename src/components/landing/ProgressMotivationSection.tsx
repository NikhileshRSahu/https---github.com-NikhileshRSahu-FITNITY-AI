
import { LineChart, Award, Lightbulb } from 'lucide-react';

export default function ProgressMotivationSection() {
  return (
    <section id="progress" className="py-16 md:py-24 bg-background/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
              Track. Improve. Achieve.
            </h2>
            <p className="text-lg text-foreground/80">
              Our smart progress charts make it easy to see how far you've come. Earn badges, maintain streaks, and stay motivated with gamified features designed to keep you engaged and pushing your limits.
            </p>
            <ul className="space-y-3 text-foreground/80">
              <li className="flex items-center gap-3">
                <LineChart className="h-6 w-6 text-accent flex-shrink-0" />
                <span>Interactive performance dashboards</span>
              </li>
              <li className="flex items-center gap-3">
                <Award className="h-6 w-6 text-accent flex-shrink-0" />
                <span>Gamification with badges and streaks</span>
              </li>
              <li className="flex items-center gap-3">
                <Lightbulb className="h-6 w-6 text-accent flex-shrink-0" />
                <span>Personalized motivation and AI insights</span>
              </li>
            </ul>
          </div>
          <div className="flex justify-center rounded-xl shadow-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <video
              src="/vedios/48420-453832153_medium.mp4" // Path to your second video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover aspect-[16/10] md:aspect-[800/500]" // Maintain aspect ratio
              poster="https://placehold.co/800x500.png" // Fallback poster
            />
          </div>
        </div>
      </div>
    </section>
  );
}
