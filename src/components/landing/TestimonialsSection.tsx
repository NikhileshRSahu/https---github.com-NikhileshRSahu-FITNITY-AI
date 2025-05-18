
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  avatarSrc: string;
  avatarFallback: string;
  quote: string;
  rating: number;
  avatarHint: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Rohan Sharma',
    role: 'Marathon Runner',
    avatarSrc: 'https://placehold.co/100x100.png',
    avatarFallback: 'RS',
    quote: "The personalized endurance plans from Fitnity AI took my marathon training to a new level. The AI Coach helped me push through tough workouts!",
    rating: 5,
    avatarHint: 'runner portrait',
  },
  {
    name: 'Priya Kaur',
    role: 'New Mom',
    avatarSrc: 'https://placehold.co/100x100.png',
    avatarFallback: 'PK',
    quote: "Getting back into fitness post-partum felt daunting. Fitnity's gentle progression and real-time form checks for at-home workouts made it safe and effective.",
    rating: 5,
    avatarHint: 'woman smiling',
  },
  {
    name: 'Arjun Mehra',
    role: 'Strength Trainee',
    avatarSrc: 'https://placehold.co/100x100.png',
    avatarFallback: 'AM',
    quote: "I was stuck in a plateau for months. The AI's strength-focused routines and form analysis helped me break through and finally see gains again. Highly recommend!",
    rating: 4, 
    avatarHint: 'man athletic',
  },
];

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 sm:h-5 sm:w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center text-foreground mb-12 md:mb-16 animate-fade-in-up">
          Loved by Users Like You
        </h2>
        <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={testimonial.name} className="glassmorphic-card p-6 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out animate-fade-in-up" style={{ animationDelay: `${index * 0.1 + 0.2}s` }}>
              <div>
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                    <AvatarImage src={testimonial.avatarSrc} alt={testimonial.name} data-ai-hint={testimonial.avatarHint} />
                    <AvatarFallback>{testimonial.avatarFallback}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg">{testimonial.name}</h3>
                    <p className="text-xs sm:text-sm text-card-foreground/70">{testimonial.role}</p>
                  </div>
                </div>
                <blockquote className="text-sm sm:text-base text-card-foreground/80 italic mb-4">
                  "{testimonial.quote}"
                </blockquote>
              </div>
              <RatingStars rating={testimonial.rating} />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
