
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { LineChart, CartesianGrid, XAxis, YAxis, Line, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { Award, Flame, HeartPulse, LineChart as LineChartIcon, Scaling, Star, TrendingUp, Users, Droplets } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const workoutData = [
  { week: 'Wk 1', workouts: 3, goal: 4 },
  { week: 'Wk 2', workouts: 4, goal: 4 },
  { week: 'Wk 3', workouts: 2, goal: 4 },
  { week: 'Wk 4', workouts: 5, goal: 4 },
  { week: 'Wk 5', workouts: 3, goal: 5 },
  { week: 'Wk 6', workouts: 4, goal: 5 },
];

const chartConfig: ChartConfig = {
  workouts: {
    label: "Workouts Completed",
    color: "hsl(var(--accent))",
  },
  goal: {
    label: "Workout Goal",
    color: "hsl(var(--muted-foreground))",
  }
};

const bodyMeasurementData = {
  weight: { value: '72.5', unit: 'kg', trend: 'down' },
  bodyFat: { value: '18', unit: '%', trend: 'down' },
  muscleMass: { value: '35', unit: 'kg', trend: 'up' },
};

const streaksAndBadges = {
  currentStreak: 12, // days
  totalBadges: 5,
  recentBadges: [
    { name: '7-Day Streak', icon: Flame, date: 'July 20' },
    { name: 'Morning Mover', icon: Star, date: 'July 18' },
    { name: 'Workout Warrior', icon: Award, date: 'July 15' },
  ],
};

const healthSnapshotData = {
  sleep: { value: '7h 30m', avgLastWeek: '7h 15m' },
  waterIntake: { current: 2.5, goal: 3, unit: 'L' },
  steps: { current: 8500, goal: 10000 },
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-foreground text-center">My Progress Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Workout Consistency Card */}
        <Card className="glassmorphic-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <TrendingUp className="mr-3 h-6 w-6 text-accent" /> Workout Consistency
            </CardTitle>
            <CardDescription>Your workouts per week over the last 6 weeks.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={workoutData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.3)" />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" labelClassName="text-sm" className="glassmorphic-card !border-border/50" />}
                  />
                   <Legend content={({ payload }) => (
                    <div className="flex justify-center space-x-4 mt-4">
                      {payload?.map((entry, index) => (
                        <div key={`item-${index}`} className="flex items-center space-x-1 text-sm text-card-foreground/80">
                          <span style={{ backgroundColor: entry.color, width: '10px', height: '10px', display: 'inline-block', borderRadius: '2px' }}></span>
                          <span>{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )} />
                  <Line type="monotone" dataKey="workouts" strokeWidth={2} stroke="hsl(var(--accent))" dot={{ r: 4, fill: "hsl(var(--accent))" }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="goal" strokeWidth={2} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Body Measurements Card */}
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Scaling className="mr-3 h-6 w-6 text-accent" /> Body Measurements
            </CardTitle>
            <CardDescription>Your current key body metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline justify-between p-3 rounded-lg bg-background/10">
              <span className="font-medium text-card-foreground">Weight:</span>
              <span className="text-2xl font-semibold text-accent">{bodyMeasurementData.weight.value} <span className="text-sm text-card-foreground/70">{bodyMeasurementData.weight.unit}</span></span>
            </div>
            <div className="flex items-baseline justify-between p-3 rounded-lg bg-background/10">
              <span className="font-medium text-card-foreground">Body Fat %:</span>
               <span className="text-2xl font-semibold text-accent">{bodyMeasurementData.bodyFat.value}<span className="text-sm text-card-foreground/70">{bodyMeasurementData.bodyFat.unit}</span></span>
            </div>
            <div className="flex items-baseline justify-between p-3 rounded-lg bg-background/10">
              <span className="font-medium text-card-foreground">Muscle Mass:</span>
              <span className="text-2xl font-semibold text-accent">{bodyMeasurementData.muscleMass.value} <span className="text-sm text-card-foreground/70">{bodyMeasurementData.muscleMass.unit}</span></span>
            </div>
          </CardContent>
        </Card>

        {/* Streaks & Achievements Card */}
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Award className="mr-3 h-6 w-6 text-accent" /> Streaks & Achievements
            </CardTitle>
            <CardDescription>Your accomplishments and consistency.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
              <span className="font-medium text-card-foreground">Current Workout Streak:</span>
              <span className="text-xl font-semibold text-accent">{streaksAndBadges.currentStreak} days</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
              <span className="font-medium text-card-foreground">Total Badges Unlocked:</span>
              <span className="text-xl font-semibold text-accent">{streaksAndBadges.totalBadges}</span>
            </div>
            <div>
              <h4 className="font-medium text-card-foreground/90 mb-2">Recent Badges:</h4>
              <ul className="space-y-2">
                {streaksAndBadges.recentBadges.map((badge, idx) => (
                  <li key={idx} className="flex items-center gap-3 p-2 rounded-md bg-background/5">
                    <badge.icon className="h-6 w-6 text-accent" />
                    <div>
                      <p className="font-medium text-sm text-card-foreground">{badge.name}</p>
                      <p className="text-xs text-card-foreground/70">Earned: {badge.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Health Snapshot Card */}
        <Card className="glassmorphic-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <HeartPulse className="mr-3 h-6 w-6 text-accent" /> Daily Health Snapshot
            </CardTitle>
            <CardDescription>Your recent sleep, hydration and activity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-background/10 text-center">
                    <p className="text-sm font-medium text-card-foreground/80 mb-1">Avg. Sleep (Last Wk)</p>
                    <p className="text-2xl font-semibold text-accent">{healthSnapshotData.sleep.avgLastWeek}</p>
                </div>
                <div className="p-3 rounded-lg bg-background/10 text-center">
                    <p className="text-sm font-medium text-card-foreground/80 mb-1">Today's Water Intake</p>
                    <p className="text-2xl font-semibold text-accent">{healthSnapshotData.waterIntake.current}{healthSnapshotData.waterIntake.unit} <span className="text-base text-card-foreground/70">/ {healthSnapshotData.waterIntake.goal}{healthSnapshotData.waterIntake.unit}</span></p>
                    <Progress value={(healthSnapshotData.waterIntake.current / healthSnapshotData.waterIntake.goal) * 100} className="h-2 mt-2 bg-accent/20 [&>div]:bg-accent" />
                </div>
                 <div className="p-3 rounded-lg bg-background/10 text-center">
                    <p className="text-sm font-medium text-card-foreground/80 mb-1">Today's Steps</p>
                    <p className="text-2xl font-semibold text-accent">{healthSnapshotData.steps.current.toLocaleString()} <span className="text-base text-card-foreground/70">/ {healthSnapshotData.steps.goal.toLocaleString()}</span></p>
                     <Progress value={(healthSnapshotData.steps.current / healthSnapshotData.steps.goal) * 100} className="h-2 mt-2 bg-accent/20 [&>div]:bg-accent" />
                </div>
            </div>
            <div className="mt-6 p-4 rounded-lg bg-background/10">
                <h4 className="font-medium text-card-foreground mb-2 flex items-center"><Droplets className="mr-2 h-5 w-5 text-accent/80"/> Hydration Tip:</h4>
                <p className="text-sm text-card-foreground/80 italic">Carry a water bottle with you and sip throughout the day. Aim for consistent intake rather than large amounts at once.</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
