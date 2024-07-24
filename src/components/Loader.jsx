import React from 'react';
import { motion } from 'framer-motion';


const Loader = () => {
  return (
    <div className="loaderContainer">
      <div className="loaderContent">
        <motion.div className="luxuryRing outerRing"
          animate={{
            rotate: 360,
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "linear"
          }}
        />
        <motion.div className="luxuryRing middleRing"
          animate={{
            rotate: -360,
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "linear"
          }}
        />
        <motion.div className="luxuryRing innerRing"
          animate={{
            rotate: 360,
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "linear"
          }}
        />
        <motion.div className="carIcon"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 20H5V21C5 21.6 4.6 22 4 22H3C2.4 22 2 21.6 2 21V12L4.3 5.3C4.5 4.5 5.2 4 6 4H18C18.8 4 19.5 4.5 19.7 5.3L22 12V21C22 21.6 21.6 22 21 22H20C19.4 22 19 21.6 19 21V20ZM6.5 17C7.3 17 8 16.3 8 15.5C8 14.7 7.3 14 6.5 14C5.7 14 5 14.7 5 15.5C5 16.3 5.7 17 6.5 17ZM17.5 17C18.3 17 19 16.3 19 15.5C19 14.7 18.3 14 17.5 14C16.7 14 16 14.7 16 15.5C16 16.3 16.7 17 17.5 17ZM5 13H19V7H5V13Z" />
          </svg>
        </motion.div>
      </div>
      <motion.div className="loadingText"
        animate={{
          opacity: [1, 0.5, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }}
      >
        Book Your Luxurious Journey
      </motion.div>
    </div>
  );
};

export default Loader;