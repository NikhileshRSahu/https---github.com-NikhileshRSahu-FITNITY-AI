
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { LineChart, CartesianGrid, XAxis, YAxis, Line, ResponsiveContainer } from 'recharts';
import { Award, Flame, HeartPulse, TrendingUp, Scaling, Star, Droplets, Trophy, CalendarDays } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const weeklyWorkoutData = [
  { week: 'Wk 1', workouts: 3 },
  { week: 'Wk 2', workouts: 4 },
  { week: 'Wk 3', workouts: 2 },
  { week: 'Wk 4', workouts: 5 },
  { week: 'Wk 5', workouts: 3 },
  { week: 'Wk 6', workouts: 4 },
  { week: 'Wk 7', workouts: 5 },
  { week: 'Wk 8', workouts: 3 },
];

// Placeholder data - in a real app, this would be fetched or calculated
const monthlyWorkoutData = [
  { month: 'Jan', workouts: 15 },
  { month: 'Feb', workouts: 18 },
  { month: 'Mar', workouts: 12 },
  { month: 'Apr', workouts: 20 },
  { month: 'May', workouts: 16 },
  { month: 'Jun', workouts: 19 },
];

const allTimeWorkoutData = [ // Could be quarterly or yearly aggregated
    { period: 'Q1', workouts: 45 },
    { period: 'Q2', workouts: 55 },
    { period: 'Q3', workouts: 50 },
    { period: 'Q4', workouts: 60 },
];


const chartConfig: ChartConfig = {
  workouts: {
    label: "Workouts", // Simplified label
    color: "hsl(var(--accent))",
  },
};

const bodyMeasurementData = {
  weight: { value: '72.1', unit: 'kg' },
  bodyFat: { value: '17.8', unit: '%' },
  muscleMass: { value: '35.2', unit: 'kg' },
};

const streaksAndBadges = {
  currentStreak: 14,
  totalBadges: 7,
  recentBadges: [
    { name: 'Consistent Challenger', icon: Flame, date: 'July 23' },
    { name: 'Morning Mover Pro', icon: Star, date: 'July 21' },
    { name: 'Workout Warrior Elite', icon: Award, date: 'July 19' },
  ],
};

const healthSnapshotData = {
  sleep: { value: '7h 45m', avgLastWeek: '7h 20m' },
  waterIntake: { current: 2.8, goal: 3, unit: 'L' },
  steps: { current: 9200, goal: 10000 },
};

const personalRecordsData = [
    { name: 'Fastest 1km Run', value: '4:25 min', icon: TrendingUp },
    { name: 'Max Bench Press', value: '85 kg', icon: Scaling },
    { name: 'Longest Plank', value: '3m 15s', icon: Flame },
    { name: 'Peak Steps in a Day', value: '15,870', icon: Award },
];

type TimeRange = 'weekly' | 'monthly' | 'allTime';

export default function DashboardPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('weekly');

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

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-foreground text-center">My Progress Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Workout Consistency Card */}
        <Card className="glassmorphic-card lg:col-span-2 hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-xl">
                <TrendingUp className="mr-3 h-6 w-6 text-accent" /> Workout Consistency
              </CardTitle>
              <CardDescription>Your workouts completed over time.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {(['weekly', 'monthly', 'allTime'] as TimeRange[]).map((range) => (
                <Button
                  key={range}
                  variant={selectedTimeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeRange(range)}
                  className={cn(
                    "capitalize text-xs px-3 py-1 h-auto",
                    selectedTimeRange === range 
                      ? "bg-accent hover:bg-accent/90 text-accent-foreground" 
                      : "border-accent text-accent hover:bg-accent/10 hover:text-accent"
                  )}
                >
                  {range === 'allTime' ? 'All Time' : range}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {/* In a real app, chartData would dynamically update based on selectedTimeRange */}
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
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
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    stroke="hsl(var(--muted-foreground))" 
                    allowDecimals={false}
                    width={40}
                    dx={-5}
                  />
                  <ChartTooltip
                    cursor={{ stroke: "hsl(var(--muted-foreground) / 0.3)", strokeWidth: 1, strokeDasharray: "3 3" }}
                    content={<ChartTooltipContent indicator="dot" labelClassName="text-sm" className="glassmorphic-card !border-border/50" />}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="workouts" 
                    strokeWidth={3} 
                    stroke="hsl(var(--accent))" 
                    dot={false} 
                    activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--accent))" }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Body Measurements Card */}
        <Card className="glassmorphic-card hover:shadow-2xl transition-shadow duration-300">
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
        
        {/* Personal Records Card */}
        <Card className="glassmorphic-card hover:shadow-2xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Trophy className="mr-3 h-6 w-6 text-accent" /> Personal Records
            </CardTitle>
            <CardDescription>Your noteworthy achievements.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {personalRecordsData.map((pr, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-background/10 hover:bg-background/20 transition-colors">
                <div className="flex items-center gap-3">
                    <pr.icon className="h-5 w-5 text-accent/80 flex-shrink-0" />
                    <span className="font-medium text-sm text-card-foreground">{pr.name}:</span>
                </div>
                <span className="text-sm font-semibold text-accent">{pr.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>


        {/* Streaks & Achievements Card */}
        <Card className="glassmorphic-card hover:shadow-2xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Award className="mr-3 h-6 w-6 text-accent" /> Streaks & Badges
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
                  <li key={idx} className="flex items-center gap-3 p-2 rounded-md bg-background/5 hover:bg-background/10 transition-colors">
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
        <Card className="glassmorphic-card lg:col-span-2 hover:shadow-2xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <HeartPulse className="mr-3 h-6 w-6 text-accent" /> Daily Health Snapshot
            </CardTitle>
            <CardDescription>Your recent sleep, hydration and activity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-background/10 text-center">
                    <p className="text-sm font-medium text-card-foreground/80 mb-1">Avg. Sleep (Last Wk)</p>
                    <p className="text-2xl font-semibold text-accent">{healthSnapshotData.sleep.avgLastWeek}</p>
                </div>
                <div className="p-4 rounded-lg bg-background/10 text-center">
                    <p className="text-sm font-medium text-card-foreground/80 mb-1">Today's Water Intake</p>
                    <p className="text-2xl font-semibold text-accent">{healthSnapshotData.waterIntake.current}{healthSnapshotData.waterIntake.unit} <span className="text-base text-card-foreground/70">/ {healthSnapshotData.waterIntake.goal}{healthSnapshotData.waterIntake.unit}</span></p>
                    <Progress value={(healthSnapshotData.waterIntake.current / healthSnapshotData.waterIntake.goal) * 100} className="h-2 mt-2 bg-accent/20 [&>div]:bg-accent" />
                </div>
                 <div className="p-4 rounded-lg bg-background/10 text-center">
                    <p className="text-sm font-medium text-card-foreground/80 mb-1">Today's Steps</p>
                    <p className="text-2xl font-semibold text-accent">{healthSnapshotData.steps.current.toLocaleString()} <span className="text-base text-card-foreground/70">/ {healthSnapshotData.steps.goal.toLocaleString()}</span></p>
                     <Progress value={(healthSnapshotData.steps.current / healthSnapshotData.steps.goal) * 100} className="h-2 mt-2 bg-accent/20 [&>div]:bg-accent" />
                </div>
            </div>
            <div className="mt-2 p-4 rounded-lg bg-background/10">
                <h4 className="font-medium text-card-foreground mb-2 flex items-center"><Droplets className="mr-2 h-5 w-5 text-accent/80"/> Hydration Tip:</h4>
                <p className="text-sm text-card-foreground/80 italic">Carry a reusable water bottle with you and sip throughout the day. Aim for consistent intake rather than large amounts at once for optimal hydration.</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

    