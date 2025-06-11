
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
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 w-80 z-50">
      <Card className="chat-interface h-96 flex flex-col shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-foreground">
              <Bot className="h-5 w-5 text-primary" />
              <span>AI Assistant</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col space-y-4">
          <ScrollArea className="flex-1 h-64">
            <div className="space-y-4 pr-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.isBot ? "justify-start" : "justify-end flex-row-reverse space-x-reverse"
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    message.isBot ? "bg-primary" : "bg-secondary"
                  }`}>
                    {message.isBot ? (
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <User className="h-4 w-4 text-secondary-foreground" />
                    )}
                  </div>
                  <div className={`max-w-xs rounded-2xl px-4 py-2 ${
                    message.isBot 
                      ? "bg-secondary text-secondary-foreground" 
                      : "bg-primary text-primary-foreground"
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 bg-background border-border rounded-xl"
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="rounded-xl bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FloatingAIAssistant;
