// AdminGaleria.jsx
import React, { useState, useEffect, useRef } from 'react';
import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection";
import { adminBaseStyles } from '../../../components/Admin-components/adminBaseStyles';
import useGalleryMetrics from '../../../components/hooks/gallery-hooks/useGalleryMetrics'; // Correct path
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import './AdminGaleria.css';  // Make sure this path is correct
import { useNavigate } from 'react-router-dom'; // Import if you use it
import LoadingState from '../../../components/common/LoadingState/LoadingState';

const AdminGaleria = () => {
    const {
        publishedImages,
        reportedImages,
        participatingUsers,
        createdHashtags,
        usedHashtags,
        loading,
        error
    } = useGalleryMetrics();

    const [adminImages, setAdminImages] = useState([]);
    const [loadingImages, setLoadingImages] = useState(true);
    const [imagesError, setImagesError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const navigate = useNavigate(); //  If you don't use navigate, you can remove this

    useEffect(() => {
        const loadAllImages = async () => {
            try {
                setLoadingImages(true);
                setImagesError(null);
                const galleryCollection = collection(db, 'Galeria de Imágenes');
                const querySnapshot = await getDocs(galleryCollection);
                let firestoreImages = [];

                for (const userDoc of querySnapshot.docs) {
                    const userDocRef = doc(db, 'Galeria de Imágenes', userDoc.id);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        if (userData.images && Array.isArray(userData.images)) {
                            firestoreImages = [...firestoreImages, ...userData.images];
                        }
                    }
                }
                setAdminImages(firestoreImages);
            } catch (error) {
                console.error("Error loading images from Firestore:", error);
                setImagesError(error);
            } finally {
                setLoadingImages(false);
            }
        };

        loadAllImages();
    }, []);

    const openImage = (image) => {
        setSelectedImage(image);
        setZoomLevel(1);
        setDragOffset({ x: 0, y: 0 });
    };

    const closeImage = () => {
        setSelectedImage(null);
    };

    const handleZoomIn = () => setZoomLevel(prevZoom => Math.min(prevZoom + 0.2, 3));
    const handleZoomOut = () => setZoomLevel(prevZoom => Math.max(prevZoom - 0.2, 0.4));
    const handleWheel = (event) => {
        event.preventDefault();
        event.deltaY < 0 ? handleZoomIn() : handleZoomOut();
    };
    const handleMouseDown = (event) => {
        event.preventDefault();
        setIsDragging(true);
        setDragStart({ x: event.clientX - dragOffset.x, y: event.clientY - dragOffset.y });
    };
    const handleMouseMove = (event) => {
        if (!isDragging) return;
        const x = event.clientX - dragStart.x;
        const y = event.clientY - dragStart.y;
        setDragOffset({ x, y });
    };
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseLeave = () => setIsDragging(false);
    const handleTouchStart = (event) => {
        setIsDragging(true);
        setDragStart({
            x: event.touches[0].clientX - dragOffset.x,
            y: event.touches[0].clientY - dragOffset.y,
        });
    };
    const handleTouchMove = (event) => {
        if (!isDragging) return;
        const x = event.touches[0].clientX - dragStart.x;
        const y = event.touches[0].clientY - dragStart.y;
        setDragOffset({ x, y });
    };
    const handleTouchEnd = () => setIsDragging(false);

    if (loading || loadingImages) {
        return <LoadingState text='Cargando métricas de galería...' />;
    }

    if (error || imagesError) {
        return <div>Error al cargar las métricas o imágenes: {error?.message || imagesError?.message}</div>;
    }

    return (
        <div className={`overflow-x-scroll my-8 flex flex-col justify-start items-start px-8 md:px-16 ${adminBaseStyles}`}>
            <h1 className=" text-white text-4xl md:text-5xl font-bold">
                Galería
            </h1>
            <h1 className=" text-white text-lg md:text-lg">
                Representa el espacio donde nuestros usuarios y guías podrán echar un vistazo
                de cómo son las actividades que ofrecemos.
            </h1>
            <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
            <h1 className=" text-white text-xl md:text-3xl font-bold">
                Información relevante
            </h1>
            <div className="flex justify-start space-x-10">
                <RelevantInfoS number={publishedImages} description="Imágenes publicadas" />
                <RelevantInfoS number={reportedImages} description="Imágenes reportadas" />
                <RelevantInfoS number={participatingUsers} description="Usuarios participantes" />
                <RelevantInfoS number={createdHashtags} description="Hashtags creados" />
                <RelevantInfoS number={usedHashtags} description="Hashtags usados" />
            </div>
            <div className="flex flex-col">
                <h2 className="text-4xl font-bold text-white mr-4">Nuestra Galería</h2>
                <h2 className="text-sm text-white mr-4">Selecciona una imagen para obtener
                    los detalles de la misma o eliminarla de nuestra galería
                </h2>
            </div>
            <div className="admin-gallery-grid">
                {adminImages.map((image, index) => (
                    <div key={index} className="admin-gallery-image-container">
                        <img
                            src={image.url}
                            alt={`Imagen ${index}`}
                            className="admin-gallery-image"
                            onClick={() => openImage(image)}
                        />
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div className="modal-admin-overlay-gallery" onWheel={handleWheel}>
                    <div
                        className="modal-content-container-gallery"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="close-button-gallery" onClick={(e) => { e.stopPropagation(); closeImage(); }}>
                            X
                        </button>
                        <img
                            src={selectedImage.url}
                            alt="Imagen Ampliada"
                            className="modal-image-gallery"
                            style={{
                                transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                                cursor: isDragging ? "grabbing" : "grab",
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />

                        <div className="image-info-gallery">
                            <p>Publicado por: {selectedImage.uploadedBy}</p>
                            <p>Fecha: {selectedImage.uploadDate}</p>
                            {selectedImage.hashtags && selectedImage.hashtags.length > 0 && (
                                <p>Hashtags: {selectedImage.hashtags.join(", ")}</p>
                            )}
                        </div>

                        <div className="zoom-controls-gallery">
                            <button onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}>+</button>
                            <button onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}>-</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGaleria;