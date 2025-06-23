import React, { useState } from "react";
import { Bell, Check, X, Trash2, UserCheck, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { useAdvisor } from "@/hooks/useAdvisor";
import { format } from "date-fns";

const NotificationsDropdown = () => {
  const { useUserNotifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const { useAdvisorRequests, respondToRequest } = useAdvisor();
  const [isOpen, setIsOpen] = useState(false);

  const { data: notifications = [], isLoading } = useUserNotifications();
  const { data: advisorRequests = [] } = useAdvisorRequests();

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const pendingRequests = advisorRequests.filter(req => req.status === 'pending');

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification.mutate(notificationId);
  };

  const handleRequestResponse = (requestId: string, status: 'approved' | 'rejected') => {
    respondToRequest.mutate({ requestId, status });
  };

  const getIconForType = (type: Notification['type']) => {
    switch (type) {
      case 'advisor-request':
        return <UserCheck className="h-4 w-4 text-primary" />;
      case 'application-reminder':
        return <Calendar className="h-4 w-4 text-yellow-500" />;
      case 'essay-feedback':
        return <FileText className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  const getNotificationTitle = (notification: any) => {
    if (notification.type === 'advisor-request') {
      // Find the most recent pending request for this user
      const request = pendingRequests[0]; // Assuming the most recent one
      return request ? `Advisor Request from ${request.advisor?.full_name}` : notification.title;
    }
    return notification.title;
  };

  const getNotificationMessage = (notification: any) => {
    if (notification.type === 'advisor-request') {
      // Find the most recent pending request for this user
      const request = pendingRequests[0]; // Assuming the most recent one
      return request?.message || notification.message;
    }
    return notification.message;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-6 px-2 text-xs"
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <DropdownMenuItem disabled>
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              <span>Loading...</span>
            </div>
          </DropdownMenuItem>
        ) : notifications.length === 0 ? (
          <DropdownMenuItem disabled>
            <span className="text-muted-foreground">No notifications</span>
          </DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
              <div className="flex items-start justify-between w-full">
                <div className="flex items-start space-x-2 flex-1">
                  {getIconForType(notification.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {getNotificationTitle(notification)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getNotificationMessage(notification)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(notification.created_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  {!notification.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {/* Show action buttons for advisor requests */}
              {notification.type === 'advisor-request' && (
                <div className="flex space-x-2 mt-2 w-full">
                  <Button
                    size="sm"
                    onClick={() => {
                      const request = pendingRequests[0]; // Use the most recent request
                      if (request) {
                        handleRequestResponse(request.id, 'approved');
                        handleMarkAsRead(notification.id);
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-xs"
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      const request = pendingRequests[0]; // Use the most recent request
                      if (request) {
                        handleRequestResponse(request.id, 'rejected');
                        handleMarkAsRead(notification.id);
                      }
                    }}
                    className="text-xs"
                  >
                    Decline
                  </Button>
                </div>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
