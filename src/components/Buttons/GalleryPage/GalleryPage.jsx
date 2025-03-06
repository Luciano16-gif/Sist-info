// GalleryPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { storage } from '../../../firebase-config';
import './GalleryPage.css';

function GalleryPage() {
    const [images, setImages] = useState([]);
    const imageContainerRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const modalImageRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });


    useEffect(() => {
        // Mock images (replace with actual Firebase Storage loading)
        const mockImages = [
            "..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png",
           "..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png",
           "..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png",
           "..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png",
           "..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png",
           "..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png",
           "..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png",
           "..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png",
            // ... more images
        ];
        setImages(mockImages);
    }, []);

    const scrollLeft = () => {
        if (imageContainerRef.current) {
            imageContainerRef.current.scrollBy({
                left: -440, // (image width + gap) = (400 + 40)
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (imageContainerRef.current) {
            imageContainerRef.current.scrollBy({
                left: 440,  // (image width + gap) = (400 + 40)
                behavior: 'smooth'
            });
        }
    };

    const openImage = (imageUrl) => {
        setSelectedImage(imageUrl);
        setZoomLevel(1); // Reset zoom
        setDragOffset({ x: 0, y: 0 }); // Reset drag offset.  CRUCIAL for correct panning.
    };

    //Crucially, we are NOT stopping propagation here
    const closeImage = () => {
        setSelectedImage(null);
        setZoomLevel(1);       // Reset on close
        setDragOffset({x:0, y:0})  //Reset on close
    };

    const handleZoomIn = () => {
        setZoomLevel(prevZoom => Math.min(prevZoom + 0.2, 3));
    };

    const handleZoomOut = () => {
        setZoomLevel(prevZoom => Math.max(prevZoom - 0.2, 0.4));
    };

     const handleWheel = (event) => {
        if (selectedImage) {
            event.preventDefault();
            if (event.deltaY < 0) {
                handleZoomIn();
            } else {
              handleZoomOut();
            }
        }
    };

    // --- Mouse Event Handlers ---
    const handleMouseDown = (event) => {
        if (selectedImage) {
            event.preventDefault(); // Prevent default behavior, like text selection
            setIsDragging(true);
            // Use clientX/Y for mouse events.
            setDragStart({ x: event.clientX - dragOffset.x, y: event.clientY - dragOffset.y });

        }
    };

    const handleMouseMove = (event) => {
        if (!isDragging) return;
        //Use clientX/Y for mouse events.
        const x = event.clientX - dragStart.x;
        const y = event.clientY - dragStart.y;
        setDragOffset({ x, y });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false); // Stop dragging if mouse leaves
    };

     // --- Touch Event Handlers (for mobile) ---
    const handleTouchStart = (event) => {
        if(selectedImage){
            setIsDragging(true);
            // Use touches[0] for touch events.
            setDragStart({
                x: event.touches[0].clientX - dragOffset.x,
                y: event.touches[0].clientY - dragOffset.y,
            });
        }
    };

    const handleTouchMove = (event) => {
        if (!isDragging) return;
        // Use touches[0] for touch events.
        const x = event.touches[0].clientX - dragStart.x;
        const y = event.touches[0].clientY - dragStart.y;
        setDragOffset({ x, y });

    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    return (
        <div className="galeria-page">
            <h1 className="title">GALERIA</h1>
            <div className="gallery-content">
                <button className="scroll-button left" onClick={scrollLeft}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <div className="image-container" ref={imageContainerRef}>
                    {images.map((imageUrl, index) => (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={`Imagen ${index}`}
                            className="gallery-image"
                            onClick={() => openImage(imageUrl)}
                        />
                    ))}
                </div>
                <button className="scroll-button right" onClick={scrollRight}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
            <div className="button-container">
                <button className="mount-archive-button">Montar Archivo</button>
                <button className="delete-archive-button">Borrar Archivo</button>
            </div>

            {selectedImage && (
                <div className="modal-overlay"  onWheel={handleWheel}>  {/* Remove onClick here */}
                {/*Close button moved outside modal-content-container*/}
                <button className="close-button" onClick={(e) => {e.stopPropagation(); closeImage(e);}}>
                  X
                </button>
                <div className="modal-content-container"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onClick={(e) => e.stopPropagation()} // PREVENT CLOSE ON CONTAINER CLICK
                    >
                    <img
                        src={selectedImage}
                        alt="Imagen Ampliada"
                        className="modal-image"
                        style={{
                            transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                            cursor: isDragging ? 'grabbing' : 'grab',
                        }}
                        ref={modalImageRef}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div className="zoom-controls">
                        <button onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}>+</button>
                        <button onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}>-</button>
                    </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GalleryPage;