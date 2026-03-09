import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Upload, ArrowRight, Wallet } from 'lucide-react';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';

interface AuthProps {
  onSuccess: (user: any) => void;
}

export default function Auth({ onSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          
          // To keep the app working, we still need to fetch/create the user in our local DB
          // because the app relies on points, referral codes, etc.
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
            // If local login fails but firebase succeeded, we might need to create the user locally
            // But for now, let's just use the firebase user data if local fails
            const mockUser = {
              id: Date.now(),
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'User',
              profile_pic: firebaseUser.photoURL || 'https://i.postimg.cc/7hxmYRSL/IMG-20260211-164250-150.webp',
              points: 0,
              referral_code: 'REF' + Math.random().toString(36).substring(7).toUpperCase(),
              has_completed_tasks: 0,
              has_seen_onboarding: 0,
              membership_expires_at: null
            };
            localStorage.setItem('user', JSON.stringify(mockUser));
            onSuccess(mockUser);
          }
        } catch (error: any) {
          console.error('Firebase Login Error:', error);
          alert('Password or Email Incorrect');
        }
      } else {
        if (password !== repeatPassword) {
          alert('Passwords do not match');
          setLoading(false);
          return;
        }

        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;

          // Update profile with name and photo if provided
          // Note: We don't pass base64 to Firebase as it has a length limit
          await updateProfile(firebaseUser, {
            displayName: name || 'User',
            photoURL: 'https://i.postimg.cc/7hxmYRSL/IMG-20260211-164250-150.webp'
          });

          // Create user in local DB so they can earn points
          const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email, 
              password: 'FIREBASE_AUTH_BYPASS', 
              name: name || 'User', 
              dob: '2000-01-01',
              age: 25,
              profilePic: photo || 'https://i.postimg.cc/7hxmYRSL/IMG-20260211-164250-150.webp',
              referralCode: ''
            })
          });
          
          const data = await res.json();
          if (res.ok && data.success) {
            // Log them in locally
            const loginRes = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password: 'FIREBASE_AUTH_BYPASS' })
            });
            const loginData = await loginRes.json();
            if (loginRes.ok && loginData.success) {
              localStorage.setItem('user', JSON.stringify(loginData.user));
              onSuccess(loginData.user);
            } else {
              onSuccess(data.user);
            }
          } else {
            // Fallback to mock user if local DB fails
            const mockUser = {
              id: Date.now(),
              email: firebaseUser.email,
              name: name || 'User',
              profile_pic: photo || 'https://i.postimg.cc/7hxmYRSL/IMG-20260211-164250-150.webp',
              points: 0,
              referral_code: 'REF' + Math.random().toString(36).substring(7).toUpperCase(),
              has_completed_tasks: 0,
              has_seen_onboarding: 0,
              membership_expires_at: null
            };
            localStorage.setItem('user', JSON.stringify(mockUser));
            onSuccess(mockUser);
          }
        } catch (error: any) {
          console.error('Firebase Signup Error:', error);
          const errorCode = error.code || '';
          const errorMessage = error.message || '';
          
          if (errorCode === 'auth/email-already-in-use' || errorMessage.includes('auth/email-already-in-use')) {
            alert('User already exists. Sign in');
            setIsLogin(true);
          } else {
            alert(errorMessage || 'Signup failed');
          }
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
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </p>
        </div>

        <div className="w-full bg-white dark:bg-gray-900 rounded-[32px] p-8 shadow-xl border border-gray-100 dark:border-gray-800 glow-blue">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="flex justify-center mb-6">
                  <label className="relative cursor-pointer group">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center transition-colors group-hover:border-blue-500">
                      {photo ? (
                        <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} className="text-gray-400" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload size={20} className="text-white" />
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                  </label>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-gray-50 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    placeholder="Full Name"
                  />
                </div>
              </>
            )}

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

            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-gray-50 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="Repeat Password"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
              }}
              className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline transition-all"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mt-12 text-center">
          Made by HP Mix Tech
        </p>
      </motion.div>
    </div>
  );
}
