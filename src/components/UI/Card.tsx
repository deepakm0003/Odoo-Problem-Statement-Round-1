import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-100';
  const hoverClasses = hover ? 'hover:shadow-md hover:-translate-y-1 transition-all duration-200' : '';
  
  return (
    <motion.div
      whileHover={hover ? { y: -4, shadow: '0 10px 25px rgba(0,0,0,0.1)' } : {}}
      className={`${baseClasses} ${hoverClasses} ${className}`}
    >
      {children}
    </motion.div>
  );
}