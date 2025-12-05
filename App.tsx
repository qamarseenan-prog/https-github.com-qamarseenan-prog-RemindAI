import React, { useState, useEffect } from 'react';
import { TaskInput } from './components/TaskInput';
import { TaskItem } from './components/TaskItem';
import { Task, SmartTaskInput, Priority, Category } from './types';
import { Layers, CalendarCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load from local storage
    const saved = localStorage.getItem('remindai-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    localStorage.setItem('remindai-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (smartTask: SmartTaskInput) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: smartTask.title,
      description: smartTask.description,
      dueDate: smartTask.dueDate,
      priority: smartTask.priority || Priority.Medium,
      category: smartTask.category || Category.Other,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  // Sort: Non-completed first, then by date (if exists), then priority
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    // Check due dates
    if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    if (a.dueDate) return -1; // Tasks with due dates come first
    if (b.dueDate) return 1;
    return 0;
  });

  const stats = {
      total: tasks.length,
      active: tasks.filter(t => !t.completed).length,
      completed: tasks.filter(t => t.completed).length
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                    <Layers size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">RemindAI</h1>
                    <p className="text-xs text-slate-500 font-medium">Smart Task Manager</p>
                </div>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
               <div className="flex flex-col items-end">
                   <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric'})}</span>
               </div>
            </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Welcome / Stats Section */}
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}</h2>
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                <div className="flex-1 min-w-[140px] bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Layers size={20}/></div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Tasks</p>
                    </div>
                </div>
                 <div className="flex-1 min-w-[140px] bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><CalendarCheck size={20}/></div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800">{stats.active}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Pending</p>
                    </div>
                </div>
                 <div className="flex-1 min-w-[140px] bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 size={20}/></div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800">{stats.completed}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Done</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Input Section */}
        <TaskInput onAddTask={handleAddTask} />

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-1">
            <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${filter === 'all' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                All Tasks
            </button>
            <button 
                onClick={() => setFilter('active')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${filter === 'active' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                Active
            </button>
            <button 
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${filter === 'completed' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                Completed
            </button>
        </div>

        {/* Task List */}
        <div className="space-y-1">
            {sortedTasks.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <Layers size={32} />
                    </div>
                    <h3 className="text-slate-900 font-medium mb-1">No tasks found</h3>
                    <p className="text-slate-500 text-sm">Get started by adding a new task above.</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {sortedTasks.map(task => (
                        <TaskItem 
                            key={task.id} 
                            task={task} 
                            onToggle={handleToggleTask} 
                            onDelete={handleDeleteTask} 
                        />
                    ))}
                </div>
            )}
        </div>

      </main>
    </div>
  );
}