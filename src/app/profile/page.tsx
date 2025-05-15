
'use client'

import { useTheme } from 'next-themes'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Moon, Sun, Settings as SettingsIcon, Bell, Globe, ShieldCheck, LogOut, Zap, Edit3 } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProfilePage() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Profile Header Skeleton */}
            <div className="flex flex-col items-center space-y-4 mb-12">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-5 w-3/4" />
            </div>

            {/* Settings Cards Skeleton */}
            {[...Array(4)].map((_, i) => ( // Increased to 4 to account for fitness snapshot
              <Card key={i} className="glassmorphic-card">
                <CardHeader>
                  <Skeleton className="h-7 w-1/3 mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
             <Card className="glassmorphic-card">
                <CardContent className="pt-6">
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
          </div>
        </div>
      );
  }

  const isDarkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <Avatar className="h-24 w-24 ring-4 ring-accent/50 shadow-lg">
                <AvatarImage src="https://placehold.co/100x100.png" alt="Aarav Patel" data-ai-hint="user portrait" />
                <AvatarFallback>AP</AvatarFallback>
            </Avatar>
            <h1 className="text-4xl font-bold text-foreground">Aarav Patel</h1>
            <p className="text-lg text-foreground/80">aarav.patel@example.com</p>
            <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground">
                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
        </div>
        
        {/* Fitness Snapshot Card */}
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Zap className="mr-3 h-6 w-6 text-accent" /> My Fitness Snapshot
            </CardTitle>
            <CardDescription>Your current fitness goals and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
                <span className="font-medium text-card-foreground">Primary Fitness Goal:</span>
                <span className="text-card-foreground/80">Build upper body strength</span>
            </div>
             <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
                <span className="font-medium text-card-foreground">Workout Style:</span>
                <span className="text-card-foreground/80">Home workouts, 3x week</span>
            </div>
             <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
                <span className="font-medium text-card-foreground">Current Level:</span>
                <span className="text-card-foreground/80">Intermediate</span>
            </div>
          </CardContent>
        </Card>

        {/* Account Information Card */}
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <SettingsIcon className="mr-3 h-6 w-6 text-accent" /> Account Settings
            </CardTitle>
            <CardDescription>Manage your personal details and security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
              <Input id="fullName" type="text" defaultValue="Aarav Patel" readOnly className="mt-1 bg-background/50 text-card-foreground" />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input id="email" type="email" defaultValue="aarav.patel@example.com" readOnly className="mt-1 bg-background/50 text-card-foreground" />
            </div>
            <Button variant="outline" className="w-full sm:w-auto hover:bg-accent/10 hover:text-accent-foreground">Change Password</Button>
          </CardContent>
        </Card>

        {/* Appearance Card */}
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              {isDarkMode ? 
                <Moon className="mr-3 h-6 w-6 text-accent" /> : 
                <Sun className="mr-3 h-6 w-6 text-accent" />
              }
              Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-background/10 shadow-inner">
              <Label htmlFor="theme-toggle" className="text-lg font-medium">
                Mode: {isDarkMode ? "Dark" : "Light"}
              </Label>
              <Switch
                id="theme-toggle"
                checked={isDarkMode}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                aria-label="Toggle theme mode"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences Card */}
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Bell className="mr-3 h-6 w-6 text-accent" /> Notification Preferences
            </CardTitle>
            <CardDescription>Choose what updates you want to receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
              <Label htmlFor="workoutReminders" className="font-medium">Workout Reminders</Label>
              <Switch id="workoutReminders" defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
              <Label htmlFor="featureUpdates" className="font-medium">New Feature Updates</Label>
              <Switch id="featureUpdates" />
            </div>
             <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
              <Label htmlFor="communityAlerts" className="font-medium">Community Alerts</Label>
              <Switch id="communityAlerts" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        {/* Language Preference Card */}
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Globe className="mr-3 h-6 w-6 text-accent" /> Language Preference
            </CardTitle>
            <CardDescription>Select your preferred language for the app interface.</CardDescription>
          </CardHeader>
          <CardContent>
             <Select defaultValue="English">
                <SelectTrigger className="w-full bg-background/20 border-border focus:ring-accent focus:border-accent text-card-foreground">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">हिंदी (Hindi)</SelectItem>
                  {/* Add more languages as needed */}
                </SelectContent>
              </Select>
          </CardContent>
        </Card>

        {/* Data & Privacy Card */}
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <ShieldCheck className="mr-3 h-6 w-6 text-accent" /> Data & Privacy
            </CardTitle>
            <CardDescription>Manage your data and review our policies.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="link" className="p-0 text-accent hover:underline h-auto">
              <Link href="/privacy-policy">View Privacy Policy</Link>
            </Button>
            <br />
             <Button asChild variant="link" className="p-0 text-accent hover:underline h-auto">
              <Link href="/terms-of-service">View Terms of Service</Link>
            </Button>
             <br />
            <Button variant="outline" className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 border-destructive hover:border-destructive/90 w-full sm:w-auto mt-2">
              Download My Data
            </Button>
          </CardContent>
        </Card>

        {/* Logout Button */}
         <Card className="glassmorphic-card">
            <CardContent className="pt-6">
                 <Button variant="destructive" className="w-full text-lg py-6">
                    <LogOut className="mr-2 h-5 w-5" /> Logout
                </Button>
            </CardContent>
         </Card>

      </div>
    </div>
  );
}

    