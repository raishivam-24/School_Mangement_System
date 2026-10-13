/**
 * @file SocketContext.tsx
 * @description Senior-developer real-time Socket.io context provider with automatic reconnection,
 * JWT authentication handshake, typing indicators, and online status tracking.
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

export interface ChatMessagePayload {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  time: string;
  createdAt: string;
}

export interface TypingEventPayload {
  conversationId: string;
  userId: string;
  name: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUserIds: string[];
  typingUsers: { [conversationId: string]: string | null };
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, text: string, recipientId?: string, senderName?: string) => void;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ [conversationId: string]: string | null }>({});

  const typingTimeoutRef = useRef<{ [conversationId: string]: ReturnType<typeof setTimeout> }>({});

  // Initialize Socket connection
  useEffect(() => {
    const token = localStorage.getItem('schoolhub_token');

    const socketInstance: Socket = io(SOCKET_URL, {
      auth: {
        token: token || undefined,
        userId: user?.id,
        email: user?.email,
        name: user?.name,
        role: user?.role,
        schoolId: user?.school?.id,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      socketInstance.emit('get_online_users');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('online_users', (userIds: string[]) => {
      setOnlineUserIds(userIds);
    });

    socketInstance.on('user_status_change', ({ userId, status }: { userId: string; status: 'Online' | 'Offline' }) => {
      setOnlineUserIds((prev) => {
        if (status === 'Online') {
          return prev.includes(userId) ? prev : [...prev, userId];
        } else {
          return prev.filter((id) => id !== userId);
        }
      });
    });

    socketInstance.on('user_typing', ({ conversationId, name }: TypingEventPayload) => {
      setTypingUsers((prev) => ({ ...prev, [conversationId]: name }));

      // Clear existing timeout if any
      if (typingTimeoutRef.current[conversationId]) {
        clearTimeout(typingTimeoutRef.current[conversationId]);
      }

      // Auto-clear typing indicator after 3 seconds if no stop signal
      typingTimeoutRef.current[conversationId] = setTimeout(() => {
        setTypingUsers((prev) => ({ ...prev, [conversationId]: null }));
      }, 3000);
    });

    socketInstance.on('user_stopped_typing', ({ conversationId }: { conversationId: string }) => {
      setTypingUsers((prev) => ({ ...prev, [conversationId]: null }));
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  // Join a chat conversation room
  const joinConversation = useCallback(
    (conversationId: string) => {
      if (socket && isConnected) {
        socket.emit('join_conversation', { conversationId });
      }
    },
    [socket, isConnected]
  );

  // Leave a chat conversation room
  const leaveConversation = useCallback(
    (conversationId: string) => {
      if (socket && isConnected) {
        socket.emit('leave_conversation', { conversationId });
      }
    },
    [socket, isConnected]
  );

  // Send real-time message
  const sendMessage = useCallback(
    (conversationId: string, text: string, recipientId?: string, senderName?: string) => {
      if (socket && isConnected) {
        socket.emit('send_message', {
          conversationId,
          text,
          recipientId,
          senderName: senderName || user?.name,
        });
      }
    },
    [socket, isConnected, user]
  );

  // Typing start
  const startTyping = useCallback(
    (conversationId: string) => {
      if (socket && isConnected) {
        socket.emit('typing_start', { conversationId });
      }
    },
    [socket, isConnected]
  );

  // Typing stop
  const stopTyping = useCallback(
    (conversationId: string) => {
      if (socket && isConnected) {
        socket.emit('typing_stop', { conversationId });
      }
    },
    [socket, isConnected]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        onlineUserIds,
        typingUsers,
        joinConversation,
        leaveConversation,
        sendMessage,
        startTyping,
        stopTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
