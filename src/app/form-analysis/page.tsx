
'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { provideFormAnalysis, type ProvideFormAnalysisInput, type ProvideFormAnalysisOutput } from '@/ai/flows/provide-form-analysis-flow';
import { Loader2, Camera, AlertTriangle, FileText, Info, ShieldAlert, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useRouter } from 'next/navigation';


const formAnalysisSchema = z.object({
  exerciseName: z.string().min(3, { message: 'Exercise name must be at least 3 characters.' }),
  focusArea: z.enum([
      'overall',
      'back_posture',
      'knee_alignment',
      'elbow_position',
      'core_engagement',
      'foot_placement',
    ]).optional(),
  notes: z.string().max(300, {message: "Notes cannot exceed 300 characters."}).optional(),
});

type FormAnalysisValues = z.infer<typeof formAnalysisSchema>;
type AnalysisStatus = 'idle' | 'capturing' | 'analyzing' | 'done' | 'error';

export default function FormAnalysisPage() {
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [analysisResult, setAnalysisResult] = useState<ProvideFormAnalysisOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedFrameDataUri, setCapturedFrameDataUri] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const { isFeatureAccessible, mounted: subscriptionMounted } = useSubscription();
  const [pageMounted, setPageMounted] = useState(false);
  const router = useRouter();

  const form = useForm<FormAnalysisValues>({
    resolver: zodResolver(formAnalysisSchema),
    defaultValues: {
      exerciseName: '',
      notes: '',
    },
  });
  
  useEffect(() => {
    setPageMounted(true);
  }, []);

  useEffect(() => {
    if (!pageMounted || !subscriptionMounted ) { // Removed !isFeatureAccessible here; will handle with button click
      return; 
    }

    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access. Please try a different browser or device.',
        });
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Fitnity AI needs access to your camera for form analysis. Please enable camera permissions in your browser settings and refresh the page.',
          duration: 7000,
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast, pageMounted, subscriptionMounted]);

  async function onSubmit(data: FormAnalysisValues) {
    if (!isFeatureAccessible('formAnalysis')) {
      toast({
        title: 'Premium Feature',
        description: 'Please upgrade your plan to use Form Analysis.',
        variant: 'destructive',
        action: <Button asChild variant="outline" size="sm"><Link href="/#pricing">View Plans</Link></Button>
      });
      return;
    }
    
    if (!hasCameraPermission || !videoRef.current || !videoRef.current.srcObject) {
      toast({
        variant: 'destructive',
        title: 'Camera Not Ready',
        description: 'Camera is not accessible. Please ensure permissions are granted and the camera is working.',
      });
      setError('Camera is not accessible.');
      setAnalysisStatus('error');
      return;
    }
    
    if (videoRef.current.readyState < videoRef.current.HAVE_ENOUGH_DATA) {
        toast({ variant: 'destructive', title: 'Video Stream Not Ready', description: 'Please wait a moment for the video to load and try again.' });
        setError('Video stream not fully loaded.');
        setAnalysisStatus('error');
        return;
    }

    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
        toast({ variant: 'destructive', title: 'Video Error', description: 'Could not get video dimensions. Camera might be initializing or there is an issue with the video stream.' });
        setError('Could not get video dimensions.');
        setAnalysisStatus('error');
        return;
    }

    setAnalysisStatus('capturing');
    setAnalysisResult(null);
    setError(null);
    setCapturedFrameDataUri(null); 

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      toast({ variant: 'destructive', title: 'Processing Error', description: 'Could not create canvas context for frame capture.' });
      setError('Canvas context error.');
      setAnalysisStatus('error');
      return;
    }

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const frameDataUri = canvas.toDataURL('image/jpeg'); 
    setCapturedFrameDataUri(frameDataUri);
    setAnalysisStatus('analyzing');

    try {
      const input: ProvideFormAnalysisInput = {
        videoDataUri: frameDataUri,
        exerciseName: data.exerciseName,
        focusArea: data.focusArea,
        notes: data.notes,
      };
      const result = await provideFormAnalysis(input);
      if (result && result.feedback) {
        setAnalysisResult(result);
        setAnalysisStatus('done');
        toast({ title: 'Analysis Complete!', description: 'Your form analysis is ready.' });
      } else {
        const noFeedbackError = 'The AI could not provide feedback for this exercise. Please try again or rephrase your input.';
        setError(noFeedbackError);
        setAnalysisResult(null); 
        setAnalysisStatus('error');
        toast({ variant: 'destructive', title: 'Analysis Incomplete', description: noFeedbackError });
      }
    } catch (err) {
      console.error('Error analyzing form:', err);
      let errorMessage = (err instanceof Error && err.message) ? `Error: ${err.message}` : 'Failed to analyze form due to an unexpected issue. Please try again.';
      setError(errorMessage);
      setAnalysisResult(null);
      setAnalysisStatus('error');
      toast({ variant: 'destructive', title: 'Analysis Error', description: errorMessage });
    }
  }
  
  const getButtonText = () => {
    if (analysisStatus === 'capturing') return 'Capturing frame...';
    if (analysisStatus === 'analyzing') return 'Analyzing form...';
    return 'Analyze My Form';
  };

  const focusAreaOptions = [
    { value: 'overall', label: 'Overall Form' },
    { value: 'back_posture', label: 'Back Posture' },
    { value: 'knee_alignment', label: 'Knee Alignment' },
    { value: 'elbow_position', label: 'Elbow Position' },
    { value: 'core_engagement', label: 'Core Engagement' },
    { value: 'foot_placement', label: 'Foot Placement' },
  ];

  if (!pageMounted || !subscriptionMounted) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 text-accent animate-spin" />
      </div>
    );
  }

  if (!isFeatureAccessible('formAnalysis')) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col items-center justify-center text-center min-h-[calc(100vh-10rem)] animate-fade-in-up">
        <Card className="w-full max-w-md glassmorphic-card p-8">
          <Sparkles className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
          <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Unlock Real-Time Form Analysis</CardTitle>
          <CardDescription className="text-foreground/80 mb-8 text-base sm:text-lg">
            This premium feature provides instant feedback on your exercise form using your webcam.
          </CardDescription>
          <Button 
            asChild 
            size="lg" 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground cta-glow-pulse text-lg active:scale-95"
            onClick={() => router.push('/#pricing')}
          >
            View Pricing Plans
          </Button>
        </Card>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 animate-fade-in-up">
      <Card className="max-w-2xl mx-auto glassmorphic-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <Camera className="mr-3 h-8 w-8 text-accent" /> Real-time Form Analysis
          </CardTitle>
          <CardDescription className="text-base sm:text-lg">
            Let our AI check your exercise form. Ensure good lighting and that your full body is visible for best results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="aspect-video bg-background/20 rounded-md overflow-hidden border-2 border-accent/30 shadow-inner">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
          </div>
          
          {capturedFrameDataUri && (analysisStatus === 'analyzing' || analysisStatus === 'done' || analysisStatus === 'error') && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-card-foreground/80 text-center">Frame captured for analysis:</p>
              <div className="aspect-video relative bg-background/10 rounded-md overflow-hidden border border-border/30">
                <Image src={capturedFrameDataUri} alt="Captured exercise frame" fill objectFit="contain" />
              </div>
            </div>
          )}

          {hasCameraPermission === false && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Camera Access Denied or Unavailable</AlertTitle>
              <AlertDescription>
                Fitnity AI needs access to your camera for form analysis. Please enable camera permissions in your browser settings and refresh the page. If the issue persists, your browser might not support camera access or a camera might not be available.
              </AlertDescription>
            </Alert>
          )}
          
          {hasCameraPermission === null && (
             <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertTitle>Initializing Camera...</AlertTitle>
              <AlertDescription>
                Please wait while we access your camera. You may need to grant permission in your browser. If this message persists, ensure your camera is connected and not in use by another application, then try refreshing the page.
              </AlertDescription>
            </Alert>
          )}

          {hasCameraPermission && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="exerciseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Exercise Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Squat, Push-up, Lunge"
                          {...field}
                          disabled={analysisStatus === 'capturing' || analysisStatus === 'analyzing'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="focusArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Focus Area (Optional)</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={analysisStatus === 'capturing' || analysisStatus === 'analyzing'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an area to focus on" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {focusAreaOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Help the AI prioritize a specific part of your form.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Your Notes/Concerns (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'Feeling a pinch in my left shoulder', 'Is my squat depth okay?', 'Trying to keep my back straight.'"
                          {...field}
                          rows={3}
                          disabled={analysisStatus === 'capturing' || analysisStatus === 'analyzing'}
                        />
                      </FormControl>
                      <FormDescription>Share any specific issues, questions, or things you are working on (max 300 characters).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={analysisStatus === 'capturing' || analysisStatus === 'analyzing' || !hasCameraPermission || hasCameraPermission === null} 
                  size="lg" 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg transition-transform duration-300 hover:scale-105 cta-glow-pulse active:scale-95"
                >
                  {(analysisStatus === 'capturing' || analysisStatus === 'analyzing') && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {getButtonText()}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter>
            <Alert variant="default" className="border-accent/30 bg-accent/5 text-accent-foreground/80 text-xs">
              <ShieldAlert className="h-4 w-4 text-accent" />
              <AlertTitle className="text-sm font-medium text-accent">Important Disclaimer</AlertTitle>
              <AlertDescription>
                AI form analysis provides suggestions and is not a substitute for professional medical or coaching advice. Always prioritize your safety and consult a professional if you have concerns.
              </AlertDescription>
            </Alert>
        </CardFooter>
      </Card>

      {(analysisStatus === 'done' || analysisStatus === 'error' || analysisStatus === 'analyzing') && (
        <Card className="max-w-2xl mx-auto mt-12 glassmorphic-card result-card-animate">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <FileText className="mr-3 h-7 w-7 text-accent" /> 
              {analysisStatus === 'analyzing' ? 'AI is Analyzing...' : (analysisStatus === 'error' ? 'Analysis Error' : 'Form Analysis Results')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisStatus === 'analyzing' && (
                <div className="flex flex-col items-center justify-center p-8 text-card-foreground">
                    <Loader2 className="h-12 w-12 text-accent animate-spin mb-4" />
                    <p className="text-lg">AI is analyzing your form...</p>
                    <p className="text-sm text-card-foreground/70">This might take a few moments.</p>
                </div>
            )}
            {analysisStatus === 'error' && error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle>Oops! Something went wrong.</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
             {analysisStatus === 'error' && !error && !(analysisResult && analysisResult.feedback) && (
                 <Alert variant="destructive">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle>Analysis Incomplete</AlertTitle>
                    <AlertDescription>
                     The AI could not provide feedback. Please try again, ensuring good visibility and clear movement.
                    </AlertDescription>
                </Alert>
            )}
            {analysisResult && analysisStatus === 'done' && (
              <>
                <div>
                  <h4 className="font-semibold text-card-foreground/90 mb-1 text-lg">Feedback for {form.getValues('exerciseName')}:</h4>
                  <div className="prose dark:prose-invert max-w-none text-card-foreground/80 whitespace-pre-wrap p-3 bg-background/20 rounded-md">
                    {analysisResult.feedback}
                  </div>
                </div>
                {analysisResult.injuryPreventionAlert && (
                  <Alert variant="destructive" className="border-2 border-destructive shadow-lg mt-4">
                    <AlertTriangle className="h-5 w-5 animate-pulse" />
                    <AlertTitle className="text-lg">Injury Prevention Alert!</AlertTitle>
                    <AlertDescription className="whitespace-pre-wrap">{analysisResult.injuryPreventionAlert}</AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
