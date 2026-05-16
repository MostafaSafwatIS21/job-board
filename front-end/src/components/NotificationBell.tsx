import React, { useEffect, useState } from "react";

import echo from "../utils/echo";

import { Bell, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  //   DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { selectAuth } from "@/app/auth/authSlice";
import { useAppSelector } from "@/app/hooks";

export interface Notification {
  id: string;
  title: string;
  description?: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationBellProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDismiss?: (id: string) => void;
  maxVisible?: number;
}

type NotificationPayload = Omit<Notification, "timestamp"> & {
  timestamp: string | Date;
};

export const NotificationBell = React.forwardRef<
  HTMLDivElement,
  NotificationBellProps
>(
  (
    {
      notifications = [],
      onMarkAsRead,
      onMarkAllAsRead,
      onDismiss,
      maxVisible = 5,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [realtimeNotifications, setRealtimeNotifications] = useState<
      Notification[]
    >([]);

    const allNotifications = [...realtimeNotifications, ...notifications];
    const unreadCount = allNotifications.filter((n) => !n.read).length;

    const formatTime = (date: Date) => {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    };

    const visibleNotifications = allNotifications.slice(0, maxVisible);
    const hasMore = allNotifications.length > maxVisible;

    const auth = useAppSelector(selectAuth);

    // set up real-time updates with Laravel Echo
    useEffect(() => {
      if (!auth.token || !auth.user?.id) return;

      const channelName = `user.alert.${auth.user?.id}`;
      const channel = echo.private(channelName);

      channel.listen("UserNotified", (eventData: NotificationPayload) => {
        const normalized: Notification = {
          ...eventData,
          timestamp: new Date(eventData.timestamp),
        };
        setRealtimeNotifications((prevNotifications) => [
          normalized,
          ...prevNotifications,
        ]);
      });
      channel.subscribed(() => {
        console.log(`Successfully subscribed to ${channelName}`);
      });

      return () => {
        channel.stopListening("UserNotified");
        echo.leaveChannel(channelName);
      };
    }, [auth.token, auth.user?.id]);

    return (
      <div ref={ref} className="relative">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "relative transition-all duration-200",
                unreadCount > 0 && "animate-pulse",
              )}
              aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
            >
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs animate-in fade-in zoom-in"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-80 max-h-96 overflow-hidden flex flex-col p-0"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3 sticky top-0 bg-background">
              <h2 className="font-semibold text-sm">Notifications</h2>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => {
                    setRealtimeNotifications((prevNotifications) =>
                      prevNotifications.map((item) => ({
                        ...item,
                        read: true,
                      })),
                    );
                    onMarkAllAsRead?.();
                  }}
                >
                  Mark all as read
                </Button>
              )}
            </div>

            {/* Notifications List */}
            {allNotifications.length === 0 ? (
              <div className="flex items-center justify-center py-12 px-4">
                <div className="text-center">
                  <Bell className="mx-auto size-8 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No notifications yet
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-y-auto flex-1">
                {visibleNotifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div
                      className={cn(
                        "px-4 py-3 transition-colors hover:bg-accent/50 group",
                        !notification.read && "bg-primary/5",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm leading-tight">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                            )}
                          </div>
                          {notification.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.preventDefault();
                                setRealtimeNotifications((prevNotifications) =>
                                  prevNotifications.map((item) =>
                                    item.id === notification.id
                                      ? { ...item, read: true }
                                      : item,
                                  ),
                                );
                                onMarkAsRead?.(notification.id);
                              }}
                              title="Mark as read"
                            >
                              <Check className="size-3.5" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.preventDefault();
                              setRealtimeNotifications((prevNotifications) =>
                                prevNotifications.filter(
                                  (item) => item.id !== notification.id,
                                ),
                              );
                              onDismiss?.(notification.id);
                            }}
                            title="Dismiss"
                          >
                            <X className="size-3.5" />
                          </Button>
                        </div>
                      </div>

                      {notification.action && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-full text-xs h-7"
                          onClick={() => {
                            notification.action?.onClick();
                            setIsOpen(false);
                          }}
                        >
                          {notification.action.label}
                        </Button>
                      )}
                    </div>
                    {index < visibleNotifications.length - 1 && (
                      <DropdownMenuSeparator className="m-0" />
                    )}
                  </div>
                ))}

                {hasMore && (
                  <>
                    <DropdownMenuSeparator className="m-0" />
                    <div className="px-4 py-2 text-center">
                      <p className="text-xs text-muted-foreground">
                        +{allNotifications.length - maxVisible} more
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },
);

NotificationBell.displayName = "NotificationBell";
