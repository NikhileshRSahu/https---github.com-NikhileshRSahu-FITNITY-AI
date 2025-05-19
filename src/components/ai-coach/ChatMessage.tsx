
import { Bot, User, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={cn(
        "flex items-end gap-2 animate-fade-in-up",
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className={cn(
            "flex-shrink-0 p-1.5 rounded-full text-accent-foreground",
            message.isError ? "bg-destructive" : "bg-accent/80"
          )}
        >
          {message.isError ? <AlertTriangle className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </div>
      )}
      <div
        className={cn(
          "max-w-[70%] p-3 rounded-xl shadow",
          isUser
            ? 'bg-accent text-accent-foreground rounded-br-none'
            : message.isError 
              ? 'bg-destructive/20 text-destructive-foreground rounded-bl-none' // More pronounced error style
              : 'bg-primary-foreground/20 text-card-foreground rounded-bl-none' 
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        <p className={cn(
            "text-xs mt-1",
            isUser ? 'text-accent-foreground/70 text-right' : 
            message.isError ? 'text-destructive-foreground/70 text-left' : 'text-card-foreground/60 text-left'
          )}
        >
          {format(message.timestamp, 'p')}
        </p>
      </div>
      {isUser && (
         <div className="flex-shrink-0 p-1.5 rounded-full bg-primary/80 text-primary-foreground">
          <User className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}
