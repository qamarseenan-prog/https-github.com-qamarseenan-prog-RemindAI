export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low'
}

export enum Category {
  Personal = 'Personal',
  Work = 'Work',
  Health = 'Health',
  Shopping = 'Shopping',
  Other = 'Other'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO String
  priority: Priority;
  category: Category;
  completed: boolean;
  createdAt: string;
}

export interface SmartTaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
  category?: Category;
}
