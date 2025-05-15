
import { Bot, User } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 p-1.5 rounded-full bg-accent/80 text-accent-foreground">
          <Bot className="h-5 w-5" />
        </div>
      )}
      <div
        className={`max-w-[70%] p-3 rounded-xl shadow ${
          isUser
            ? 'bg-accent text-accent-foreground rounded-br-none'
            : 'bg-primary-foreground/20 text-primary-foreground rounded-bl-none'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-accent-foreground/70 text-right' : 'text-primary-foreground/60 text-left'}`}>
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
