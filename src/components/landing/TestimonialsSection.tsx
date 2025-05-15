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
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah L.',
    role: 'Fitness Enthusiast',
    avatarSrc: 'https://placehold.co/100x100.png',
    avatarFallback: 'SL',
    quote: "Fitnity's AI form correction is a game-changer! I feel more confident and see better results.",
    rating: 5,
  },
  {
    name: 'Mike P.',
    role: 'Busy Professional',
    avatarSrc: 'https://placehold.co/100x100.png',
    avatarFallback: 'MP',
    quote: "The adaptive workouts fit my hectic schedule perfectly. The AI coach keeps me motivated.",
    rating: 5,
  },
  {
    name: 'Jessica K.',
    role: 'Beginner Yogi',
    avatarSrc: 'https://placehold.co/100x100.png',
    avatarFallback: 'JK',
    quote: "I love how the AI adjusts to my level. It's like having a personal trainer available 24/7.",
    rating: 4,
  },
];

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl md:text-5xl text-primary-foreground mb-12">
          Loved by Users Like You
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="glassmorphic-card p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatarSrc} alt={testimonial.name} data-ai-hint="person" />
                    <AvatarFallback>{testimonial.avatarFallback}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg text-primary-foreground">{testimonial.name}</h3>
                    <p className="text-sm text-primary-foreground/70">{testimonial.role}</p>
                  </div>
                </div>
                <blockquote className="text-primary-foreground/80 italic mb-4">
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
