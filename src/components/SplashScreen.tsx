import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Wallet } from 'lucide-react';

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000); 

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {/* Wallets and Bull Layout */}
      <div className="flex items-center justify-center gap-2 sm:gap-6 mb-8 px-4">
        {/* Big Wallet Left */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
          className="hidden sm:block"
        >
          <div className="bg-black p-4 rounded-2xl shadow-xl">
            <Wallet size={64} className="text-white" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
          className="sm:hidden"
        >
          <div className="bg-black p-2 rounded-xl shadow-lg">
            <Wallet size={40} className="text-white" />
          </div>
        </motion.div>

        {/* Center Logo (Bull + Small Wallets) */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.8 
          }}
          className="relative"
        >
          <img
            src="https://i.postimg.cc/7hxmYRSL/IMG-20260211-164250-150.webp"
            alt="Dark Net Logo"
            className="w-48 h-48 sm:w-64 sm:h-64 object-contain"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Big Wallet Right */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
          className="hidden sm:block"
        >
          <div className="bg-black p-4 rounded-2xl shadow-xl">
            <Wallet size={64} className="text-white" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
          className="sm:hidden"
        >
          <div className="bg-black p-2 rounded-xl shadow-lg">
            <Wallet size={40} className="text-white" />
          </div>
        </motion.div>
      </div>

      {/* Huge Text */}
      <motion.h1
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
        className="text-[3.5rem] sm:text-7xl md:text-8xl font-black text-black tracking-tighter text-center leading-none"
        style={{ transform: 'scaleY(1.1)' }}
      >
        DARK NET
      </motion.h1>
    </motion.div>
  );
};

export default SplashScreen;
