import React from 'react';
import { motion } from 'motion/react';

const EarningAnimation = () => {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Outer Glowing Energy Ring */}
      <motion.div 
        className="absolute inset-0 rounded-full border-[3px] border-blue-400/30 border-t-blue-300/80 border-r-blue-300/80"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      />
      <motion.div 
        className="absolute inset-2 rounded-full border-[2px] border-indigo-400/20 border-b-indigo-300/70 border-l-indigo-300/70"
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
      />

      {/* Central Turbine Fan */}
      <motion.div 
        className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
      >
        {/* Turbine Blades */}
        {[0, 120, 240].map((angle, i) => (
          <div 
            key={i}
            className="absolute w-1 h-6 bg-white/80 rounded-full origin-bottom"
            style={{ 
              transform: `rotate(${angle}deg) translateY(-8px)`,
              boxShadow: '0 0 8px rgba(255,255,255,0.5)'
            }}
          />
        ))}
        {/* Turbine Core */}
        <div className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10" />
      </motion.div>

      {/* Floating Coins & Sparks */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{ 
            opacity: [0, 1, 0], 
            scale: [0.5, 1.2, 0.5],
            y: -40 - Math.random() * 40,
            x: (Math.random() - 0.5) * 60
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2 + Math.random() * 2, 
            delay: Math.random() * 3 
          }}
          className="absolute z-20"
        >
          {i % 2 === 0 ? (
            <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_12px_rgba(250,204,21,0.8)] flex items-center justify-center text-[8px] font-bold text-yellow-900 border border-yellow-200">
              ₹
            </div>
          ) : (
            <div className="w-1.5 h-1.5 bg-blue-300 rounded-full shadow-[0_0_8px_rgba(147,197,253,0.8)]" />
          )}
        </motion.div>
      ))}

      {/* Data Processing Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-white/60 rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
            x: Math.cos((i * 45) * Math.PI / 180) * 40,
            y: Math.sin((i * 45) * Math.PI / 180) * 40,
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            delay: i * 0.2,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

export default EarningAnimation;
