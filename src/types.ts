export interface Task {
    id: number;
    todo: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    deadline: string;
    notificationId?: string;
  }
  