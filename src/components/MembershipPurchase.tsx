import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface MembershipPurchaseProps {
  onComplete: () => void;
  userId: number;
}

export default function MembershipPurchase({ onComplete, userId }: MembershipPurchaseProps) {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handlePurchase = async () => {
    if (!file) {
      alert('Please upload a payment screenshot');
      return;
    }
    setLoading(true);
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would upload the file to your server here
      
      const res = await fetch('/api/user/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, days: 10, screenshot: 'uploaded' }),
      });
      
      if (res.ok) {
        setShowSuccess(true);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || 'Payment verification failed. Please try again.');
      }
    } catch (error) {
      console.error("Purchase failed", error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-6 overflow-y-auto bg-gradient-to-tr from-purple-600 via-pink-500 to-yellow-500 backdrop-blur-md">
      <AnimatePresence mode="wait">
        {showSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="flex flex-col items-center text-center relative"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-40 h-40 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center mb-8 shadow-[0_0_100px_rgba(52,211,153,0.6)] relative z-10"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full border-4 border-emerald-300/50"
              />
              <CheckCircle2 size={80} className="text-white drop-shadow-lg" />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative z-10"
            >
              <h2 className="text-4xl font-black text-white mb-4 tracking-tight drop-shadow-md">Verification</h2>
              <p className="text-emerald-300 text-lg font-medium max-w-sm mx-auto mb-8">Your payment screenshot has been submitted. Verification usually takes 12-24 hours.</p>
              <button 
                onClick={onComplete}
                className="bg-white text-emerald-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-emerald-50 transition-all"
              >
                Continue to App
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="purchase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="w-full max-w-md bg-gray-900/90 backdrop-blur-xl border border-blue-500/30 rounded-[32px] p-8 shadow-2xl glow-blue text-center relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
            
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/30 glow-blue">
              <Crown size={40} className="text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Premium Access</h2>
            <p className="text-gray-300 mb-8 text-sm">Pay ₹300 for 10 days of premium access.</p>
            
            <div className="bg-gray-800/50 rounded-2xl p-6 mb-8 border border-gray-700/50">
              <p className="text-white font-bold mb-4">Scan QR to Pay</p>
              <div className="w-48 h-48 bg-white mx-auto mb-4 flex items-center justify-center rounded-xl overflow-hidden">
                <img 
                  src="https://i.postimg.cc/8CTBCsFV/IMG-20260308-WA0007.jpg" 
                  alt="QR Code" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-white font-bold mb-2 text-sm">Upload payment proof</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              {file && <p className="text-emerald-400 text-xs mt-2">{file.name}</p>}
            </div>

            <button 
              onClick={handlePurchase}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Submit for Verification
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
