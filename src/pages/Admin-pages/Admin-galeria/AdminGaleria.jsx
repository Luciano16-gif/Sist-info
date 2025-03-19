// AdminGaleria.jsx
import React, { useState, useEffect, useRef } from 'react';
import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection";
import { adminBaseStyles } from '../../../components/Admin-components/adminBaseStyles';
import useGalleryMetrics from '../../../components/hooks/gallery-hooks/useGalleryMetrics'; // Correct path
import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import './AdminGaleria.css';  // Make sure this path is correct
import { useNavigate } from 'react-router-dom'; // Import if you use it
import LoadingState from '../../../components/common/LoadingState/LoadingState';

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay-gallery">
            <div className="modal-content-container-gallery delete-modal">
                <p>{message || "¿Estás seguro de que quieres borrar esta imagen?"}</p>
                <div className="modal-buttons">
                    <button className="confirm-button" onClick={onConfirm}>Confirmar</button>
                    <button className="cancel-button" onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

const AdminGaleria = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const {
        publishedImages,
        reportedImages,
        participatingUsers,
        createdHashtags,
        usedHashtags,
        loading,
        error
    } = useGalleryMetrics(refreshTrigger);

    // Local metrics state for immediate updates
    const [localMetrics, setLocalMetrics] = useState({
        publishedImages: 0,
        reportedImages: 0,
        participatingUsers: 0,
        createdHashtags: 0,
        usedHashtags: 0
    });

    // Update local metrics when the fetched metrics change
    useEffect(() => {
        if (!loading && !error) {
            setLocalMetrics({
                publishedImages,
                reportedImages,
                participatingUsers,
                createdHashtags,
                usedHashtags
            });
        }
    }, [publishedImages, reportedImages, participatingUsers, createdHashtags, usedHashtags, loading, error]);

    const [adminImages, setAdminImages] = useState([]);
    const [loadingImages, setLoadingImages] = useState(true);
    const [imagesError, setImagesError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    
    // New states for image deletion
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);
    const [deletingImageUrl, setDeletingImageUrl] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    
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
                            // Add userId to each image object for reference
                            const imagesWithUser = userData.images.map(img => ({
                                ...img,
                                userId: userDoc.id
                            }));
                            firestoreImages = [...firestoreImages, ...imagesWithUser];
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
    }, [refreshTrigger]);

    const openImage = (image) => {
        setSelectedImage(image);
        setZoomLevel(1);
        setDragOffset({ x: 0, y: 0 });
    };

    const closeImage = () => {
        setSelectedImage(null);
    };

    // Add delete image functionality
    const handleDeleteImage = (image) => {
        setImageToDelete(image);
        setIsDeleteModalOpen(true);
        // If there's an open detail view, close it
        setSelectedImage(null);
    };
    
    const handleConfirmDelete = async () => {
        if (!imageToDelete) return;
        
        setDeleteError(null);
        try {
            // Mark the image as deleting to start animation
            setDeletingImageUrl(imageToDelete.url);
            
            // Update local metrics immediately for a responsive UI feel
            setLocalMetrics(prev => ({
                ...prev,
                publishedImages: Math.max(0, prev.publishedImages - 1)
            }));
            
            // Wait for animation before actual deletion
            setTimeout(async () => {
                const { userId, url } = imageToDelete;
                
                // Get the user's gallery document
                const userGalleryRef = doc(db, 'Galeria de Imágenes', userId);
                const userGallerySnap = await getDoc(userGalleryRef);
                
                if (userGallerySnap.exists()) {
                    const galleryData = userGallerySnap.data();
                    
                    // Filter out the image to delete
                    const updatedImages = galleryData.images.filter(img => img.url !== url);
                    
                    // Update the document with the new images array
                    await updateDoc(userGalleryRef, { images: updatedImages });
                    
                    // Update local state to remove the deleted image
                    setAdminImages(prev => prev.filter(img => img.url !== url));
                    
                    // Trigger a refresh of metrics
                    setRefreshTrigger(prev => prev + 1);
                    
                    console.log("Image deleted successfully:", url);
                } else {
                    console.error("User gallery document not found:", userId);
                    throw new Error("Documento de galería no encontrado");
                }
                
                // Reset the deleting state
                setDeletingImageUrl(null);
                
            }, 500); // Match CSS transition time
            
        } catch (err) {
            console.error("Error deleting image:", err);
            setDeleteError("Error al eliminar la imagen: " + err.message);
            setDeletingImageUrl(null);
            
            // Revert local metrics on error
            if (!loading && !error) {
                setLocalMetrics({
                    publishedImages,
                    reportedImages,
                    participatingUsers,
                    createdHashtags,
                    usedHashtags
                });
            }
        } finally {
            setIsDeleteModalOpen(false);
            setImageToDelete(null);
        }
    };
    
    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setImageToDelete(null);
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
        <div className={`inset-0 mx-4 md:mx-8 lg:mx-32 my-8 flex flex-col justify-start items-start px-4 md:px-8 lg:px-16 ${adminBaseStyles}`}>
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold">
                Galería
            </h1>
            <h1 className="text-white text-base md:text-lg">
                Representa el espacio donde nuestros usuarios y guías podrán echar un vistazo
                de cómo son las actividades que ofrecemos.
            </h1>
            <hr className="border-1 border-white-600 w-full md:w-96" />
            <h1 className="text-white text-2xl md:text-3xl font-bold">
                Información relevante
            </h1>
            <div className="flex flex-wrap justify-start gap-4 md:gap-6 lg:gap-10 my-4">
                <RelevantInfoS number={localMetrics.publishedImages} description="Imágenes publicadas" />
                <RelevantInfoS number={localMetrics.reportedImages} description="Imágenes reportadas" />
                <RelevantInfoS number={localMetrics.participatingUsers} description="Usuarios participantes" />
                <RelevantInfoS number={localMetrics.createdHashtags} description="Hashtags creados" />
                <RelevantInfoS number={localMetrics.usedHashtags} description="Hashtags usados" />
            </div>
            <div className="flex flex-col">
                <h2 className="text-xl md:text-2xl lg:text-4xl font-bold text-white mr-4">Nuestra Galería</h2>
                <h2 className="text-xs md:text-sm text-white mr-4">Selecciona una imagen para obtener
                    los detalles de la misma o eliminarla de nuestra galería
                </h2>
            </div>
            <div className="admin-gallery-grid">
                {adminImages.map((image, index) => (
                    <div 
                        key={index} 
                        className={`admin-gallery-image-container ${deletingImageUrl === image.url ? 'deleting' : ''}`}
                    >
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
                        <button 
                            className="delete-button-modal" 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                // Set the image to delete directly
                                setImageToDelete(selectedImage);
                                // Close the image modal
                                closeImage();
                                // Open the confirmation modal with a delay to ensure proper sequence
                                setTimeout(() => {
                                    setIsDeleteModalOpen(true);
                                }, 100);
                            }}
                        >
                            Eliminar imagen
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

            {/* Render the deletion confirmation modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                message="¿Estás seguro de que quieres borrar esta imagen?"
            />
        </div>
    );
};

export default AdminGaleria;