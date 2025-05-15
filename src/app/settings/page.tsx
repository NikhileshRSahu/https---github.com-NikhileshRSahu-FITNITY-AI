
'use client'

import { useTheme } from 'next-themes'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Moon, Sun, Settings as SettingsIcon } from 'lucide-react' // Added SettingsIcon
import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // useEffect only runs on the client, so we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // You can return a loading skeleton here if you prefer
    return (
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
          <Card className="max-w-lg mx-auto glassmorphic-card animate-pulse">
            <CardHeader>
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                <div className="flex items-center space-x-2">
                  <div className="h-5 w-5 bg-muted rounded-full"></div>
                  <div className="h-6 bg-muted rounded w-24"></div>
                </div>
                <div className="h-6 w-11 bg-muted rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
  }

  const isDarkMode = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <Card className="max-w-lg mx-auto glassmorphic-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <SettingsIcon className="mr-3 h-8 w-8 text-accent" /> Settings
          </CardTitle>
          <CardDescription>
            Manage your application preferences and appearance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-background/10 shadow-inner">
            <div className="flex items-center space-x-3">
              {isDarkMode ? 
                <Moon className="h-6 w-6 text-accent" /> : 
                <Sun className="h-6 w-6 text-accent" />
              }
              <Label htmlFor="theme-toggle" className="text-lg font-medium">
                Appearance: {isDarkMode ? "Dark Mode" : "Light Mode"}
              </Label>
            </div>
            <Switch
              id="theme-toggle"
              checked={isDarkMode}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              aria-label="Toggle dark mode"
            />
          </div>
          {/* Placeholder for future settings */}
          <div className="p-4 rounded-lg bg-background/5 text-center">
            <p className="text-sm text-muted-foreground">More settings coming soon!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
