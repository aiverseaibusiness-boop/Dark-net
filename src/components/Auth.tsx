import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Upload, ArrowRight, Wallet } from 'lucide-react';
import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';

interface AuthProps {
  onSuccess: (user: any) => void;
}

export default function Auth({ onSuccess }: AuthProps) {
  const [isLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: 'FIREBASE_AUTH_BYPASS' }) 
          });
          const data = await res.json();
          
          if (res.ok && data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            onSuccess(data.user);
          } else {
            alert('Account is not available');
          }
        } catch (error: any) {
          console.error('Firebase Login Error:', error);
          alert('Account is not available');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-6 overflow-y-auto animate-bg-flow">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md flex flex-col items-center"
      >
        {/* Header Logo & Title */}
        <div className="flex flex-col items-center mb-8">
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
            Welcome Back
          </p>
        </div>

        <div className="w-full bg-white dark:bg-gray-900 rounded-[32px] p-8 shadow-xl border border-gray-100 dark:border-gray-800 glow-blue">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={20} className="text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-gray-50 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="Email Address"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={20} className="text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-gray-50 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mt-12 text-center">
          Made by HP Mix Tech
        </p>
      </motion.div>
    </div>
  );
}
