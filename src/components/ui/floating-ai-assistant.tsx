import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Sparkles, ChevronsRight, ChevronsLeft } from 'lucide-react';
import { useRAGChat } from '@/hooks/useRAGChat';
import { cn } from '@/lib/utils';

interface FloatingAIAssistantProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({ isCollapsed, onToggle }) => {
  const [inputValue, setInputValue] = useState('');
  const { messages, isLoading, sendMessage } = useRAGChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isCollapsed) {
      scrollToBottom();
    }
  }, [messages, isCollapsed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue('');
    await sendMessage(message);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cn(
      "h-full flex flex-col bg-background border border-border overflow-hidden rounded-xl shadow-lg",
      isCollapsed ? "items-center w-auto" : "w-full"
    )}>
      <CardHeader className="flex-shrink-0 p-4 border-b border-border w-full">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 rounded-full bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              Your AI Navigator
            </CardTitle>
          )}
           <Button variant="ghost" size="icon" onClick={onToggle} className={cn(isCollapsed && "mx-auto")}>
            {isCollapsed ? <ChevronsLeft className="h-5 w-5" /> : <ChevronsRight className="h-5 w-5" />}
          </Button>
        </div>
        {!isCollapsed && (
          <p className="text-sm text-muted-foreground pt-2">
            Navigate the complexities of college admissions with personalized AI guidance.
          </p>
        )}
      </CardHeader>

      {!isCollapsed && (
        <>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-foreground">
                      Ready to chart your course?
                    </p>
                    <p className="text-sm">
                      Ask me anything from essay brainstorming to financial aid queries.
                    </p>
                    <div className="mt-4 grid gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-auto p-2 text-left"
                        onClick={() => sendMessage("What should I include in my college essays?")}
                      >
                        What should I include in my college essays?
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-auto p-2 text-left"
                        onClick={() => sendMessage("How can I improve my application profile?")}
                      >
                        How can I improve my application profile?
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-auto p-2 text-left"
                        onClick={() => sendMessage("What are good safety schools?")}
                      >
                        What are good safety schools?
                      </Button>
                    </div>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.role === 'user'
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>

                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary animate-pulse" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="flex-shrink-0 p-4 border-t border-border">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about college admissions..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                  className="flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </>
      )}
    </div>
  );
};

export default FloatingAIAssistant;
