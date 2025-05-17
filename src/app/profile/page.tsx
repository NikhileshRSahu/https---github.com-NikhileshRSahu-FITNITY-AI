
'use client'

import { useTheme } from 'next-themes'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Moon, Sun, Settings as SettingsIcon, Bell, Globe, ShieldCheck, LogOut as LogOutIcon, Zap, Edit3, Save, XCircle, User as UserIcon, CalendarClock } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter();
  const { toast } = useToast();

  // Placeholder data - in a real app, this would come from a user context or API
  const [profileData, setProfileData] = useState({
    fullName: 'Aarav Patel',
    email: 'aarav.patel@example.com',
    fitnessGoal: 'Weight Loss & Endurance',
    workoutStyle: 'Home workouts, HIIT, 3-4x week',
    fitnessLevel: 'intermediate',
    preferredLanguage: 'English',
  });

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && localStorage.getItem('fitnityUserLoggedIn') !== 'true') {
        router.replace('/auth/sign-in');
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    console.log('Saving profile data (simulated):', profileData);
    toast({
      title: 'Profile Updated (Simulated)',
      description: 'Your changes have been saved.',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fitnityUserLoggedIn');
    }
    router.push('/');
    router.refresh();
  };

  if (!mounted || (typeof window !== 'undefined' && localStorage.getItem('fitnityUserLoggedIn') !== 'true')) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-fade-in-up">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex flex-col items-center space-y-4 mb-12">
                <Skeleton className="h-24 w-24 rounded-full bg-muted/50" />
                <Skeleton className="h-8 w-1/2 bg-muted/50" />
                <Skeleton className="h-5 w-3/4 bg-muted/50" />
            </div>
            {[...Array(5)].map((_, i) => ( 
              <Card key={i} className="glassmorphic-card">
                <CardHeader>
                  <Skeleton className="h-7 w-1/3 mb-1 bg-muted/50" />
                  <Skeleton className="h-4 w-2/3 bg-muted/50" />
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-1/4 bg-muted/50" />
                    <Skeleton className="h-10 w-full bg-muted/50" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-1/4 bg-muted/50" />
                    <Skeleton className="h-10 w-full bg-muted/50" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
  }

  const isDarkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-fade-in-up">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <Avatar className="h-24 w-24 ring-4 ring-accent/50 shadow-lg hover:opacity-80 transition-opacity duration-200 active:scale-95">
                <AvatarImage src="https://placehold.co/100x100.png" alt={profileData.fullName} data-ai-hint="user portrait" />
                <AvatarFallback>{profileData.fullName.substring(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {isEditing ? (
              <Input 
                name="fullName" 
                value={profileData.fullName} 
                onChange={handleInputChange} 
                className="text-4xl font-bold text-foreground text-center bg-transparent border-0 ring-0 focus:ring-0 focus:border-0 shadow-none p-0"
              />
            ) : (
              <h1 className="text-4xl font-bold text-foreground">{profileData.fullName}</h1>
            )}
            {isEditing ? (
               <Input 
                name="email" 
                type="email" 
                value={profileData.email} 
                onChange={handleInputChange} 
                className="text-lg text-foreground/80 text-center bg-transparent border-0 ring-0 focus:ring-0 focus:border-0 shadow-none p-0"
              />
            ) : (
              <p className="text-lg text-foreground/80">{profileData.email}</p>
            )}
            
            {!isEditing ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                  <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            ) : (
              <div className="flex gap-4 mt-4">
                <Button 
                  size="sm" 
                  onClick={handleSaveChanges}
                  className="bg-green-500 hover:bg-green-600 text-white transition-transform duration-300 hover:scale-105 active:scale-95"
                >
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsEditing(false);
                    // Reset to original data if needed, for now just closes edit mode
                  }}
                  className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive-foreground transition-transform duration-300 hover:scale-105 active:scale-95"
                >
                    <XCircle className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </div>
            )}
        </div>
        
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center">
              <Zap className="mr-3 h-6 w-6 text-accent" /> My Fitness Snapshot
            </CardTitle>
            <CardDescription>Your current fitness goals and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {isEditing ? (
              <>
                <div className="space-y-1">
                  <Label htmlFor="fitnessGoal" className="text-sm font-medium">Primary Fitness Goal</Label>
                  <Textarea id="fitnessGoal" name="fitnessGoal" value={profileData.fitnessGoal} onChange={handleInputChange} rows={2} className="mt-1 bg-background/50 text-card-foreground" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="workoutStyle" className="text-sm font-medium">Preferred Workout Style</Label>
                  <Textarea id="workoutStyle" name="workoutStyle" value={profileData.workoutStyle} onChange={handleInputChange} rows={2} className="mt-1 bg-background/50 text-card-foreground" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="fitnessLevel" className="text-sm font-medium">Current Fitness Level</Label>
                  <Select name="fitnessLevel" value={profileData.fitnessLevel} onValueChange={handleSelectChange('fitnessLevel')}>
                    <SelectTrigger className="w-full bg-background/50 text-card-foreground mt-1">
                      <SelectValue placeholder="Select fitness level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="preferredLanguage" className="text-sm font-medium">Preferred Language (Coach)</Label>
                    <Select name="preferredLanguage" value={profileData.preferredLanguage} onValueChange={handleSelectChange('preferredLanguage')}>
                        <SelectTrigger className="w-full bg-background/50 text-card-foreground mt-1">
                        <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
                    <span className="font-medium text-card-foreground">Primary Fitness Goal:</span>
                    <span className="text-card-foreground/80 text-right">{profileData.fitnessGoal}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
                    <span className="font-medium text-card-foreground">Preferred Workout Style:</span>
                    <span className="text-card-foreground/80 text-right">{profileData.workoutStyle}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
                    <span className="font-medium text-card-foreground">Current Fitness Level:</span>
                    <span className="text-card-foreground/80 capitalize text-right">{profileData.fitnessLevel}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
                    <span className="font-medium text-card-foreground">Preferred Language (Coach):</span>
                    <span className="text-card-foreground/80 text-right">{profileData.preferredLanguage}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center">
              <UserIcon className="mr-3 h-6 w-6 text-accent" /> Account Settings
            </CardTitle>
            <CardDescription>Manage your personal details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
              <Label htmlFor="profileFullName" className="text-sm font-medium">Full Name</Label>
              <Input id="profileFullName" type="text" value={profileData.fullName} readOnly={!isEditing} onChange={handleInputChange} name="fullName" className={cn("mt-1", isEditing ? "bg-background/50 text-card-foreground" : "bg-background/20 text-card-foreground/70 border-transparent")} />
            </div>
            <div>
              <Label htmlFor="profileEmail" className="text-sm font-medium">Email Address</Label>
              <Input id="profileEmail" type="email" value={profileData.email} readOnly={!isEditing} onChange={handleInputChange} name="email" className={cn("mt-1", isEditing ? "bg-background/50 text-card-foreground" : "bg-background/20 text-card-foreground/70 border-transparent")} />
            </div>
             <div className="flex items-center justify-between p-3 rounded-lg bg-background/10 mt-2">
                <div className="flex items-center">
                    <CalendarClock className="mr-3 h-5 w-5 text-accent/80" />
                    <span className="font-medium text-card-foreground">Last Logged In:</span>
                </div>
                <span className="text-card-foreground/80">July 26, 2024, 10:30 AM (Simulated)</span>
            </div>
            <Button variant="outline" className="w-full sm:w-auto hover:bg-accent/10 hover:text-accent-foreground transition-transform duration-300 hover:scale-105 active:scale-95 mt-2">Change Password</Button>
          </CardContent>
        </Card>

        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center">
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
              <Label htmlFor="theme-toggle" className="text-lg font-medium text-card-foreground">
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

        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center">
              <Bell className="mr-3 h-6 w-6 text-accent" /> Notification Preferences
            </CardTitle>
            <CardDescription>Choose what updates you want to receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
              <Label htmlFor="workoutReminders" className="font-medium text-card-foreground">Workout Reminders</Label>
              <Switch id="workoutReminders" defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
              <Label htmlFor="featureUpdates" className="font-medium text-card-foreground">New Feature Updates</Label>
              <Switch id="featureUpdates" />
            </div>
             <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
              <Label htmlFor="communityAlerts" className="font-medium text-card-foreground">Community Alerts</Label>
              <Switch id="communityAlerts" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center">
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
                </SelectContent>
              </Select>
          </CardContent>
        </Card>

        <Card className="glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center">
              <ShieldCheck className="mr-3 h-6 w-6 text-accent" /> Data & Privacy
            </CardTitle>
            <CardDescription>Manage your data and review our policies.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="link" className="p-0 text-accent hover:underline h-auto transition-opacity hover:opacity-80">
              <Link href="/privacy-policy">View Privacy Policy</Link>
            </Button>
            <br />
             <Button asChild variant="link" className="p-0 text-accent hover:underline h-auto transition-opacity hover:opacity-80">
              <Link href="/terms-of-service">View Terms of Service</Link>
            </Button>
             <br />
            <Button variant="outline" className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 border-destructive hover:border-destructive/90 w-full sm:w-auto mt-2 transition-transform duration-300 hover:scale-105 active:scale-95">
              Download My Data
            </Button>
          </CardContent>
        </Card>

         <Card className="glassmorphic-card">
            <CardContent className="pt-6">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full text-lg py-6 transition-transform duration-300 hover:scale-105 active:scale-95">
                      <LogOutIcon className="mr-2 h-5 w-5" /> Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glassmorphic-card">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription>
                       Are you sure you want to logout from Fitnity AI?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
         </Card>

      </div>
    </div>
  );
}
