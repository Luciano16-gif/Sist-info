// GalleryPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../../firebase-config'; // Remove 'storage' import
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, query, where, getDocs, arrayRemove } from 'firebase/firestore';
import './GalleryPage.css';
import storageService from '../../../cloudinary-services/storage-service'; // Import the new storage service


function GalleryPage() {
    const [images, setImages] = useState([]); // All images for display
    const [userImages, setUserImages] = useState([]); // Current user's images (for deletion)
    const imageContainerRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const modalImageRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); // Keep for visual feedback
    const [showDeleteImages, setShowDeleteImages] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                await loadUserImages(user.email);
            } else {
                setUserImages([]);
            }
            // Load all images whenever the user changes (login/logout)
            loadAllImages();
        });
        return () => unsubscribe();
    }, []);

    // Load ALL images (Firestore + Mock), filtering out reported images
    useEffect(() => {
      loadAllImages();
    }, []);

    const scrollLeft = () => {
        if (imageContainerRef.current) {
            imageContainerRef.current.scrollBy({
                left: -440,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (imageContainerRef.current) {
            imageContainerRef.current.scrollBy({
                left: 440,
                behavior: 'smooth'
            });
        }
    };

    const openImage = (image) => {
        if (!showDeleteImages) {
            setSelectedImage(image);
            setZoomLevel(1);
            setDragOffset({ x: 0, y: 0 });
        } else {
            setSelectedImage(image);
        }
    };

    const closeImage = (event) => {
        event.stopPropagation();
        setSelectedImage(null);
        setZoomLevel(1);
        setDragOffset({ x: 0, y: 0 });
    };

    const handleZoomIn = () => {
        setZoomLevel(prevZoom => Math.min(prevZoom + 0.2, 3));
    };

    const handleZoomOut = () => {
        setZoomLevel(prevZoom => Math.max(prevZoom - 0.2, 0.4));
    };

    const handleWheel = (event) => {
        if (selectedImage && !showDeleteImages) {
            event.preventDefault();
            if (event.deltaY < 0) {
                handleZoomIn();
            } else {
                handleZoomOut();
            }
        }
    };

    const handleMouseDown = (event) => {
        if (selectedImage && !showDeleteImages) {
            event.preventDefault();
            setIsDragging(true);
            setDragStart({ x: event.clientX - dragOffset.x, y: event.clientY - dragOffset.y });
        }
    };

    const handleMouseMove = (event) => {
        if (!isDragging) return;
        const x = event.clientX - dragStart.x;
        const y = event.clientY - dragStart.y;
        setDragOffset({ x, y });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (event) => {
        if (selectedImage && !showDeleteImages) {
            setIsDragging(true);
            setDragStart({
                x: event.touches[0].clientX - dragOffset.x,
                y: event.touches[0].clientY - dragOffset.y,
            });
        }
    };

    const handleTouchMove = (event) => {
        if (!isDragging) return;
        const x = event.touches[0].clientX - dragStart.x;
        const y = event.touches[0].clientY - dragStart.y;  // Removed type annotation
        setDragOffset({ x, y });
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Invalid file type. Only PNG, JPEG, and WebP images are allowed.');
            return;
        }

        setUploading(true);
        setUploadProgress(0); // Reset progress

        try {
            // Use the new storageService to upload
            const uploadResult = await storageService.uploadFile('gallery', file);
            setUploadProgress(100); // Instantly set to 100, since we don't have granular progress
            alert('File uploaded successfully!');


            if (auth.currentUser) {
                try {
                    const user = auth.currentUser;
                    const usersCollection = collection(db, 'lista-de-usuarios');
                    const userQuery = query(usersCollection, where("email", "==", user.email));
                    const userQuerySnapshot = await getDocs(userQuery);

                    if (userQuerySnapshot.empty) {
                        console.error('User not found in Firestore.');
                        return;
                    }

                    const userDoc = userQuerySnapshot.docs[0];
                    const userData = userDoc.data();
                    const userName = `${userData.name} ${userData.lastName}`;

                    const now = new Date();
                    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}/${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

                    const galleryCollection = collection(db, 'Galeria de Imágenes');
                    // *** CHANGE HERE: Use user.email as document ID ***
                    const userGalleryDocRef = doc(galleryCollection, user.email);
                    const userGalleryDocSnap = await getDoc(userGalleryDocRef);

                    const imageData = {
                        url: uploadResult.downloadURL, // Use the URL from Cloudinary
                        uploadedBy: userName,  // Keep userName for display
                        uploadDate: formattedDate
                    };

                    if (userGalleryDocSnap.exists()) {
                        await updateDoc(userGalleryDocRef, {
                            images: arrayUnion(imageData) //Removed the email field.
                        });
                        console.log("Image URL added to existing gallery document.");
                    } else {
                        await setDoc(userGalleryDocRef, {
                            images: [imageData] //Removed the email field.
                        });
                        console.log("New gallery document created.");
                    }

                    const newImageData = {
                        url: uploadResult.downloadURL,
                        uploadedBy: userName,
                        uploadDate: formattedDate
                    };
                    setImages(prevImages => [...prevImages, newImageData]);
                    await loadUserImages(user.email); // Reload *user* images

                } catch (firestoreError) {
                    console.error("Error updating Firestore:", firestoreError);
                    alert("Error saving image to user's gallery: " + firestoreError.message);
                }
            } else {
                console.error("No user logged in.");
                alert("Please log in to upload images.");
            }
        } catch (uploadError) {
            console.error("Upload failed:", uploadError);
            alert("Error uploading file: " + uploadError.message);
        } finally {
            setUploading(false); // Ensure this is always reset
            setUploadProgress(0);
        }
    };

    const loadUserImages = async (userEmail) => {
        try {
            // No need to query 'Lista de Usuarios' here, we have the email directly
            const galleryCollection = collection(db, 'Galeria de Imágenes');
             // *** CHANGE HERE: Use userEmail as document ID ***
            const userGalleryDocRef = doc(galleryCollection, userEmail);
            const userGalleryDocSnap = await getDoc(userGalleryDocRef);

            if (userGalleryDocSnap.exists()) {
                const galleryData = userGalleryDocSnap.data();
                if (galleryData.images && Array.isArray(galleryData.images)) {
                    setUserImages(galleryData.images);  // Update *userImages*
                } else {
                    setUserImages([]);
                }
            } else {
                setUserImages([]);
            }
        } catch (error) {
            console.error("Error loading user images:", error);
            alert("Error loading images: " + error.message);
        }
    };

    const toggleDeleteMode = () => {
        setSelectedImage(null);
        setShowDeleteImages(!showDeleteImages);

        if (!showDeleteImages) {
            // Switch to user images for deletion
            setImages(userImages);
        } else {
            // Switch back to all images
            loadAllImages();
        }
    };
const loadAllImages = async () => {
    try {
        const galleryCollection = collection(db, 'Galeria de Imágenes');
        const querySnapshot = await getDocs(galleryCollection);
        let firestoreImages = [];

        querySnapshot.forEach((doc) => {
            const galleryData = doc.data();
            if (galleryData.images && Array.isArray(galleryData.images)) {
                galleryData.images.forEach(image => {
                    // **FIX:** Check if image.url exists before using .split()
                    if (image.url) {
                        firestoreImages.push(image);
                    } else {
                        console.warn("Skipping image with missing URL:", image);
                    }
                });
            }
        });

        // Get reported images for the current user
        let reportedImageRefs = [];
        if (auth.currentUser) {
            const reportedImagesCollection = collection(db, 'Imágenes Reportadas');
            const reporterDocRef = doc(reportedImagesCollection, auth.currentUser.email);
            const reporterDocSnap = await getDoc(reporterDocRef);

            if (reporterDocSnap.exists()) {
                const reportedData = reporterDocSnap.data();
                // **FIX:** Ensure reportedData.images exists and is an array
                if (reportedData.images && Array.isArray(reportedData.images)) {
                  reportedImageRefs = reportedData.images.map(image => image.imageRef);
                }
            }
        }

        // Filter out reported images
        firestoreImages = firestoreImages.filter(image => {
            // Use the publicId for comparison if available, otherwise fallback to URL
            const imageIdentifier = image.publicId || image.url;
            return !reportedImageRefs.includes(imageIdentifier);

        });


        // Combine Firestore images with mock images, avoiding duplicates  (NO MOCK IMAGES NOW)
        //const allImages = [...mockImages];
        let allImages = []; // Start with an empty array
        firestoreImages.forEach(firestoreImage => {
            if (!allImages.some(img => img.url === firestoreImage.url)) {
                allImages.push(firestoreImage);
            }
        });

        setImages(allImages); // Set the combined and filtered array
    } catch (error) {
        console.error("Error loading all images:", error);
        alert("Error loading images: " + error.message);
    }
};



    const handleDeleteImage = async () => {
        if (!selectedImage) {
            alert("Por favor, selecciona una imagen para borrar.");
            return;
        }

        if (!auth.currentUser) {
            alert("Por favor, inicia sesión para borrar imágenes.");
            return;
        }
        const publicId = selectedImage.publicId || storageService.ref(selectedImage.url).fullPath

        if (!publicId) {
           console.error("Could not determine publicId for deletion.");
           alert("Error: Could not determine image ID for deletion.");
           return;
         }

        try {
            // 1. Delete from Cloudinary
            await storageService.deleteFile(publicId);

            // 2. Delete from Firestore
            const user = auth.currentUser;
             // *** CHANGE HERE: Use user.email as document ID ***
            const galleryCollection = collection(db, 'Galeria de Imágenes');
            const userGalleryDocRef = doc(galleryCollection, user.email); // Use email

            await updateDoc(userGalleryDocRef, {
                images: arrayRemove(selectedImage)  // Remove the image object
            });

            // 3. Update Local State
            setUserImages(prevImages => prevImages.filter(img => img.url !== selectedImage.url)); // Remove from userImages.

            //Since now we are working with all images and user images, we have to filter in both states
            setImages(prevImages => prevImages.filter(img => img.url !== selectedImage.url));
            setSelectedImage(null);  // Clear selected image (close modal)
            alert("Imagen borrada exitosamente.");
            await loadUserImages(auth.currentUser.email); //  Reload images after adding

        } catch (error) {
            console.error("Error deleting image:", error);
            alert("Error al borrar la imagen: " + error.message);
        }
    };

const reportImage = async (image) => {
    if (!auth.currentUser) {
        alert("Por favor, inicia sesión para reportar imágenes.");
        return;
    }

    const reporterEmail = auth.currentUser.email;
    const uploaderEmail = image.uploadedBy;
    // *** CHANGE:  We now have the uploader's email directly ***
    // No need to query the 'Lista de Usuarios' collection

    // Prevent self-reporting:
    if (reporterEmail === image.uploadedBy) { //uploadedBy now it's the email
        alert("No puedes reportar tus propias imágenes.");
        return;
    }

     const imageIdentifier = image.publicId || image.url;
    const imageRef = imageIdentifier;

    try {
        const reportedImagesCollection = collection(db, 'Imágenes Reportadas');
        const reporterDocRef = doc(reportedImagesCollection, reporterEmail);
        const reporterDocSnap = await getDoc(reporterDocRef);

        const reportData = {
            imageRef: imageRef,
            uploaderEmail: image.uploadedBy // Store the uploader's email directly
        };

        if (reporterDocSnap.exists()) {
            await updateDoc(reporterDocRef, {
                images: arrayUnion(reportData)
            });
            console.log("Image report added to existing document.");
        } else {
            await setDoc(reporterDocRef, {
                images: [reportData]
            });
            console.log("New report document created.");
        }

        // Remove the image from the *current user's* view
        setImages(prevImages => prevImages.filter(img => img.url !== image.url));
        alert("Imagen reportada exitosamente.");

    } catch (error) {
        console.error("Error reporting image:", error);
        alert("Error al reportar la imagen: " + error.message);
    }
};



    return (
        <div className="galeria-page-gallery">
            <h1 className="title-gallery">GALERIA</h1>
            <div className="gallery-content-gallery">
                <button className="scroll-button-gallery left-gallery" onClick={scrollLeft}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <div className="image-container-gallery" ref={imageContainerRef}>
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image.url}
                            alt={`Imagen ${index}`}
                            className={`gallery-image-gallery ${selectedImage?.url === image.url && showDeleteImages ? 'selected-gallery' : ''}`}
                            onClick={() => openImage(image)}
                        />
                    ))}
                </div>
                <button className="scroll-button-gallery right-gallery" onClick={scrollRight}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
            <div className="button-container-gallery">
                {!showDeleteImages ? (
                    <>
                        <input type="file" id="file-upload" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                        <button className="mount-archive-button-gallery" onClick={() => document.getElementById('file-upload').click()}>
                            Subir Archivo
                        </button>
                    </>
                ) : (
                    <button className="delete-archive-button-gallery" onClick={handleDeleteImage}>
                        Borrar Imagen
                    </button>
                )}
                <button className="delete-archive-button-gallery" onClick={toggleDeleteMode}>
                    {showDeleteImages ? "Cancelar" : "Borrar Archivo"}
                </button>
            </div>

            {uploading && (
                <div className="upload-progress-bar-container-gallery">
                    <div className="upload-progress-bar-gallery" style={{ width: `${uploadProgress}%` }}></div>
                </div>
            )}

            {selectedImage && !showDeleteImages && (
                <div className="modal-overlay-gallery" onWheel={handleWheel}>
                    {/* Close button (ensured it's always visible) */}

                    <div className="modal-content-container-gallery"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="close-button-gallery" onClick={(e) => { e.stopPropagation(); closeImage(e); }}>
                            X
                        </button>
                        <button
                            className="report-button-gallery"
                            onClick={(e) => {
                                e.stopPropagation();
                                reportImage(selectedImage);
                            }}
                        >
                            Reportar imagen
                        </button>
                        <img
                            src={selectedImage.url}
                            alt="Imagen Ampliada"
                            className="modal-image-gallery"
                            style={{
                                transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                                cursor: isDragging ? 'grabbing' : 'grab',
                            }}
                            ref={modalImageRef}
                            onClick={(e) => e.stopPropagation()}
                        />

                        <div className="image-info-gallery">
                            <p>Publicado por: {selectedImage.uploadedBy}</p>
                            <p>Fecha: {selectedImage.uploadDate}</p>
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
}

export default GalleryPage;