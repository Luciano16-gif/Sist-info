import React, { useState } from 'react';

const StackedCards = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };
    
    const handlePrev = () => {
        setCurrentIndex((prev) => 
            prev === 0 ? images.length - 1 : prev - 1
        );
    };
    
    return (
        <div className="relative w-full max-w-6xl mx-auto px-4 py-16 flex items-center">
            {/* Texto a la izquierda */}
            <div className="w-1/3 pr-8 text-left">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    ¡Tips viajeros!
                </h2>
                <p className="text-lg md:text-xl text-gray-300">
                    Sigue estos tips para que puedas vivir la mejor experiencia posible con nosotros
                </p>
            </div>
            
            {/* Contenedor de las imágenes */}
            <div className="relative w-2/3 aspect-[3/4] mx-auto">
                {images.map((image, index) => {
                    const offset = currentIndex - index;
                    const zIndex = images.length - Math.abs(offset);
                    const opacity = 1 - (Math.abs(offset) * 0.2);
                    const scale = 0.6 - (Math.abs(offset) * 0.1);
                    const translateX = offset * 15;
                    const translateY = Math.abs(offset) * 20;
                    
                    if (Math.abs(offset) > 2) return null;
                    
                    return (
                        <div
                            key={index}
                            className="absolute inset-0 w-full h-full rounded-lg shadow-lg overflow-hidden transition-all duration-300"
                            style={{
                                transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
                                zIndex,
                                opacity,
                            }}
                        >
                            <img
                                src={image}
                                alt={`Card ${index}`}
                                className="w-full h-full object-contain"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                }}
                            />
                        </div>
                    );
                })}
                
                {/* Flecha Izquierda */}
                <button 
                    onClick={handlePrev}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 focus:outline-none transition-transform duration-300 hover:scale-110"
                    style={{ width: '48px', height: '48px' }}
                >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                
                {/* Flecha Derecha */}
                <button 
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 focus:outline-none transition-transform duration-300 hover:scale-110"
                    style={{ width: '48px', height: '48px' }}
                >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default StackedCards;