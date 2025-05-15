
'use client'

import { useTheme } from 'next-themes'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Moon, Sun, Settings as SettingsIcon, UserCircle, Bell, Globe, ShieldCheck, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="max-w-3xl mx-auto space-y-8">
            <Card className="glassmorphic-card animate-pulse">
              <CardHeader>
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-10 bg-muted/50 rounded w-full"></div>
                <div className="h-10 bg-muted/50 rounded w-full"></div>
              </CardContent>
            </Card>
             <Card className="glassmorphic-card animate-pulse">
              <CardHeader>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="h-10 bg-muted/50 rounded w-full"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
  }

  const isDarkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center mb-12">
            <SettingsIcon className="mx-auto h-16 w-16 text-accent mb-4" />
            <h1 className="text-4xl font-bold text-foreground">Settings</h1>
            <p className="text-foreground/80 mt-2">Manage your Fitnity AI account and preferences.</p>
        </div>

        {/* Account Information Card */}
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <UserCircle className="mr-3 h-6 w-6 text-accent" /> Account Information
            </CardTitle>
            <CardDescription>View and manage your personal details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
              <Input id="fullName" type="text" value="Aarav Patel" readOnly className="mt-1 bg-background/50" />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input id="email" type="email" value="aarav.patel@example.com" readOnly className="mt-1 bg-background/50" />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">Change Password</Button>
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
                <SelectTrigger className="w-full bg-background/20 border-border focus:ring-accent focus:border-accent">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">हिंदी (Hindi)</SelectItem>
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
          <CardContent>
            <Button asChild variant="link" className="p-0 text-accent hover:underline">
              <Link href="/privacy-policy">View Privacy Policy</Link>
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
