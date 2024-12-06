"use client";

import { motion, AnimatePresence } from "framer-motion";
import { create } from "zustand";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (type: NotificationType, message: string) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (type, message) => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      notifications: [...state.notifications, { id, type, message }],
    }));
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 5000);
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

const notificationIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: AlertCircle,
};

const notificationColors = {
  success: "bg-green-500",
  error: "bg-red-500",
  warning: "bg-yellow-500",
  info: "bg-blue-500",
};

export function Notifications() {
  const { notifications, removeNotification } = useNotificationStore();
  const { language } = useTranslation();

  return (
    <div className={`fixed bottom-4 ${language === 'ar' ? 'left-4' : 'right-4'} z-50 space-y-2`}>
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = notificationIcons[notification.type];
          const color = notificationColors[notification.type];

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`${color} text-white p-4 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] max-w-md`}
            >
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Icon className="w-5 h-5" />
                <p>{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="hover:opacity-80 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
