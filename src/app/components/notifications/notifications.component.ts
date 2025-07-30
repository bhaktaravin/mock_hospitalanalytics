import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications = signal<Notification[]>([
    {
      id: '1',
      title: 'Emergency Alert',
      message: 'Patient in Room 302 requires immediate attention',
      type: 'error',
      timestamp: new Date(),
      read: false,
      priority: 'urgent'
    },
    {
      id: '2',
      title: 'Equipment Maintenance',
      message: 'MRI Machine #2 scheduled for maintenance at 3:00 PM',
      type: 'warning',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: false,
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Surgery Completed',
      message: 'Hip replacement surgery in OR-5 completed successfully',
      type: 'success',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true,
      priority: 'low'
    },
    {
      id: '4',
      title: 'Staff Update',
      message: 'Dr. Wilson will be covering the night shift in Cardiology',
      type: 'info',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      read: false,
      priority: 'medium'
    }
  ]);

  private notificationInterval: any;
  showNotifications = signal(false);

  ngOnInit() {
    // Simulate real-time notifications
    this.notificationInterval = setInterval(() => {
      this.addRandomNotification();
    }, 30000); // Add a new notification every 30 seconds
  }

  ngOnDestroy() {
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
    }
  }

  get unreadCount() {
    return this.notifications().filter(n => !n.read).length;
  }

  get sortedNotifications() {
    return this.notifications().sort((a, b) => {
      // Sort by priority first, then by timestamp
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  }

  toggleNotifications() {
    this.showNotifications.update(show => !show);
  }

  markAsRead(notificationId: string) {
    const currentNotifications = this.notifications();
    const updatedNotifications = currentNotifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    this.notifications.set(updatedNotifications);
  }

  markAllAsRead() {
    const currentNotifications = this.notifications();
    const updatedNotifications = currentNotifications.map(notification => ({
      ...notification,
      read: true
    }));
    this.notifications.set(updatedNotifications);
  }

  deleteNotification(notificationId: string) {
    const currentNotifications = this.notifications();
    const updatedNotifications = currentNotifications.filter(n => n.id !== notificationId);
    this.notifications.set(updatedNotifications);
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'error': return '🚨';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  private addRandomNotification() {
    const randomNotifications = [
      {
        title: 'Lab Results Ready',
        message: 'Blood work results for Patient #P023 are now available',
        type: 'info' as const,
        priority: 'medium' as const
      },
      {
        title: 'Bed Available',
        message: 'Bed in ICU Ward B is now available for admission',
        type: 'success' as const,
        priority: 'high' as const
      },
      {
        title: 'Medication Alert',
        message: 'Low stock alert: Morphine supply below minimum threshold',
        type: 'warning' as const,
        priority: 'high' as const
      },
      {
        title: 'Shift Change',
        message: 'Night shift staff have checked in for duty',
        type: 'info' as const,
        priority: 'low' as const
      }
    ];

    const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
    
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: randomNotification.title,
      message: randomNotification.message,
      type: randomNotification.type,
      timestamp: new Date(),
      read: false,
      priority: randomNotification.priority
    };

    const currentNotifications = this.notifications();
    this.notifications.set([newNotification, ...currentNotifications]);
  }
}
