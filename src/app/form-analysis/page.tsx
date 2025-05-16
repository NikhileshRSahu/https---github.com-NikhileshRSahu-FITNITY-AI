
'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { provideFormAnalysis, type ProvideFormAnalysisInput, type ProvideFormAnalysisOutput } from '@/ai/flows/provide-form-analysis-flow';
import { Loader2, Camera, AlertTriangle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formAnalysisSchema = z.object({
  exerciseName: z.string().min(3, { message: 'Please enter the exercise name (min. 3 characters).' }),
});

type FormAnalysisValues = z.infer<typeof formAnalysisSchema>;

type AnalysisStatus = 'idle' | 'capturing' | 'analyzing' | 'done' | 'error';

export default function FormAnalysisPage() {
  const [isLoading, setIsLoading] = useState(false); // General loading for AI call
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [analysisResult, setAnalysisResult] = useState<ProvideFormAnalysisOutput | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const form = useForm<FormAnalysisValues>({
    resolver: zodResolver(formAnalysisSchema),
    defaultValues: {
      exerciseName: '',
    },
  });

  useEffect(() => {
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
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Fitnity AI needs access to your camera for form analysis. Please enable camera permissions in your browser settings and refresh the page.',
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
  }, [toast]);

  async function onSubmit(data: FormAnalysisValues) {
    if (!hasCameraPermission || !videoRef.current || !videoRef.current.srcObject) {
      toast({
        variant: 'destructive',
        title: 'Camera Not Ready',
        description: 'Camera is not accessible. Please ensure permissions are granted and the camera is working properly.',
      });
      setAnalysisStatus('error');
      return;
    }
    
    if (videoRef.current.readyState < videoRef.current.HAVE_ENOUGH_DATA) {
        toast({
            variant: 'destructive',
            title: 'Video Stream Not Ready',
            description: 'The video stream is not fully loaded yet. Please wait a moment and try again.',
        });
        setAnalysisStatus('error');
        return;
    }

    // Ensure video dimensions are available and valid
    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
        toast({ 
            variant: 'destructive', 
            title: 'Video Error', 
            description: 'Could not get video dimensions. The camera might still be initializing or there could be an issue with the video feed. Please wait a moment and try again.'
        });
        setAnalysisStatus('error');
        return;
    }

    setIsLoading(true);
    setAnalysisStatus('capturing');
    setAnalysisResult(null);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      toast({
        variant: 'destructive',
        title: 'Processing Error',
        description: 'Could not create a canvas context to process the video frame. Please try again or use a different browser.',
      });
      setIsLoading(false);
      setAnalysisStatus('error');
      return;
    }

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const videoDataUri = canvas.toDataURL('image/jpeg'); 

    setAnalysisStatus('analyzing');
    try {
      const input: ProvideFormAnalysisInput = {
        videoDataUri,
        exerciseName: data.exerciseName,
      };
      const result = await provideFormAnalysis(input);
      setAnalysisResult(result);
      setAnalysisStatus('done');
      toast({
        title: 'Analysis Complete!',
        description: 'Your form analysis is ready.',
      });
    } catch (error) {
      console.error('Error analyzing form:', error);
      let errorMessage = 'Failed to analyze form. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: errorMessage,
      });
      setAnalysisStatus('error');
    } finally {
      setIsLoading(false);
      // Ensure status is reset to idle if it wasn't 'done' or already 'error'
      if (analysisStatus !== 'done' && analysisStatus !== 'error') {
         // If loading was set to true, but status did not reach 'done' or 'error'
         // it implies an early exit or an issue not caught by specific error handling.
         // We should ensure isLoading is false and status is not stuck.
         // However, if analysisStatus was already set to 'error' by a specific check, we keep it.
        if (isLoading && analysisStatus !== 'error') {
             setAnalysisStatus('idle');
        }
      }
    }
  }
  
  const getButtonText = () => {
    if (isLoading) {
      switch (analysisStatus) {
        case 'capturing':
          return 'Capturing frame...';
        case 'analyzing':
          return 'Analyzing form...';
        default:
          return 'Processing...';
      }
    }
    return 'Analyze My Form';
  };


  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <Card className="max-w-2xl mx-auto glassmorphic-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <Camera className="mr-3 h-8 w-8 text-accent" /> Real-time Form Analysis
          </CardTitle>
          <CardDescription>
            Let our AI check your exercise form. Enter the exercise name and click analyze. Ensure good lighting and that your full body is visible for best results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="aspect-video bg-background/20 rounded-md overflow-hidden border border-white/20">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
          </div>

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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="exerciseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Squat, Push-up, Lunge"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading || !hasCameraPermission || hasCameraPermission === null} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg transition-transform duration-300 hover:scale-105 cta-glow-pulse">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {getButtonText()}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      {analysisResult && analysisStatus === 'done' && (
        <Card className="max-w-2xl mx-auto mt-12 glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <FileText className="mr-3 h-7 w-7 text-accent" /> Form Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-card-foreground/90 mb-1">Feedback for {form.getValues('exerciseName')}:</h4>
              <div className="prose dark:prose-invert max-w-none text-card-foreground/80 whitespace-pre-wrap p-3 bg-background/20 rounded-md">
                {analysisResult.feedback}
              </div>
            </div>
            {analysisResult.injuryPreventionAlert && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Injury Prevention Alert!</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap">{analysisResult.injuryPreventionAlert}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
