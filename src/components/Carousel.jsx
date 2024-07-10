import React, { useState, useRef, useEffect } from 'react';

const Carousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null);

    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    useEffect(() => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.clientWidth;
            containerRef.current.scrollTo({
                left: currentIndex * containerWidth,
                behavior: 'smooth'
            });
        }
    }, [currentIndex]);

    return (
        <div className="carousel">
            <button className="carousel__button carousel__button--left" onClick={handlePrevClick}>
                &lt;
            </button>
            <div className="carousel__image-container" ref={containerRef}>
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image.url}
                        alt={`Slide ${index + 1}`}
                        className="carousel__image"
                    />
                ))}
            </div>
            <button className="carousel__button carousel__button--right" onClick={handleNextClick}>
                &gt;
            </button>
        </div>
    );
};

export default Carousel;
