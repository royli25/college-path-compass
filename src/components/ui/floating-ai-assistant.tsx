
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Trash2 } from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

interface FloatingAIAssistantProps {
  placeholder?: string;
  onClear?: () => void;
}

const FloatingAIAssistant = ({ 
  placeholder = "I am your general college application AI assistant — feel free to ask me any questions about your application",
  onClear
}: FloatingAIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: placeholder,
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thank you for your message! This AI assistant feature is coming soon and will provide personalized advice for your college applications.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: "1",
        content: placeholder,
        isBot: true,
        timestamp: new Date(),
      },
    ]);
    if (onClear) onClear();
  };

  return (
    <div className="h-full w-full flex flex-col bg-card border-l border-border">
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-border bg-card">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-primary" />
          <span className="text-lg font-medium text-foreground">AI Assistant</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="h-8 w-8 hover:bg-secondary"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages Area - Scrollable middle section */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.isBot ? "justify-start" : "justify-end flex-row-reverse space-x-reverse"
                }`}
              >
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                  message.isBot ? "bg-primary" : "bg-secondary"
                }`}>
                  {message.isBot ? (
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <User className="h-4 w-4 text-secondary-foreground" />
                  )}
                </div>
                <div className={`max-w-[250px] rounded-2xl px-4 py-2 break-words ${
                  message.isBot 
                    ? "bg-secondary text-secondary-foreground" 
                    : "bg-primary text-primary-foreground"
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 p-6 border-t border-border bg-card">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 bg-background border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="rounded-xl bg-primary hover:bg-primary/90 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FloatingAIAssistant;
