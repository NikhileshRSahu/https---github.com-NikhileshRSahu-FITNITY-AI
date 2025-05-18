
import { LineChart, Award, Lightbulb } from 'lucide-react';

export default function ProgressMotivationSection() {
  return (
    <section id="progress" className="py-16 md:py-28 lg:py-32 bg-background/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 xl:gap-16 items-center">
          <div className="space-y-6 md:space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Track. Improve. Achieve.
            </h2>
            <p className="text-base sm:text-lg text-foreground/80 md:text-xl">
              Our smart progress charts make it easy to see how far you've come. Earn badges, maintain streaks, and stay motivated with gamified features designed to keep you engaged and pushing your limits.
            </p>
            <ul className="space-y-3 sm:space-y-4 text-foreground/90">
              <li className="flex items-center gap-3 sm:gap-4">
                <LineChart className="h-6 w-6 sm:h-7 sm:w-7 text-accent flex-shrink-0" />
                <span className="text-base sm:text-lg">Interactive performance dashboards</span>
              </li>
              <li className="flex items-center gap-3 sm:gap-4">
                <Award className="h-6 w-6 sm:h-7 sm:w-7 text-accent flex-shrink-0" />
                <span className="text-base sm:text-lg">Gamification with badges and streaks</span>
              </li>
              <li className="flex items-center gap-3 sm:gap-4">
                <Lightbulb className="h-6 w-6 sm:h-7 sm:w-7 text-accent flex-shrink-0" />
                <span className="text-base sm:text-lg">Personalized motivation and AI insights</span>
              </li>
            </ul>
          </div>
          <div 
            className="flex justify-center rounded-xl shadow-2xl overflow-hidden animate-fade-in-up" 
            style={{ animationDelay: '0.4s' }}
            data-ai-hint="futuristic data visualization hud abstract tech"
          >
            <video
              src="/vedios/48420-453832153_medium.mp4" // Path to your second video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover aspect-[16/10] md:aspect-[800/500]"
              poster="https://placehold.co/800x500.png" // Fallback poster
            />
          </div>
        </div>
      </div>
    </section>
  );
}
