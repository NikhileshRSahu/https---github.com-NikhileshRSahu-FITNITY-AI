import Image from 'next/image';

export default function ProgressMotivationSection() {
  return (
    <section id="progress" className="py-16 md:py-24 bg-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-primary-foreground">
              Track. Improve. Achieve.
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Our smart progress charts make it easy to see how far you've come. Earn badges, maintain streaks, and stay motivated with gamified features designed to keep you engaged and pushing your limits.
            </p>
            <ul className="space-y-2 text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-accent" />
                <span>Interactive performance dashboards</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-accent" />
                <span>Gamification with badges and streaks</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-accent" />
                <span>Personalized motivation and AI insights</span>
              </li>
            </ul>
          </div>
          <div className="flex justify-center">
            <Image
              src="https://placehold.co/800x500.png"
              alt="Dashboard Preview"
              width={800}
              height={500}
              className="rounded-xl shadow-2xl object-cover"
              data-ai-hint="dashboard fitness"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
