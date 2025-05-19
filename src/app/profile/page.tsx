
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Moon, Sun, Bell, Globe, ShieldCheck, LogOut as LogOutIcon, Zap, Edit3, Save, XCircle, User as UserIcon, CalendarClock, Settings as SettingsIcon, Gem, Loader2, KeyRound, Trash2, AlertTriangle } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { useSubscription, type SubscriptionTier } from '@/contexts/SubscriptionContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';


// Profile Data Structure (for localStorage simulation)
interface ProfileData {
  fullName: string;
  email: string;
  fitnessGoal: string;
  workoutStyle: string;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredLanguage: 'English' | 'Hindi'; // For AI Coach
}

// Settings Data Structure (for localStorage simulation)
interface UserSettings {
  workoutReminders: boolean;
  featureUpdates: boolean;
  communityAlerts: boolean;
  appLanguage: 'English' | 'Hindi'; // For App UI
}

// Zod schema for "Change Password" dialog
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z.string().min(8, { message: "New password must be at least 8 characters." }),
  confirmNewPassword: z.string(),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match.",
  path: ["confirmNewPassword"],
});
type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;


export default function ProfilePage() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [uiMounted, setUiMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { subscriptionTier, setSubscriptionTier, mounted: subscriptionMounted } = useSubscription();

  // Profile Data State
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: 'Aarav Patel',
    email: 'aarav.patel@example.com',
    fitnessGoal: 'Weight Loss & Endurance Improvement. Target: Run a 10k in under 50 minutes.',
    workoutStyle: 'Home workouts (HIIT, Bodyweight), 3-4 times per week, 30-45 min sessions. Occasional weekend cycling.',
    fitnessLevel: 'intermediate',
    preferredLanguage: 'English',
  });
  const [initialProfileData, setInitialProfileData] = useState<ProfileData>(profileData);

  // Settings State
  const [userSettings, setUserSettings] = useState<UserSettings>({
    workoutReminders: true,
    featureUpdates: false,
    communityAlerts: true,
    appLanguage: 'English',
  });

  const changePasswordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Added isLoggingOut state


  const checkLoginStatus = useCallback(() => {
    if (typeof window !== 'undefined') {
      const loggedInStatus = localStorage.getItem('fitnityUserLoggedIn') === 'true';
      setIsLoggedIn(loggedInStatus);
      if (!loggedInStatus && uiMounted) { 
        router.replace('/auth/sign-in');
      }
    }
  }, [router, uiMounted]);

  useEffect(() => {
    setUiMounted(true); 
  }, []);

  useEffect(() => {
    if (uiMounted) { 
      checkLoginStatus();

      const storedProfileData = localStorage.getItem('fitnityUserProfile');
      if (storedProfileData) {
        try {
          const parsedProfile = JSON.parse(storedProfileData);
          setProfileData(parsedProfile);
          setInitialProfileData(parsedProfile);
        } catch (e) { console.error("Failed to parse profile data from localStorage", e); }
      }

      const storedUserSettings = localStorage.getItem('fitnityUserSettings');
      if (storedUserSettings) {
        try {
          setUserSettings(JSON.parse(storedUserSettings));
        } catch (e) { console.error("Failed to parse user settings from localStorage", e); }
      }
    }
  }, [uiMounted, checkLoginStatus]);


  useEffect(() => {
    if (!uiMounted) return; 

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'fitnityUserLoggedIn') checkLoginStatus();
      if (event.key === 'fitnityUserProfile') {
        const storedProfileData = localStorage.getItem('fitnityUserProfile');
        if (storedProfileData) setProfileData(JSON.parse(storedProfileData));
      }
       if (event.key === 'fitnityUserSettings') {
        const storedSettings = localStorage.getItem('fitnityUserSettings');
        if (storedSettings) setUserSettings(JSON.parse(storedSettings));
      }
    };
    const handleLoginStateChange = () => checkLoginStatus();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('loginStateChange', handleLoginStateChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginStateChange', handleLoginStateChange);
    };
  }, [uiMounted, checkLoginStatus]);


  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSelectChange = (name: keyof ProfileData) => (value: string) => {
    setProfileData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleSettingsSwitchChange = (name: keyof UserSettings) => (checked: boolean) => {
    setUserSettings(prev => {
      const newSettings = { ...prev, [name]: checked };
      if (typeof window !== 'undefined' && uiMounted) {
        localStorage.setItem('fitnityUserSettings', JSON.stringify(newSettings));
      }
      toast({ title: "Preference Updated!", description: `${name.replace(/([A-Z])/g, ' $1').trim()} preference saved.`})
      return newSettings;
    });
  };
  
  const handleAppLanguageChange = (value: string) => {
     setUserSettings(prev => {
      const newSettings = { ...prev, appLanguage: value as 'English' | 'Hindi' };
      if (typeof window !== 'undefined' && uiMounted) {
        localStorage.setItem('fitnityUserSettings', JSON.stringify(newSettings));
      }
      toast({ title: "App Language Updated", description: `Interface language preference set to ${value}. (UI change not implemented)` });
      return newSettings;
    });
  };


  const handleSaveChanges = () => {
    if (typeof window !== 'undefined' && uiMounted) {
      localStorage.setItem('fitnityUserProfile', JSON.stringify(profileData));
    }
    setInitialProfileData(profileData); 
    toast({
      title: 'Profile Updated!',
      description: 'Your changes have been saved.',
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setProfileData(initialProfileData); 
    setIsEditing(false);
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise(resolve => setTimeout(resolve, 700)); 
    if (typeof window !== 'undefined' && uiMounted) {
      localStorage.removeItem('fitnityUserLoggedIn');
      window.dispatchEvent(new Event('loginStateChange')); 
    }
    toast({title: "Logged Out", description: "You have been successfully logged out."});
    setIsLoggingOut(false);
    router.push('/'); 
  };
  
  const onSubmitChangePassword = async (data: ChangePasswordFormValues) => {
    setIsPasswordSubmitting(true);
    console.log("Change Password Submitted (simulated):", data);
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    toast({
      title: "Password Change Simulated",
      description: "In a real app, your password would be updated.",
    });
    changePasswordForm.reset();
    setIsPasswordSubmitting(false);
    document.getElementById('closeChangePasswordDialog')?.click(); 
  };

  const handleDeleteAccount = async () => {
    setIsPasswordSubmitting(true); 
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    toast({
      title: "Account Deletion Simulated",
      description: "You have been logged out. Your account would be permanently deleted in a real app.",
      variant: "destructive",
      duration: 7000,
    });
    if (typeof window !== 'undefined' && uiMounted) {
      localStorage.removeItem('fitnityUserLoggedIn');
      localStorage.removeItem('fitnityUserProfile');
      localStorage.removeItem('fitnityUserSettings');
      window.dispatchEvent(new Event('loginStateChange')); 
    }
    setIsPasswordSubmitting(false);
    router.push('/'); 
  }

  if (!uiMounted || !isLoggedIn || !subscriptionMounted) { 
    return (
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-fade-in-up">
          <div className="max-w-2xl sm:max-w-3xl mx-auto space-y-6 sm:space-y-8">
            <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
                <Skeleton className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-muted/50" />
                <Skeleton className="h-8 w-1/2 bg-muted/50" />
                <Skeleton className="h-5 w-3/4 bg-muted/50" />
                 <Skeleton className="h-9 w-32 bg-muted/50 mt-2" />
            </div>
            <Card className="glassmorphic-card"><CardHeader><Skeleton className="h-7 w-1/3 mb-1 bg-muted/50" /><Skeleton className="h-4 w-2/3 bg-muted/50" /></CardHeader><CardContent className="space-y-4 pt-6"><Skeleton className="h-10 w-full bg-muted/50" /><Skeleton className="h-10 w-full bg-muted/50" /></CardContent></Card>
            <Card className="glassmorphic-card"><CardHeader><Skeleton className="h-7 w-1/3 mb-1 bg-muted/50" /><Skeleton className="h-4 w-2/3 bg-muted/50" /></CardHeader><CardContent className="space-y-4 pt-6"><Skeleton className="h-10 w-full bg-muted/50" /><Skeleton className="h-10 w-full bg-muted/50" /></CardContent></Card>
          </div>
        </div>
      );
  }

  const isDarkMode = resolvedTheme === 'dark';

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-2xl sm:max-w-3xl mx-auto space-y-8 sm:space-y-10">
        <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 mb-10 sm:mb-14 animate-fade-in-up">
            <Avatar className="h-24 w-24 sm:h-28 sm:w-28 ring-4 ring-primary dark:ring-accent/50 shadow-lg hover:opacity-80 transition-opacity duration-200 active:scale-95">
                <AvatarImage src="https://placehold.co/100x100.png" alt={profileData.fullName} data-ai-hint="user portrait" />
                <AvatarFallback>{profileData.fullName.substring(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {isEditing ? (
              <Input 
                name="fullName" 
                value={profileData.fullName} 
                onChange={handleProfileInputChange} 
                className={cn("text-3xl sm:text-4xl font-bold text-foreground text-center bg-background/50 dark:bg-background/50 border-border focus:ring-primary dark:focus:ring-accent focus:border-primary dark:focus:border-accent shadow-sm p-1 h-auto")}
              />
            ) : (
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{profileData.fullName}</h1>
            )}
            {isEditing ? (
               <Input 
                name="email" 
                type="email" 
                value={profileData.email} 
                onChange={handleProfileInputChange} 
                className={cn("text-base sm:text-lg text-foreground/80 text-center bg-background/50 dark:bg-background/50 border-border focus:ring-primary dark:focus:ring-accent focus:border-primary dark:focus:border-accent shadow-sm p-1 h-auto")}
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
                className="border-primary dark:border-accent text-primary dark:text-accent hover:bg-primary/10 dark:hover:bg-accent/10 hover:text-primary-foreground dark:hover:text-accent-foreground transition-transform duration-300 hover:scale-105 active:scale-95 mt-2 px-4 py-2 text-sm sm:text-base"
              >
                  <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
                <Button 
                  size="default" 
                  onClick={handleSaveChanges}
                  className="bg-green-500 hover:bg-green-600 text-white transition-transform duration-300 hover:scale-105 active:scale-95 px-5 py-2.5 text-sm sm:text-base"
                >
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  size="default" 
                  onClick={handleCancelEdit}
                  className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive-foreground transition-transform duration-300 hover:scale-105 active:scale-95 px-5 py-2.5 text-sm sm:text-base"
                >
                    <XCircle className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </div>
            )}
        </div>
        
        <Card className="glassmorphic-card animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center">
              <Zap className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-primary dark:text-accent" /> My Fitness Snapshot
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-card-foreground/70">Your current fitness goals and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5 text-sm sm:text-base">
             {isEditing ? (
              <>
                <div className="space-y-1">
                  <Label htmlFor="fitnessGoal" className="text-sm sm:text-base font-medium">Primary Fitness Goal</Label>
                  <Textarea id="fitnessGoal" name="fitnessGoal" value={profileData.fitnessGoal} onChange={handleProfileInputChange} rows={3} className={cn("mt-1 text-card-foreground", isEditing && "bg-background/50 dark:bg-background/50")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="workoutStyle" className="text-sm sm:text-base font-medium">Preferred Workout Style & Frequency</Label>
                  <Textarea id="workoutStyle" name="workoutStyle" value={profileData.workoutStyle} onChange={handleProfileInputChange} rows={3} className={cn("mt-1 text-card-foreground", isEditing && "bg-background/50 dark:bg-background/50")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="fitnessLevel" className="text-sm sm:text-base font-medium">Current Fitness Level</Label>
                  <Select name="fitnessLevel" value={profileData.fitnessLevel} onValueChange={handleProfileSelectChange('fitnessLevel')}>
                    <SelectTrigger className={cn("w-full text-card-foreground mt-1 text-sm sm:text-base", isEditing && "bg-background/50 dark:bg-background/50")}>
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
                    <Select name="preferredLanguage" value={profileData.preferredLanguage} onValueChange={handleProfileSelectChange('preferredLanguage')}>
                        <SelectTrigger className={cn("w-full text-card-foreground mt-1 text-sm sm:text-base", isEditing && "bg-background/50 dark:bg-background/50")}>
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
            <CardTitle className="text-xl font-bold flex items-center">
              <Gem className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-primary dark:text-accent" /> Subscription Simulator
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-card-foreground/70">
              Current Tier: <span className="font-semibold text-primary dark:text-accent capitalize">{subscriptionTier}</span>. (For demo purposes only)
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {(['free', 'premium', 'unlimited'] as SubscriptionTier[]).map(tier => (
              <Button
                key={tier}
                variant={subscriptionTier === tier ? "default" : "ghost"}
                onClick={() => setSubscriptionTier(tier)}
                className={cn(
                  "w-full sm:flex-1 capitalize text-sm sm:text-base",
                  subscriptionTier === tier 
                    ? "bg-primary dark:bg-accent hover:bg-primary/90 dark:hover:bg-accent/90 text-primary-foreground dark:text-accent-foreground" 
                    : "border border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground dark:text-accent dark:border-accent light:text-primary light:border-primary light:hover:bg-primary/10 light:hover:text-primary-foreground"
                )}
              >
                Set to {tier}
              </Button>
            ))}
          </CardContent>
        </Card>


        <Card className="glassmorphic-card animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center">
              <SettingsIcon className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-primary dark:text-accent" /> Account Settings
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-card-foreground/70">Manage your personal details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5 text-sm sm:text-base">
             <div>
              <Label htmlFor="profileFullNameView" className="text-sm sm:text-base font-medium text-card-foreground">Full Name</Label>
              {isEditing ? (
                <Input id="profileFullNameEdit" type="text" value={profileData.fullName} onChange={handleProfileInputChange} name="fullName" className={cn("mt-1 text-card-foreground", isEditing && "bg-background/50 dark:bg-background/50")} />
              ) : (
                <p id="profileFullNameView" className="mt-1 p-3 rounded-md bg-background/20 text-card-foreground/80 border border-transparent text-sm sm:text-base">{profileData.fullName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="profileEmailView" className="text-sm sm:text-base font-medium text-card-foreground">Email Address</Label>
              {isEditing ? (
                <Input id="profileEmailEdit" type="email" value={profileData.email} onChange={handleProfileInputChange} name="email" className={cn("mt-1 text-card-foreground", isEditing && "bg-background/50 dark:bg-background/50")} />
              ) : (
                 <p id="profileEmailView" className="mt-1 p-3 rounded-md bg-background/20 text-card-foreground/80 border border-transparent text-sm sm:text-base">{profileData.email}</p>
              )}
            </div>
             <div className="flex items-center justify-between p-3 rounded-lg bg-background/10 mt-2">
                <div className="flex items-center">
                    <CalendarClock className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-primary dark:text-accent/80" />
                    <span className="font-medium text-card-foreground text-sm sm:text-base">Last Logged In:</span>
                </div>
                <span className="text-card-foreground/80 text-xs sm:text-sm">July 29, 2024, 10:30 AM (Simulated)</span>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto hover:bg-primary/10 dark:hover:bg-accent/10 hover:text-primary-foreground dark:hover:text-accent-foreground transition-transform duration-300 hover:scale-105 active:scale-95 mt-2 border-primary dark:border-accent text-primary dark:text-accent text-sm sm:text-base px-4 py-2">
                  <KeyRound className="mr-2 h-4 w-4"/> Change Password
                </Button>
              </DialogTrigger>
              <DialogContent className="glassmorphic-card sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center"><KeyRound className="mr-2 h-5 w-5 text-primary dark:text-accent"/>Change Password</DialogTitle>
                  <DialogDescription className="text-card-foreground/70">
                    Enter your current password and new password below.
                  </DialogDescription>
                </DialogHeader>
                <Form {...changePasswordForm}>
                  <form onSubmit={changePasswordForm.handleSubmit(onSubmitChangePassword)} className="space-y-4 py-4">
                    <FormField control={changePasswordForm.control} name="currentPassword" render={({ field }) => (
                      <FormItem><FormLabel>Current Password</FormLabel><FormControl><Input type="password" {...field} className="bg-background/50" /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={changePasswordForm.control} name="newPassword" render={({ field }) => (
                      <FormItem><FormLabel>New Password</FormLabel><FormControl><Input type="password" {...field} className="bg-background/50" /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={changePasswordForm.control} name="confirmNewPassword" render={({ field }) => (
                      <FormItem><FormLabel>Confirm New Password</FormLabel><FormControl><Input type="password" {...field} className="bg-background/50" /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <DialogFooter className="pt-4">
                      <DialogClose asChild><Button type="button" variant="outline" id="closeChangePasswordDialog">Cancel</Button></DialogClose>
                      <Button type="submit" disabled={isPasswordSubmitting}
                        className="light:bg-primary light:text-primary-foreground dark:bg-accent dark:text-accent-foreground active:scale-95"
                      >
                        {isPasswordSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update Password"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="glassmorphic-card animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center">
              {isDarkMode ? 
                <Moon className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-primary dark:text-accent" /> : 
                <Sun className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-primary dark:text-accent" />
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
            <CardTitle className="text-xl font-bold flex items-center">
              <Bell className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-primary dark:text-accent" /> Notification Preferences
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-card-foreground/70">Choose what updates you want to receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 text-sm sm:text-base">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
              <Label htmlFor="workoutReminders" className="font-medium text-card-foreground text-sm sm:text-base">Workout Reminders</Label>
              <Switch id="workoutReminders" checked={userSettings.workoutReminders} onCheckedChange={handleSettingsSwitchChange('workoutReminders')} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
              <Label htmlFor="featureUpdates" className="font-medium text-card-foreground text-sm sm:text-base">New Feature Updates</Label>
              <Switch id="featureUpdates" checked={userSettings.featureUpdates} onCheckedChange={handleSettingsSwitchChange('featureUpdates')} />
            </div>
             <div className="flex items-center justify-between p-3 rounded-lg bg-background/10">
              <Label htmlFor="communityAlerts" className="font-medium text-card-foreground text-sm sm:text-base">Community Alerts</Label>
              <Switch id="communityAlerts" checked={userSettings.communityAlerts} onCheckedChange={handleSettingsSwitchChange('communityAlerts')} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glassmorphic-card animate-fade-in-up" style={{animationDelay: '0.5s'}}>
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center">
              <Globe className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-primary dark:text-accent" /> App Language Preference
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-card-foreground/70">Select your preferred language for the app interface.</CardDescription>
          </CardHeader>
          <CardContent>
             <Select value={userSettings.appLanguage} onValueChange={handleAppLanguageChange}>
                <SelectTrigger className="w-full bg-background/20 border-border focus:ring-primary dark:focus:ring-accent focus:border-primary dark:focus:border-accent text-card-foreground text-sm sm:text-base">
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
            <CardTitle className="text-xl font-bold flex items-center">
              <ShieldCheck className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-primary dark:text-accent" /> Data & Privacy
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-card-foreground/70">Manage your data and review our policies.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 text-sm sm:text-base">
            <Button asChild variant="link" className="p-0 text-primary dark:text-accent hover:underline h-auto transition-opacity hover:opacity-80 text-sm sm:text-base">
              <Link href="/privacy-policy">View Privacy Policy</Link>
            </Button>
            <br />
             <Button asChild variant="link" className="p-0 text-primary dark:text-accent hover:underline h-auto transition-opacity hover:opacity-80 text-sm sm:text-base">
              <Link href="/terms-of-service">View Terms of Service</Link>
            </Button>
             <br />
            <Button variant="outline" className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 border-destructive hover:border-destructive/90 w-full sm:w-auto mt-2 transition-transform duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base px-4 py-2">
              Download My Data (Simulated)
            </Button>
          </CardContent>
        </Card>

         <Card className="glassmorphic-card animate-fade-in-up" style={{animationDelay: '0.7s'}}>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center text-destructive">
                <Trash2 className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6"/> Delete Account
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-destructive/80">Permanently remove your Fitnity AI account and all associated data.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:pt-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full text-base sm:text-lg py-3 sm:py-2.5 transition-transform duration-300 hover:scale-105 active:scale-95">
                      <Trash2 className="mr-2 h-5 w-5 sm:h-5 sm:w-5" /> Delete My Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glassmorphic-card">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center text-destructive"><AlertTriangle className="mr-2 h-5 w-5"/>Confirm Account Deletion</AlertDialogTitle>
                    <AlertDialogDescription className="text-card-foreground/80">
                       Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone. All your data, including workout history, preferences, and any saved plans, will be irretrievably lost. This is a simulated action.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} disabled={isPasswordSubmitting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                      {isPasswordSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Yes, Delete My Account"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
         </Card>

         <Card className="glassmorphic-card animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            <CardContent className="p-4 sm:pt-6">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full text-base sm:text-lg py-3 sm:py-2.5 transition-transform duration-300 hover:scale-105 active:scale-95 border-foreground/50 hover:bg-foreground/10 text-foreground/80">
                      <LogOutIcon className="mr-2 h-5 w-5 sm:h-5 sm:w-5" /> Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glassmorphic-card">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center"><LogOutIcon className="mr-2 h-5 w-5 text-primary dark:text-accent"/>Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription className="text-card-foreground/80">
                       Are you sure you want to logout from Fitnity AI?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout} disabled={isLoggingOut} className="bg-primary dark:bg-accent hover:bg-primary/90 dark:hover:bg-accent/90 text-primary-foreground dark:text-accent-foreground active:scale-95">
                      {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Logout"}
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


    