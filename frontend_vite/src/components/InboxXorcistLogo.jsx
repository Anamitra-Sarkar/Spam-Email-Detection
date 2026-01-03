import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Ghost } from 'lucide-react';

const InboxXorcistLogo = ({ className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className={`flex items-center gap-3 ${className}`}
    >
      {/* Logo Icon */}
      <motion.div 
        className="relative w-12 h-12"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-500 to-violet-500 opacity-50 blur-md"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Main logo container */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-600 to-violet-600 flex items-center justify-center overflow-hidden">
          {/* Animated background pattern */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 1px, transparent 1px)`,
              backgroundSize: '8px 8px'
            }}
            animate={{
              backgroundPosition: ['0px 0px', '8px 8px'],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Crossed lightning and shield - representing exorcism/protection */}
          <div className="relative z-10 flex items-center justify-center">
            {/* Ghost icon in background */}
            <motion.div
              className="absolute"
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Ghost className="w-6 h-6 text-white/40" />
            </motion.div>
            
            {/* Lightning bolt (exorcism power) */}
            <motion.div
              className="absolute"
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Zap className="w-6 h-6 text-white fill-white drop-shadow-lg" />
            </motion.div>
            
            {/* X mark overlay - representing "Xorcist" */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-5 h-5">
                <div className="absolute inset-0 bg-white rotate-45 rounded-sm" style={{ width: '2px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' }} />
                <div className="absolute inset-0 bg-white -rotate-45 rounded-sm" style={{ width: '2px', left: '50%', transform: 'translateX(-50%) rotate(-45deg)' }} />
              </div>
            </div>
          </div>
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
          />
        </div>
      </motion.div>

      {/* Logo Text */}
      <div className="flex flex-col">
        <motion.div 
          className="flex items-center"
          whileHover={{ x: 2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-violet-400">
            Inbox
          </span>
          <span className="text-2xl font-bold text-white">
            Xorcist
          </span>
        </motion.div>
        
        {/* Tagline */}
        <motion.span 
          className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Spam Elimination
        </motion.span>
      </div>

      {/* Pulse indicator */}
      <motion.div
        className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-emerald-400"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="absolute inset-0 rounded-full bg-emerald-400 blur-sm" />
      </motion.div>
    </motion.div>
  );
};

export default InboxXorcistLogo;
