import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Youtube, Send, ArrowRight, ShieldCheck, Wallet } from 'lucide-react';

interface MandatoryTasksProps {
  onComplete: () => void;
}

export default function MandatoryTasks({ onComplete }: MandatoryTasksProps) {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'SUBSCRIBE TO OUR YOUTUBE CHANNEL',
      description: 'Subscribe to get the latest updates and earning tips.',
      buttonText: 'SUBSCRIBE NOW',
      link: 'https://youtube.com/@hpmixtech?si=kFWB10vSnG6jRRu4',
      icon: <Youtube size={24} className="text-red-600" />,
      completed: false,
    },
    {
      id: 2,
      title: 'LIKE AND SHARE OUR YOUTUBE VIDEO',
      description: 'Watch, like, and share our latest video to support us.',
      buttonText: 'WATCH VIDEO',
      link: 'https://youtu.be/j_Pfn0uUzbE?si=v7d_cFLfDMPUSjkA',
      icon: <Youtube size={24} className="text-red-600" />,
      completed: false,
    },
    {
      id: 3,
      title: 'JOIN OUR TELEGRAM CHANNEL',
      description: 'Join our community for daily updates and support.',
      buttonText: 'JOIN TELEGRAM',
      link: 'https://t.me/HPMIXTECH0',
      icon: <Send size={24} className="text-blue-600" />,
      completed: false,
    },
  ]);

  const [activeTask, setActiveTask] = useState<number | null>(null);
  const [pendingTask, setPendingTask] = useState<number | null>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && activeTask !== null) {
        setPendingTask(activeTask);
        setActiveTask(null);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    const fallbackTimer = setTimeout(() => {
      if (activeTask !== null) {
        setPendingTask(activeTask);
        setActiveTask(null);
      }
    }, 5000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(fallbackTimer);
    };
  }, [activeTask]);

  const confirmTask = () => {
    if (pendingTask !== null) {
      setTasks(prev => prev.map(t => t.id === pendingTask ? { ...t, completed: true } : t));
      setPendingTask(null);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const allCompleted = completedCount === tasks.length;

  const handleTaskClick = (id: number, link: string) => {
    setActiveTask(id);
    window.open(link, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[200] bg-gray-50 dark:bg-gray-950 flex flex-col overflow-hidden animate-bg-flow">
      {pendingTask !== null && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-2xl max-w-sm w-full text-center border border-gray-100 dark:border-gray-800"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">Task Completed?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Did you successfully complete the task?</p>
            <div className="flex gap-3">
              <button onClick={() => setPendingTask(null)} className="flex-1 py-3 rounded-xl font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">No</button>
              <button onClick={confirmTask} className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white">Yes, I did</button>
            </div>
          </motion.div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        {/* Header Logo & Title */}
        <div className="flex flex-col items-center mb-8 mt-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20 glow-blue">
              <Wallet size={32} className="text-white" />
            </div>
            <motion.div whileHover={{ scale: 1.05 }} className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl glow-blue">
              <img 
                src="https://i.postimg.cc/7hxmYRSL/IMG-20260211-164250-150.webp" 
                alt="Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20 glow-blue">
              <Wallet size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-gray-50 tracking-tight mb-2">
            EarnUp
          </h1>
          <p className="text-blue-600 dark:text-blue-400 text-xs font-bold tracking-widest uppercase">
            Mandatory Tasks
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[32px] p-8 shadow-xl glow-blue mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2 tracking-tight">Security Clearance</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
            Please complete all tasks below to gain full access to the application. These are mandatory requirements.
          </p>

          <div className="mb-8">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3 text-gray-500 dark:text-gray-400">
              <span>Clearance Progress</span>
              <span className="text-blue-600 dark:text-blue-400">{completedCount}/{tasks.length}</span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / tasks.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="space-y-4">
            {tasks.map((task, index) => (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-5 rounded-2xl border transition-all ${
                  task.completed 
                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-900/10' 
                    : 'border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50 hover:border-blue-200 dark:hover:border-blue-800'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 p-3 rounded-xl ${task.completed ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-white dark:bg-gray-900 shadow-sm'}`}>
                    {task.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-gray-50 text-sm mb-1">{task.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{task.description}</p>
                    
                    {task.completed ? (
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-100 dark:bg-emerald-900/30 w-fit px-3 py-1.5 rounded-lg uppercase tracking-widest">
                        <CheckCircle2 size={16} />
                        Verified
                      </div>
                    ) : (
                      <button
                        onClick={() => handleTaskClick(task.id, task.link)}
                        className="text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 px-5 py-2.5 rounded-xl transition-all uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95"
                      >
                        {task.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mt-4 text-center">
          Made by HP Mix Tech
        </p>
      </div>

      <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={onComplete}
          disabled={!allCompleted}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-widest ${
            allCompleted 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98]' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          {allCompleted ? 'Enter Application' : 'Complete All Tasks'}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
