
'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { aiCoach, type AiCoachInput } from '@/ai/flows/provide-ai-coach';
import { Loader2, Send, User, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ChatMessage from '@/components/ai-coach/ChatMessage';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


const aiCoachSetupSchema = z.object({
  language: z.enum(['English', 'Hindi'], {
    required_error: 'Please select a language.',
  }),
  fitnessGoal: z.string().min(5, { message: 'Please describe your fitness goal (min. 5 characters).' }),
  workoutHistorySummary: z.string().optional().describe('A brief summary of recent workouts or current physical status.'),
});

const chatMessageSchema = z.object({
  userMessage: z.string().min(1, { message: 'Message cannot be empty.' }),
});

type AiCoachSetupValues = z.infer<typeof aiCoachSetupSchema>;
type ChatMessageValues = z.infer<typeof chatMessageSchema>;

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export default function AiCoachPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isCoachReady, setIsCoachReady] = useState(false);
  const [coachSettings, setCoachSettings] = useState<AiCoachSetupValues | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const setupForm = useForm<AiCoachSetupValues>({
    resolver: zodResolver(aiCoachSetupSchema),
    defaultValues: {
      language: 'English',
      fitnessGoal: '',
      workoutHistorySummary: '',
    },
  });

  const chatForm = useForm<ChatMessageValues>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      userMessage: '',
    },
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isChatLoading]);

  async function onSetupSubmit(data: AiCoachSetupValues) {
    setIsLoading(true); 
    await new Promise(resolve => setTimeout(resolve, 500));

    setCoachSettings(data);
    setIsCoachReady(true);
    
    const historySummaryText = data.workoutHistorySummary 
        ? `You mentioned: "${data.workoutHistorySummary}". ` 
        : "You haven't shared any specific recent activity. ";

    setMessages([
      {
        id: 'initial-greet',
        sender: 'ai',
        text: `Hello! I'm your Fitnity AI Coach, ready to assist in ${data.language}. I see your goal is "${data.fitnessGoal}". ${historySummaryText}How can I help you kickstart your journey today?`,
        timestamp: new Date(),
      }
    ]);
    toast({
      title: 'AI Coach Ready!',
      description: 'Your AI coach is set up and ready to chat.',
    });
    setIsLoading(false);
  }

  async function onChatSubmit(data: ChatMessageValues) {
    if (!coachSettings) {
      toast({
        variant: 'destructive',
        title: 'Coach Not Ready',
        description: 'Please complete the setup form first.',
      });
      return;
    }

    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: data.userMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsChatLoading(true);
    chatForm.reset();

    try {
      const input: AiCoachInput = {
        language: coachSettings.language,
        fitnessGoal: coachSettings.fitnessGoal,
        workoutHistory: coachSettings.workoutHistorySummary || 'User has not shared any specific recent activity or current status.',
        userMessage: data.userMessage,
      };
      const result = await aiCoach(input);
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: result.coachResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error with AI Coach:', error);
      let errorMessage = 'Sorry, I encountered an issue and could not respond. Please try again later.';
       if (error instanceof Error && error.message) {
        errorMessage = `Sorry, I encountered an error: ${error.message}. Please check your input or try again.`;
      }
      const errorResponse: Message = {
        id: `ai-error-${Date.now()}`,
        sender: 'ai',
        text: errorMessage,
        timestamp: new Date(),
        isError: true,
      }
      setMessages(prev => [...prev, errorResponse]);
      toast({ 
        variant: 'destructive',
        title: 'AI Coach Error',
        description: 'There was a problem communicating with the AI coach. The error has been noted in the chat.',
      });
    } finally {
      setIsChatLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      {!isCoachReady ? (
        <Card className="max-w-lg mx-auto glassmorphic-card">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center">
              <Bot className="mr-3 h-8 w-8 text-accent" /> Setup AI Coach
              </CardTitle>
            <CardDescription>
              Tell us a bit about your goals to personalize your AI Coach experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...setupForm}>
              <form onSubmit={setupForm.handleSubmit(onSetupSubmit)} className="space-y-6">
                <FormField
                  control={setupForm.control}
                  name="fitnessGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Primary Fitness Goal</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Improve stamina, build upper body strength"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={setupForm.control}
                  name="workoutHistorySummary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Recent Activity / Current Status (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Went for a 30 min run yesterday, feeling a bit tired."
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        Providing a brief update helps the AI give more relevant advice.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={setupForm.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Preferred Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg transition-transform duration-300 hover:scale-105 cta-glow-pulse active:scale-95">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Start Chatting'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-2xl mx-auto glassmorphic-card flex flex-col h-[70vh] md:h-[80vh]">
          <CardHeader className="border-b border-white/20">
            <CardTitle className="text-2xl font-bold flex items-center">
              <Bot className="mr-2 h-6 w-6 text-accent" /> AI Fitness Coach
            </CardTitle>
            <CardDescription>
              Your goal: {coachSettings?.fitnessGoal} | Language: {coachSettings?.language}
            </CardDescription>
          </CardHeader>
          <CardContent ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isChatLoading && (
              <div className="flex items-end gap-2 justify-start animate-fade-in-up">
                <div className="flex-shrink-0 p-1.5 rounded-full bg-accent/80 text-accent-foreground">
                  <Bot className="h-5 w-5" />
                </div>
                <div
                  className="max-w-[70%] p-3 rounded-xl shadow bg-primary-foreground/20 text-card-foreground rounded-bl-none"
                >
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm italic">AI is typing...</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <div className="p-4 border-t border-white/20">
            <Form {...chatForm}>
              <form onSubmit={chatForm.handleSubmit(onChatSubmit)} className="flex items-center gap-2">
                <FormField
                  control={chatForm.control}
                  name="userMessage"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input
                          placeholder="Ask your AI coach anything..."
                          {...field}
                          autoComplete="off"
                          disabled={isChatLoading}
                        />
                      </FormControl>
                       <FormMessage className="text-xs pt-1" />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isChatLoading} size="icon" className="bg-accent hover:bg-accent/90 text-accent-foreground flex-shrink-0 transition-colors duration-200 ease-in-out active:scale-95">
                  {isChatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </Form>
          </div>
        </Card>
      )}
    </div>
  );
}
