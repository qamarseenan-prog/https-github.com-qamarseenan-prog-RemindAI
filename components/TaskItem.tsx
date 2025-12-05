import React from 'react';
import { Check, Calendar, Clock, Tag, Trash2, AlertCircle } from 'lucide-react';
import { Task, Priority, Category } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const isExpired = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case Priority.High: return 'text-red-600 bg-red-50 border-red-100';
      case Priority.Medium: return 'text-amber-600 bg-amber-50 border-amber-100';
      case Priority.Low: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getCategoryColor = (c: Category) => {
      switch(c) {
          case Category.Work: return 'text-blue-500';
          case Category.Personal: return 'text-purple-500';
          case Category.Health: return 'text-green-500';
          case Category.Shopping: return 'text-pink-500';
          default: return 'text-slate-500';
      }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={`group flex items-start gap-4 p-5 mb-3 bg-white rounded-xl border transition-all duration-200 
      ${task.completed ? 'opacity-60 bg-slate-50 border-slate-100' : 'hover:shadow-md border-slate-100 shadow-sm'}
    `}>
      <button
        onClick={() => onToggle(task.id)}
        className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0
          ${task.completed 
            ? 'bg-indigo-500 border-indigo-500 text-white' 
            : 'border-slate-300 hover:border-indigo-500 text-transparent'
          }
        `}
      >
        <Check size={14} strokeWidth={3} />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
            <h3 className={`font-medium text-slate-800 break-words ${task.completed ? 'line-through text-slate-500' : ''}`}>
            {task.title}
            </h3>
            <button 
                onClick={() => onDelete(task.id)}
                className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
            >
                <Trash2 size={16} />
            </button>
        </div>
        
        {task.description && (
          <p className="text-sm text-slate-500 mt-1 mb-2 line-clamp-2">{task.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
          {task.dueDate && (
             <div className={`flex items-center gap-1.5 ${isExpired ? 'text-red-500 font-medium' : 'text-slate-500'}`}>
               {isExpired ? <AlertCircle size={14} /> : <Clock size={14} />}
               <span>{formatDate(task.dueDate)}</span>
             </div>
          )}
          
          <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </div>

          <div className={`flex items-center gap-1 ${getCategoryColor(task.category)}`}>
             <Tag size={12} />
             <span>{task.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
