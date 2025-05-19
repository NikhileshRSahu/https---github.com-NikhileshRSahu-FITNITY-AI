
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
import { Moon, Sun, Bell, Globe, ShieldCheck, LogOut as LogOutIcon, Zap, Edit3, Save, XCircle, User as UserIcon, CalendarClock, Settings as SettingsIcon, Gem } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { useSubscription, type SubscriptionTier } from '@/contexts/SubscriptionContext';


export default function ProfilePage() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [uiMounted, setUiMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { subscriptionTier, setSubscriptionTier } = useSubscription();


  const [profileData, setProfileData] = useState({
    fullName: 'Aarav Patel',
    email: 'aarav.patel@example.com',
    fitnessGoal: 'Weight Loss & Endurance Improvement. Target: Run a 10k in under 50 minutes.',
    workoutStyle: 'Home workouts (HIIT, Bodyweight), 3-4 times per week, 30-45 min sessions. Occasional weekend cycling.',
    fitnessLevel: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    preferredLanguage: 'English',
  });
   const [initialProfileData, setInitialProfileData] = useState(profileData);


  useEffect(() => {
    setUiMounted(true); 
     if (typeof window !== 'undefined') {
      const loggedInStatus = localStorage.getItem('fitnityUserLoggedIn') === 'true';
      setIsLoggedIn(loggedInStatus);
      if (!loggedInStatus) {
        router.replace('/auth/sign-in');
      }
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof typeof profileData) => (value: string) => {
    setProfileData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleSaveChanges = () => {
    console.log('Saving profile data (simulated):', profileData);
    setInitialProfileData(profileData); 
    toast({
      title: 'Profile Updated (Simulated)',
      description: 'Your changes have been saved.',
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setProfileData(initialProfileData); 
    setIsEditing(false);
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fitnityUserLoggedIn');
      window.dispatchEvent(new Event('loginStateChange')); 
    }
    router.push('/');
  };

  if (!uiMounted || !isLoggedIn) { 
    return (
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-fade-in-up">
          <div className="max-w-2xl sm:max-w-3xl mx-auto space-y-6 sm:space-y-8">
            <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
                <Skeleton className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-muted/50" />
                <Skeleton className="h-8 w-1/2 bg-muted/50" />
                <Skeleton className="h-5 w-3/4 bg-muted/50" />
                 <Skeleton className="h-9 w-32 bg-muted/50 mt-2" />
            </div>
            {[...Array(3)].map((_, i) => ( 
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
      <div className="max-w-2xl sm:max-w-3xl mx-auto space-y-8 sm:space-y-10">
        <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 mb-10 sm:mb-14 animate-fade-in-up">
            <Avatar className="h-24 w-24 sm:h-28 sm:w-28 ring-4 ring-accent/50 shadow-lg hover:opacity-80 transition-opacity duration-200 active:scale-95">
                <AvatarImage src="https://placehold.co/100x100.png" alt={profileData.fullName} data-ai-hint="user portrait" />
                <AvatarFallback>{profileData.fullName.substring(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {isEditing ? (
              <Input 
                name="fullName" 
                value={profileData.fullName} 
                onChange={handleInputChange} 
                className="text-3xl sm:text-4xl font-bold text-foreground text-center bg-background/50 border-border focus:ring-accent focus:border-accent shadow-sm p-1 h-auto"
              />
            ) : (
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{profileData.fullName}</h1>
            )}
            {isEditing ? (
               <Input 
                name="email" 
                type="email" 
                value={profileData.email} 
                onChange={handleInputChange} 
                className="text-base sm:text-lg text-foreground/80 text-center bg-background/50 border-border focus:ring-accent focus:border-accent shadow-sm p-1 h-auto"
              />
            ) : (
              <p className="text-base sm:text-lg text-foreground/80">{profileData.email}</p>
            )}
            
            {!isEditing ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setInitialProfileData(profileData); 
                  setIsEditing(true);
                }}
                className="border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground transition-transform duration-300 hover:scale-105 active:scale-95 mt-2 px-4 py-2"
              >
                  <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
                <Button 
                  size="default" 
                  onClick={handleSaveChanges}
                  className="bg-green-500 hover:bg-green-600 text-white transition-transform duration-300 hover:scale-105 active:scale-95 px-5 py-2.5"
                >
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  size="default" 
                  onClick={handleCancelEdit}
                  className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive-foreground transition-transform duration-300 hover:scale-105 active:scale-95 px-5 py-2.5"
                >
                    <XCircle className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </div>
            )}
        </div>
        
        <Card className="glassmorphic-card animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center">
              <Zap className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-accent" /> My Fitness Snapshot
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-card-foreground/70">Your current fitness goals and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5 text-sm sm:text-base">
             {isEditing ? (
              <>
                <div className="space-y-1">
                  <Label htmlFor="fitnessGoal" className="text-sm sm:text-base font-medium">Primary Fitness Goal</Label>
                  <Textarea id="fitnessGoal" name="fitnessGoal" value={profileData.fitnessGoal} onChange={handleInputChange} rows={3} className="mt-1 bg-background/50 text-card-foreground" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="workoutStyle" className="text-sm sm:text-base font-medium">Preferred Workout Style & Frequency</Label>
                  <Textarea id="workoutStyle" name="workoutStyle" value={profileData.workoutStyle} onChange={handleInputChange} rows={3} className="mt-1 bg-background/50 text-card-foreground" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="fitnessLevel" className="text-sm sm:text-base font-medium">Current Fitness Level</Label>
                  <Select name="fitnessLevel" value={profileData.fitnessLevel} onValueChange={handleSelectChange('fitnessLevel')}>
                    <SelectTrigger className="w-full bg-background/50 text-card-foreground mt-1 text-sm sm:text-base">
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
                    <Label htmlFor="preferredLanguage" className="text-sm sm:text-base font-medium">Preferred Language (AI Coach)</Label>
                    <Select name="preferredLanguage" value={profileData.preferredLanguage} onValueChange={handleSelectChange('preferredLanguage')}>
                        <SelectTrigger className="w-full bg-background/50 text-card-foreground mt-1 text-sm sm:text-base">
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
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-3 rounded-lg bg-background/10 hover:bg-background/20 transition-colors">
                    <span className="font-medium text-card-foreground/90 mb-1 sm:mb-0 text-sm sm:text-base">Primary Fitness Goal:</span>
                    <span className="text-card-foreground/80 text-left sm:text-right text-sm sm:text-base">{profileData.fitnessGoal}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-3 rounded-lg bg-background/10 hover:bg-background/20 transition-colors">
                    <span className="font-medium text-card-foreground/90 mb-1 sm:mb-0 text-sm sm:text-base">Workout Style & Frequency:</span>
                    <span className="text-card-foreground/80 text-left sm:text-right text-sm sm:text-base">{profileData.workoutStyle}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/10 hover:bg-background/20 transition-colors">
                    <span className="font-medium text-card-foreground/90 text-sm sm:text-base">Current Fitness Level:</span>
                    <span className="text-card-foreground/80 capitalize text-right text-sm sm:text-base">{profileData.fitnessLevel}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/10 hover:bg-background/20 transition-colors">
                    <span className="font-medium text-card-foreground/90 text-sm sm:text-base">Preferred Language (AI Coach):</span>
                    <span className="text-card-foreground/80 text-right text-sm sm:text-base">{profileData.preferredLanguage}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="glassmorphic-card animate-fade-in-up" style={{animationDelay: '0.15s'}}>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center">
              <Gem className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-accent" /> Subscription Simulator
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-card-foreground/70">
              Current Tier: <span className="font-semibold text-accent capitalize">{subscriptionTier}</span>. (For demo purposes only)
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {(['free', 'premium', 'unlimited'] as SubscriptionTier[]).map(tier => (
              <Button
                key={tier}
                variant={subscriptionTier === tier ? "default" : "outline"}
                onClick={() => setSubscriptionTier(tier)}
                className={cn(
                  "w-full sm:flex-1 capitalize",
                  subscriptionTier === tier ? "bg-accent hover:bg-accent/90 text-accent-foreground" : "border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground"
                )}
              >
                Set to {tier}
              </Button>
            ))}
          </CardContent>
        </Card>


        <Card className="glassmorphic-card animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center">
              <SettingsIcon className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-accent" /> Account Settings
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-card-foreground/70">Manage your personal details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5 text-sm sm:text-base">
             <div>
              <Label htmlFor="profileFullName" className="text-sm sm:text-base font-medium">Full Name</Label>
              {isEditing ? (
                <Input id="profileFullName" type="text" value={profileData.fullName} onChange={handleInputChange} name="fullName" className="mt-1 bg-background/50 text-card-foreground" />
              ) : (
                <p className="mt-1 p-3 rounded-md bg-background/10 text-card-foreground/80 border border-transparent text-sm sm:text-base">{profileData.fullName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="profileEmail" className="text-sm sm:text-base font-medium">Email Address</Label>
              {isEditing ? (
                <Input id="profileEmail" type="email" value={profileData.email} onChange={handleInputChange} name="email" className="mt-1 bg-background/50 text-card-foreground" />
              ) : (
                 <p className="mt-1 p-3 rounded-md bg-background/10 text-card-foreground/80 border border-transparent text-sm sm:text-base">{profileData.email}</p>
              )}
            </div>
             <div className="flex items-center justify-between p-3 rounded-lg bg-background/10 mt-2">
                <div className="flex items-center">
                    <CalendarClock className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-accent/80" />
                    <span className="font-medium text-card-foreground text-sm sm:text-base">Last Logged In:</span>
                </div>
                <span className="text-card-foreground/80 text-xs sm:text-sm">July 29, 2024, 10:30 AM (Simulated)</span>
            </div>
            <Button variant="outline" className="w-full sm:w-auto hover:bg-accent/10 hover:text-accent-foreground transition-transform duration-300 hover:scale-105 active:scale-95 mt-2 border-accent text-accent text-sm sm:text-base px-4 py-2">Change Password</Button>
          </CardContent>
        </Card>

        <Card className="glassmorphic-card animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center">
              {isDarkMode ? 
                <Moon className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-accent" /> : 
                <Sun className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-accent" />
              }
              Appearance
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-card-foreground/70">Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-background/10 shadow-inner">
              <Label htmlFor="theme-toggle" className="text-base sm:text-lg font-medium text-card-foreground">
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

        <Card className="glassmorphic-card animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center">
              <Bell className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-accent" /> Notification Preferences
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-card-foreground/70">Choose what updates you want to receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 text-sm sm:text-base">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
              <Label htmlFor="workoutReminders" className="font-medium text-card-foreground text-sm sm:text-base">Workout Reminders</Label>
              <Switch id="workoutReminders" defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
              <Label htmlFor="featureUpdates" className="font-medium text-card-foreground text-sm sm:text-base">New Feature Updates</Label>
              <Switch id="featureUpdates" />
            </div>
             <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
              <Label htmlFor="communityAlerts" className="font-medium text-card-foreground text-sm sm:text-base">Community Alerts</Label>
              <Switch id="communityAlerts" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glassmorphic-card animate-fade-in-up" style={{animationDelay: '0.5s'}}>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center">
              <Globe className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-accent" /> Language Preference
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-card-foreground/70">Select your preferred language for the app interface.</CardDescription>
          </CardHeader>
          <CardContent>
             <Select defaultValue="English">
                <SelectTrigger className="w-full bg-background/20 border-border focus:ring-accent focus:border-accent text-card-foreground text-sm sm:text-base">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">हिंदी (Hindi)</SelectItem>
                </SelectContent>
              </Select>
          </CardContent>
        </Card>

        <Card className="glassmorphic-card animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-bold flex items-center">
              <ShieldCheck className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-accent" /> Data & Privacy
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-card-foreground/70">Manage your data and review our policies.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 text-sm sm:text-base">
            <Button asChild variant="link" className="p-0 text-accent hover:underline h-auto transition-opacity hover:opacity-80 text-sm sm:text-base">
              <Link href="/privacy-policy">View Privacy Policy</Link>
            </Button>
            <br />
             <Button asChild variant="link" className="p-0 text-accent hover:underline h-auto transition-opacity hover:opacity-80 text-sm sm:text-base">
              <Link href="/terms-of-service">View Terms of Service</Link>
            </Button>
             <br />
            <Button variant="outline" className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 border-destructive hover:border-destructive/90 w-full sm:w-auto mt-2 transition-transform duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base px-4 py-2">
              Download My Data
            </Button>
          </CardContent>
        </Card>

         <Card className="glassmorphic-card animate-fade-in-up" style={{animationDelay: '0.7s'}}>
            <CardContent className="p-4 sm:pt-6">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full text-base sm:text-lg py-3 sm:py-6 transition-transform duration-300 hover:scale-105 active:scale-95">
                      <LogOutIcon className="mr-2 h-5 w-5 sm:h-5 sm:w-5" /> Logout
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

