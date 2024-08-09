import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaAirFreshener, FaGasPump, FaCar, FaUsers, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CabCard = ({cab,price}) => {

  const {  _id,capacity,modelName,photos,type} = cab
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      rotateY: -90
    },
    visible: { 
      opacity: 1,
      rotateY: 0,
      transition: { 
        type: "spring",
        damping: 15,
        stiffness: 100
      }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
      transition: {
        duration: 0.3
      }
    }
  };

  const imageVariants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  return (
    <motion.section 
      className="cabs_card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    //   whileHover="hover"
    >
      <div className="cabs_carousel">
        <AnimatePresence initial={false} custom={currentPhotoIndex}>
          <motion.img
            key={currentPhotoIndex}
            src={photos[currentPhotoIndex].url}
            custom={currentPhotoIndex}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          />
        </AnimatePresence>
        <button className="cabs_carousel_button prev" onClick={prevPhoto}>
          <FaChevronLeft />
        </button>
        <button className="cabs_carousel_button next" onClick={nextPhoto}>
          <FaChevronRight />
        </button>
      </div>
      <motion.div 
        className="cabs_info"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2>{modelName}</h2>
        <p className="cabs_price">₹ {price.toFixed(2)}</p>
        <p className="cabs_description">
          Experience luxury and comfort with our {modelName}. Perfect for your journey 💫 ...
        </p>
        <div className="cabs_features">
          <span><FaAirFreshener /> AC</span>
          <span><FaGasPump /> {type}</span>
          <span><FaCar /> Auto</span>
          <span><FaUsers /> {capacity} Seater</span>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link className="cabs_book_button" to={`/cabs/${_id}`}>Book Now</Link>
        </motion.div>
      </motion.div>
    </motion.section>
   
  );
};

export default CabCard;