'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { LineChart, CartesianGrid, XAxis, YAxis, Line, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Award, Flame, HeartPulse, TrendingUp, Scaling, Star, Droplets, Trophy, CalendarDays, BarChart4, Dumbbell, Zap, Activity, ShieldCheck, Sparkles, Lock, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Skeleton } from '@/components/ui/skeleton';


const weeklyWorkoutData = [
  { week: 'Wk 1', workouts: 3 }, { week: 'Wk 2', workouts: 4 }, { week: 'Wk 3', workouts: 2 }, { week: 'Wk 4', workouts: 5 },
  { week: 'Wk 5', workouts: 4 }, { week: 'Wk 6', workouts: 3 }, { week: 'Wk 7', workouts: 5 }, { week: 'Wk 8', workouts: 4 },
];

const monthlyWorkoutData = [
  { month: 'Jan', workouts: 15 }, { month: 'Feb', workouts: 18 }, { month: 'Mar', workouts: 12 }, { month: 'Apr', workouts: 20 },
  { month: 'May', workouts: 16 }, { month: 'Jun', workouts: 19 }, { month: 'Jul', workouts: 22 }, { month: 'Aug', workouts: 17 },
];

const allTimeWorkoutData = [
    { period: 'Q1 \'23', workouts: 45 }, { period: 'Q2 \'23', workouts: 55 }, { period: 'Q3 \'23', workouts: 50 },
    { period: 'Q4 \'23', workouts: 60 }, { period: 'Q1 \'24', workouts: 52 }, { period: 'Q2 \'24', workouts: 58 },
];

const chartConfig: ChartConfig = {
  workouts: {
    label: "Workouts",
    color: "hsl(var(--accent))",
  },
};

const bodyMeasurementData = {
  weight: { value: '71.5', unit: 'kg' },
  bodyFat: { value: '16.9', unit: '%' },
  muscleMass: { value: '35.8', unit: 'kg' },
};

const streaksAndBadges = {
  currentStreak: 21,
  totalBadges: 12,
  currentChallengeStreak: { name: '30-Day Cardio Blast', day: 15, totalDays: 30, icon: Flame },
  recentBadges: [
    { name: 'Consistent Challenger Pro', icon: Flame, date: 'July 28' },
    { name: 'Workout Warrior Supreme', icon: Award, date: 'July 25' },
    { name: 'Zen Master Yogi', icon: Zap, date: 'July 22' },
    { name: 'Cardio King', icon: Activity, date: 'July 20' },
  ],
};

const healthSnapshotData = {
  sleep: { value: '7h 55m', avgLastWeek: '7h 30m' },
  waterIntake: { current: 2.9, goal: 3.5, unit: 'L' },
  steps: { current: 10500, goal: 10000 },
};

const personalRecordsData = [
    { name: 'Fastest 5km Run', value: '22:15 min', icon: TrendingUp },
    { name: 'Max Deadlift', value: '120 kg', icon: Scaling },
    { name: 'Longest Plank Hold', value: '3m 45s', icon: Flame },
    { name: 'Most Steps in a Day', value: '18,250', icon: Award },
    { name: 'Highest Elevation Climbed', value: '1200 m', icon: Dumbbell},
    { name: 'Consecutive Pull-ups', value: '15 reps', icon: Zap},
];

type TimeRange = 'weekly' | 'monthly' | 'allTime';

interface LockedFeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType; // Use a more generic type for icon
}

function LockedFeatureCard({ title, description, icon: Icon }: LockedFeatureCardProps) {
  return (
    <Card className="glassmorphic-card hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up flex flex-col items-center justify-center text-center p-6">
      <Lock className="h-12 w-12 text-primary dark:text-yellow-400 mb-4" />
      <CardTitle className="text-xl font-semibold text-foreground mb-2">{title}</CardTitle>
      <CardDescription className="text-foreground/70 mb-6 text-sm">{description}</CardDescription>
      <Button asChild size="sm" 
        className="bg-primary dark:bg-accent hover:bg-primary/90 dark:hover:bg-accent/90 text-primary-foreground dark:text-accent-foreground cta-glow-pulse active:scale-95
                   light:bg-primary light:text-primary-foreground light:hover:bg-gradient-to-r light:hover:from-primary light:hover:to-accent
                   dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90"
      >
        <Link href="/#pricing">View Pricing Plans</Link>
      </Button>
    </Card>
  );
}


export default function DashboardPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('weekly');
  const { isFeatureAccessible, mounted: subscriptionMounted } = useSubscription();
  const [pageMounted, setPageMounted] = useState(false);

  useEffect(() => {
    setPageMounted(true);
  }, []);


  const getCurrentChartData = () => {
    switch (selectedTimeRange) {
      case 'monthly':
        return monthlyWorkoutData;
      case 'allTime':
        return allTimeWorkoutData;
      case 'weekly':
      default:
        return weeklyWorkoutData;
    }
  };

  const getXAxisDataKey = () => {
    switch (selectedTimeRange) {
      case 'monthly':
        return 'month';
      case 'allTime':
        return 'period';
      case 'weekly':
      default:
        return 'week';
    }
  };

  const chartData = getCurrentChartData();
  const xAxisKey = getXAxisDataKey();

  if (!pageMounted || !subscriptionMounted) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <Skeleton className="h-10 w-3/4 sm:w-1/2 mx-auto mb-10" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="glassmorphic-card lg:col-span-2 animate-fade-in-up">
            <CardHeader><Skeleton className="h-6 w-1/2 mb-2" /><Skeleton className="h-4 w-3/4" /></CardHeader>
            <CardContent><Skeleton className="h-[200px] sm:h-[250px] w-full" /></CardContent>
          </Card>
          <Card className="glassmorphic-card animate-fade-in-up">
            <CardHeader><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-4 w-1/2" /></CardHeader>
            <CardContent className="space-y-4"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></CardContent>
          </Card>
          <Card className="glassmorphic-card animate-fade-in-up">
            <CardHeader><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-4 w-1/2" /></CardHeader>
            <CardContent className="space-y-3"><Skeleton className="h-6 w-5/6" /><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-4/5" /></CardContent>
          </Card>
          <Card className="glassmorphic-card animate-fade-in-up">
            <CardHeader><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-4 w-1/2" /></CardHeader>
            <CardContent className="space-y-4"><Skeleton className="h-8 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-8 w-full" /></CardContent>
          </Card>
          <Card className="glassmorphic-card lg:col-span-2 animate-fade-in-up">
            <CardHeader><Skeleton className="h-6 w-1/2 mb-2" /><Skeleton className="h-4 w-3/4" /></CardHeader>
            <CardContent className="space-y-4"><Skeleton className="h-16 w-full" /><Skeleton className="h-10 w-full" /></CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-fade-in-up">
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-foreground text-center animate-fade-in-up">My Progress Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isFeatureAccessible('dashboardWorkoutConsistency') ? (
            <Card className="glassmorphic-card lg:col-span-2 hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                <CardTitle className="flex items-center text-xl">
                    <TrendingUp className="mr-3 h-6 w-6 text-primary dark:text-accent" /> Workout Consistency
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-card-foreground/80">Your workouts completed over time.</CardDescription>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-0">
                {(['weekly', 'monthly', 'allTime'] as TimeRange[]).map((range) => (
                    <Button
                    key={range}
                    variant={selectedTimeRange === range ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTimeRange(range)}
                    className={cn(
                        "capitalize text-xs px-2 py-1 sm:px-3 h-auto",
                        selectedTimeRange === range
                        ? "bg-primary dark:bg-accent hover:bg-primary/90 dark:hover:bg-accent/90 text-primary-foreground dark:text-accent-foreground"
                        : "border-primary dark:border-accent text-primary dark:text-accent hover:bg-primary/10 dark:hover:bg-accent/10 hover:text-primary-foreground dark:hover:text-accent-foreground"
                    )}
                    >
                    {range === 'allTime' ? 'All Time' : range}
                    </Button>
                ))}
                </div>
            </CardHeader>
            <CardContent>
                {chartData && chartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid
                        vertical={false}
                        stroke="hsl(var(--muted-foreground) / 0.2)"
                        strokeDasharray="3 3"
                        />
                        <XAxis
                        dataKey={xAxisKey}
                        tickLine={false}
                        axisLine={false}
                        stroke="hsl(var(--muted-foreground))"
                        dy={10}
                        tick={{fontSize: '0.75rem'}}
                        />
                        <YAxis
                        tickLine={false}
                        axisLine={false}
                        stroke="hsl(var(--muted-foreground))"
                        allowDecimals={false}
                        width={40}
                        dx={-5}
                        tick={{fontSize: '0.75rem'}}
                        />
                        <ChartTooltip
                        cursor={{ stroke: "hsl(var(--muted-foreground) / 0.3)", strokeWidth: 1, strokeDasharray: "3 3" }}
                        content={<ChartTooltipContent indicator="dot" labelClassName="text-sm" className="glassmorphic-card !border-border/50" />}
                        />
                        <Line
                        type="monotone"
                        dataKey="workouts"
                        strokeWidth={3}
                        stroke="hsl(var(--primary))"
                        className="dark:stroke-primary" 
                        dot={false}
                        activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--primary))" }}
                        isAnimationActive={true}
                        />
                    </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
                ) : (
                <Alert className="bg-background/30 border-border/50 text-card-foreground justify-center text-center">
                    <BarChart4 className="h-5 w-5 text-primary dark:text-accent mx-auto mb-2" />
                    <AlertTitle>No Data Yet</AlertTitle>
                    <AlertDescription>
                    No workout data available for this period. Start logging your workouts to see your consistency!
                    </AlertDescription>
                </Alert>
                )}
            </CardContent>
            </Card>
        ) : (
             <LockedFeatureCard 
                title="Unlock Workout Consistency"
                description="Track your workout trends. This feature is available on Premium and Unlimited plans."
                icon={TrendingUp} 
            />
        )}

        {isFeatureAccessible('dashboardBodyMeasurements') ? (
            <Card className="glassmorphic-card hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <CardHeader>
                <CardTitle className="flex items-center text-xl">
                <Scaling className="mr-3 h-6 w-6 text-primary dark:text-accent" /> Body Measurements
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-card-foreground/80">Your current key body metrics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-baseline justify-between p-3 rounded-lg bg-background/10">
                <span className="font-medium text-sm sm:text-base text-card-foreground">Weight:</span>
                <span className="text-xl sm:text-2xl font-semibold text-primary dark:text-accent">{bodyMeasurementData.weight.value} <span className="text-xs sm:text-sm text-card-foreground/70">{bodyMeasurementData.weight.unit}</span></span>
                </div>
                <div className="flex items-baseline justify-between p-3 rounded-lg bg-background/10">
                <span className="font-medium text-sm sm:text-base text-card-foreground">Body Fat %:</span>
                <span className="text-xl sm:text-2xl font-semibold text-primary dark:text-accent">{bodyMeasurementData.bodyFat.value}<span className="text-xs sm:text-sm text-card-foreground/70">{bodyFatMeasurementData.bodyFat.unit}</span></span>
                </div>
                <div className="flex items-baseline justify-between p-3 rounded-lg bg-background/10">
                <span className="font-medium text-sm sm:text-base text-card-foreground">Muscle Mass:</span>
                <span className="text-xl sm:text-2xl font-semibold text-primary dark:text-accent">{bodyMeasurementData.muscleMass.value} <span className="text-xs sm:text-sm text-card-foreground/70">{bodyMeasurementData.muscleMass.unit}</span></span>
                </div>
            </CardContent>
            </Card>
        ) : (
             <LockedFeatureCard 
                title="Unlock Body Measurements"
                description="Track weight, body fat, and muscle mass. This feature is available with our Premium plans."
                icon={Scaling}
            />
        )}

        {isFeatureAccessible('dashboardPersonalRecords') ? (
            <Card className="glassmorphic-card hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <CardHeader>
                <CardTitle className="flex items-center text-xl">
                <Trophy className="mr-3 h-6 w-6 text-primary dark:text-accent" /> Personal Records
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-card-foreground/80">Your noteworthy achievements.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
                {personalRecordsData && personalRecordsData.length > 0 ? (
                personalRecordsData.map((pr, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-background/10 hover:bg-background/20 transition-colors">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <pr.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary/80 dark:text-accent/80 flex-shrink-0" />
                        <span className="font-medium text-xs sm:text-sm text-card-foreground">{pr.name}:</span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-primary dark:text-accent">{pr.value}</span>
                    </div>
                ))
                ) : (
                <Alert className="bg-background/30 border-border/50 text-card-foreground flex flex-col items-center text-center">
                    <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-primary dark:text-accent mb-2" />
                    <AlertTitle className="mb-1 text-base sm:text-lg">No Records Yet</AlertTitle>
                    <AlertDescription className="text-xs sm:text-sm">
                    Achieve new milestones in your fitness journey and they'll appear here!
                    </AlertDescription>
                </Alert>
                )}
            </CardContent>
            </Card>
        ) : (
             <LockedFeatureCard 
                title="Unlock Personal Records"
                description="Celebrate your fitness milestones. This feature is available with our Premium plans."
                icon={Trophy}
            />
        )}

        {isFeatureAccessible('dashboardStreaksAndBadges') ? (
            <Card className="glassmorphic-card hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <CardHeader>
                <CardTitle className="flex items-center text-xl">
                <Award className="mr-3 h-6 w-6 text-primary dark:text-accent" /> Streaks & Badges
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-card-foreground/80">Your accomplishments and consistency.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
                <span className="font-medium text-sm sm:text-base text-card-foreground">Current Workout Streak:</span>
                <span className="text-lg sm:text-xl font-semibold text-primary dark:text-accent">{streaksAndBadges.currentStreak} days</span>
                </div>
                {streaksAndBadges.currentChallengeStreak && (
                <div className="p-3 rounded-lg bg-primary/10 dark:bg-accent/10 border border-primary/30 dark:border-accent/30 shadow-inner">
                    <div className="flex items-center gap-2 mb-1">
                    <streaksAndBadges.currentChallengeStreak.icon className="h-5 w-5 text-primary/90 dark:text-accent/90"/>
                    <h4 className="font-semibold text-card-foreground text-sm sm:text-base">Current Challenge: {streaksAndBadges.currentChallengeStreak.name}</h4>
                    </div>
                    <Progress 
                    value={(streaksAndBadges.currentChallengeStreak.day / streaksAndBadges.currentChallengeStreak.totalDays) * 100} 
                    className="h-2 bg-primary/20 dark:bg-accent/20 [&>div]:bg-primary dark:[&>div]:bg-accent"
                    />
                    <p className="text-xs text-card-foreground/70 text-right mt-1">
                    Day {streaksAndBadges.currentChallengeStreak.day} of {streaksAndBadges.currentChallengeStreak.totalDays}
                    </p>
                </div>
                )}
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
                <span className="font-medium text-sm sm:text-base text-card-foreground">Total Badges Unlocked:</span>
                <span className="text-lg sm:text-xl font-semibold text-primary dark:text-accent">{streaksAndBadges.totalBadges}</span>
                </div>
                <div>
                <h4 className="font-medium text-card-foreground/90 mb-2 text-sm sm:text-base">Recent Badges:</h4>
                <ul className="space-y-1.5 sm:space-y-2">
                    {streaksAndBadges.recentBadges.map((badge, idx) => (
                    <li key={idx} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg bg-background/10 hover:bg-background/20 transition-colors">
                        <badge.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary dark:text-accent" />
                        <div>
                        <p className="font-medium text-xs sm:text-sm text-card-foreground">{badge.name}</p>
                        <p className="text-xs text-card-foreground/70">Earned: {badge.date}</p>
                        </div>
                    </li>
                    ))}
                </ul>
                </div>
            </CardContent>
            </Card>
        ) : (
            <LockedFeatureCard 
                title="Unlock Streaks & Badges"
                description="Stay motivated with streaks and unlock badges. This feature is available with Premium plans."
                icon={Award}
            />
        )}

        {isFeatureAccessible('dashboardHealthSnapshot') ? (
            <Card className="glassmorphic-card lg:col-span-2 hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
            <CardHeader>
                <CardTitle className="flex items-center text-xl">
                <HeartPulse className="mr-3 h-6 w-6 text-primary dark:text-accent" /> Daily Health Snapshot
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-card-foreground/80">Your recent sleep, hydration and activity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 rounded-lg bg-background/10 text-center">
                        <p className="text-xs sm:text-sm font-medium text-card-foreground/80 mb-1">Avg. Sleep (Last Wk)</p>
                        <p className="text-xl sm:text-2xl font-semibold text-primary dark:text-accent">{healthSnapshotData.sleep.avgLastWeek}</p>
                    </div>
                    <div className="p-3 sm:p-4 rounded-lg bg-background/10 text-center">
                        <p className="text-xs sm:text-sm font-medium text-card-foreground/80 mb-1">Today's Water Intake</p>
                        <p className="text-xl sm:text-2xl font-semibold text-primary dark:text-accent">{healthSnapshotData.waterIntake.current}{healthSnapshotData.waterIntake.unit} <span className="text-sm sm:text-base text-card-foreground/70">/ {healthSnapshotData.waterIntake.goal}{healthSnapshotData.waterIntake.unit}</span></p>
                        <Progress value={(healthSnapshotData.waterIntake.current / healthSnapshotData.waterIntake.goal) * 100} className="h-1.5 sm:h-2 mt-2 bg-primary/20 dark:bg-accent/20 [&>div]:bg-primary dark:[&>div]:bg-accent" />
                    </div>
                    <div className="p-3 sm:p-4 rounded-lg bg-background/10 text-center">
                        <p className="text-xs sm:text-sm font-medium text-card-foreground/80 mb-1">Today's Steps</p>
                        <p className="text-xl sm:text-2xl font-semibold text-primary dark:text-accent">{healthSnapshotData.steps.current.toLocaleString()} <span className="text-sm sm:text-base text-card-foreground/70">/ {healthSnapshotData.steps.goal.toLocaleString()}</span></p>
                        <Progress value={(healthSnapshotData.steps.current / healthSnapshotData.steps.goal) * 100} className="h-1.5 sm:h-2 mt-2 bg-primary/20 dark:bg-accent/20 [&>div]:bg-primary dark:[&>div]:bg-accent" />
                    </div>
                </div>
                <div className="mt-2 p-3 sm:p-4 rounded-lg bg-background/10">
                    <h4 className="font-medium text-card-foreground mb-1.5 sm:mb-2 flex items-center text-sm sm:text-base"><Droplets className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary/80 dark:text-accent/80"/> Hydration Tip:</h4>
                    <p className="text-xs sm:text-sm text-card-foreground/80 italic">Carry a reusable water bottle with you and sip throughout the day. Aim for consistent intake rather than large amounts at once for optimal hydration.</p>
                </div>
            </CardContent>
            </Card>
         ) : (
            <LockedFeatureCard 
                title="Unlock Daily Health Snapshot"
                description="Monitor daily health metrics. This feature is available with Premium plans."
                icon={HeartPulse}
            />
        )}
      </div>
    </div>
  );
}
