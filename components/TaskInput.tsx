import React, { useState } from 'react';
import { Sparkles, Plus, Loader2, ArrowRight } from 'lucide-react';
import { parseSmartTask } from '../services/geminiService';
import { SmartTaskInput, Priority, Category } from '../types';

interface TaskInputProps {
  onAddTask: (task: SmartTaskInput) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);

  // Manual mode state
  const [manualTitle, setManualTitle] = useState('');
  const [manualDate, setManualDate] = useState('');
  const [manualPriority, setManualPriority] = useState<Priority>(Priority.Medium);

  const handleSmartSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsProcessing(true);
    try {
      const result = await parseSmartTask(inputValue);
      if (result) {
        onAddTask(result);
        setInputValue('');
      } else {
        // Fallback if AI fails (e.g. empty response)
        onAddTask({
            title: inputValue,
            priority: Priority.Medium,
            category: Category.Other
        });
        setInputValue('');
      }
    } catch (error) {
      console.error("Failed to add smart task", error);
       // Fallback on error
       onAddTask({
        title: inputValue,
        priority: Priority.Medium,
        category: Category.Other
      });
      setInputValue('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    onAddTask({
      title: manualTitle,
      dueDate: manualDate ? new Date(manualDate).toISOString() : undefined,
      priority: manualPriority,
      category: Category.Other // Simplified for manual
    });
    
    setManualTitle('');
    setManualDate('');
    setManualPriority(Priority.Medium);
    setIsManualMode(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 relative z-10">
      
      {!isManualMode ? (
        <form onSubmit={handleSmartSubmit} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 blur"></div>
          <div className="relative flex items-center bg-white rounded-xl shadow-lg ring-1 ring-slate-900/5">
            <div className="pl-4 text-slate-400">
               <Sparkles size={20} className={isProcessing ? "animate-pulse text-indigo-500" : ""} />
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask AI: 'Remind me to call Mom tomorrow at 5pm'..."
              className="flex-1 p-4 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400"
              disabled={isProcessing}
            />
            <div className="pr-2 flex gap-2">
                 <button
                    type="button"
                    onClick={() => setIsManualMode(true)}
                    className="p-2 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                    title="Switch to manual input"
                  >
                    Manual
                 </button>
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isProcessing}
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-200"
                >
                  {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                </button>
            </div>
          </div>
          <div className="mt-2 text-center">
            <p className="text-xs text-slate-400">Powered by Gemini 2.5 Flash</p>
          </div>
        </form>
      ) : (
        <form onSubmit={handleManualSubmit} className="bg-white p-6 rounded-xl shadow-lg ring-1 ring-slate-900/5 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-700">New Task</h3>
                <button type="button" onClick={() => setIsManualMode(false)} className="text-sm text-slate-400 hover:text-slate-600">Cancel</button>
            </div>
            <div className="space-y-4">
                <input 
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="Task title"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    required
                />
                <div className="flex gap-4">
                    <input 
                        type="datetime-local" 
                        className="flex-1 p-2 border border-slate-200 rounded-lg text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={manualDate}
                        onChange={(e) => setManualDate(e.target.value)}
                    />
                    <select 
                        className="p-2 border border-slate-200 rounded-lg text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={manualPriority}
                        onChange={(e) => setManualPriority(e.target.value as Priority)}
                    >
                        <option value={Priority.Low}>Low Priority</option>
                        <option value={Priority.Medium}>Medium Priority</option>
                        <option value={Priority.High}>High Priority</option>
                    </select>
                </div>
                <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors">
                    Add Task
                </button>
            </div>
        </form>
      )}
    </div>
  );
};
