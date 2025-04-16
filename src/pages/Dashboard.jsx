import { motion } from 'framer-motion';
import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex justify-center mt-[-50px] items-center flex-col space-y-4 relative overflow-hidden">
       {/* Gradient circle */}
       <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-violet-200 via-violet-300 to-violet-400 z-0"
      ></motion.div>
      {/* Background circles */}
      {Array.from({ length: 20 }).map((_, index) => (
        <div
          key={index}
          className="absolute bg-gray-300 rounded-full opacity-30"
          style={{
            width: `${Math.random() * 50 + 20}px`, // Random width between 20px and 70px
            height: `${Math.random() * 50 + 20}px`, // Random height between 20px and 70px
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
            animation: `float ${Math.random() * 10 + 5}s infinite ease-in-out`,
            filter: 'blur(9px)',
          }}
        />
      ))}
      
      {/* Centered content */}
      <div className="relative z-10 text-center">
        <h1 className="text-6xl font-extrabold font-serif">
          Customer Segmentation with SegmenTrack
        </h1>
        <h2 className="text-lg mt-2 font-semibold">
          <br />
        Advanced Insights for Your Business: Harness Data-Driven Intelligence to Understand your Customers.        </h2>
      </div>
    </div>
  );
};

// CSS for circle animation
const styles = `
  @keyframes float {
    0% { transform: translateY(0) scale(1); opacity: 0.3; }
    50% { transform: translateY(-20px) scale(1.1); opacity: 0.5; }
    100% { transform: translateY(0) scale(1); opacity: 0.3; }
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default Dashboard;