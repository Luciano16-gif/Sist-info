// GalleryPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { storage, db, auth } from '../../../firebase-config';
import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, query, where, getDocs, arrayRemove } from 'firebase/firestore';
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
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showDeleteImages, setShowDeleteImages] = useState(false);
    const [userImages, setUserImages] = useState([]);
    const [imageMetadata, setImageMetadata] = useState({}); // New state for metadata


    const [mockImages, setMockImages] = useState([
        "..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png",
        "..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png",
        "..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png",
        "..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png",
        "..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png",
        "..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png",
        // ... more images
    ]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                await loadUserImages(user.email);
            } else {
              setUserImages([]);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (showDeleteImages) {
            setImages(userImages);
        } else {
            const allImages = [...mockImages];
            userImages.forEach(userImage => {
                if (!allImages.includes(userImage)) {
                    allImages.push(userImage);
                }
            });
            setImages(allImages);
        }
    }, [userImages, showDeleteImages, mockImages]);


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

  const openImage = (imageUrl) => {
    // Only open the modal if NOT in delete mode.
    if (!showDeleteImages) {
        setSelectedImage(imageUrl);
        setZoomLevel(1);
        setDragOffset({ x: 0, y: 0 });
    }
    // If in delete mode, selecting the image will set the selected image.
    else {
        setSelectedImage(imageUrl)
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
        const y = event.touches[0].clientY - dragStart.y;
        setDragOffset({ x, y });
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        setUploadProgress(0);

        const storageRef = ref(storage, `gallery/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Upload failed:", error);
                alert("Error uploading file: " + error.message);
                setUploading(false);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                setUploading(false);
                alert('File uploaded successfully!');

                if (auth.currentUser) {
                    try {
                        const user = auth.currentUser;
                        const usersCollection = collection(db, 'Lista de Usuarios');
                        const userQuery = query(usersCollection, where("email", "==", user.email));
                        const userQuerySnapshot = await getDocs(userQuery);

                        if (userQuerySnapshot.empty) {
                            console.error('User not found in Firestore.');
                            return;
                        }

                        const userDoc = userQuerySnapshot.docs[0];
                        const userDocRef = userDoc.ref;
                        const userData = userDoc.data();
                        const userName = `${userData.name} ${userData.lastName}`;

                        const galleryCollection = collection(db, 'Galeria de Imágenes');
                        const userGalleryDocRef = doc(galleryCollection, userName);
                        const userGalleryDocSnap = await getDoc(userGalleryDocRef);

                         // Get current date and time
                        const now = new Date();
                        const uploadDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}/${now.getHours()}:${now.getMinutes()}`;


                        if (userGalleryDocSnap.exists()) {
                            await updateDoc(userGalleryDocRef, {
                                email: user.email,
                                images: arrayUnion(downloadURL),
                                 // Add metadata to Firestore.  Store as a map (object)
                                uploadDates: arrayUnion({ url: downloadURL, date: uploadDate, uploader: userName })

                            });
                            console.log("Image URL added to existing gallery document.");

                        } else {
                            await setDoc(userGalleryDocRef, {
                                email: user.email,
                                images: [downloadURL],
                                // Add metadata. Store as a map.
                                uploadDates: [{ url: downloadURL, date: uploadDate, uploader: userName}]
                            });
                            console.log("New gallery document created.");
                        }
                         await loadUserImages(user.email); //  Reload images after adding.
                         // Add image metadata to local state.
                        setImageMetadata(prevMetadata => ({
                            ...prevMetadata,
                            [downloadURL]: { uploader: userName, date: uploadDate }
                        }));
                    } catch (firestoreError) {
                        console.error("Error updating Firestore:", firestoreError);
                        alert("Error saving image to user's gallery: " + firestoreError.message);
                    }
                } else {
                    console.error("No user logged in.");
                    alert("Please log in to upload images.");
                    return;
                }
            }
        );
    };


    const loadUserImages = async (userEmail) => {
      try {
        const usersCollection = collection(db, 'Lista de Usuarios');
        const userQuery = query(usersCollection, where("email", "==", userEmail));
        const userQuerySnapshot = await getDocs(userQuery);
        if (userQuerySnapshot.empty) {
            console.error('User not found in Firestore when loading images');
            return;
        }
        const userDoc = userQuerySnapshot.docs[0];
        const userData = userDoc.data();
        const userName = `${userData.name} ${userData.lastName}`;

        const galleryCollection = collection(db, 'Galeria de Imágenes');
        const userGalleryDocRef = doc(galleryCollection, userName);
        const userGalleryDocSnap = await getDoc(userGalleryDocRef);

        if (userGalleryDocSnap.exists()) {
          const galleryData = userGalleryDocSnap.data();
            if (galleryData.images && Array.isArray(galleryData.images)) {
                setUserImages(galleryData.images);

                // Load image metadata
                if (galleryData.uploadDates && Array.isArray(galleryData.uploadDates)) {
                    const newMetadata = {};
                    galleryData.uploadDates.forEach(item => {
                      if(item.url && item.date && item.uploader){ //Important, check if item.url exists
                        newMetadata[item.url] = { uploader: item.uploader, date: item.date };
                      }
                    });
                    setImageMetadata(newMetadata); // This sets ALL metadata at once.
                } else {
                    setImageMetadata({}); // Clear/reset metadata if none found
                }
            } else {
                setUserImages([]);
                setImageMetadata({}); // Clear metadata if no images
            }
        } else {
          setUserImages([]);
          setImageMetadata({}); // Clear metadata if no images
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
            if (auth.currentUser) {
              loadUserImages(auth.currentUser.email);
            }
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

        try {
            // 1. Delete from Firebase Storage
            const imageRef = ref(storage, selectedImage);
            await deleteObject(imageRef);

            // 2. Delete from Firestore
            const user = auth.currentUser;
            const usersCollection = collection(db, 'Lista de Usuarios');
            const userQuery = query(usersCollection, where("email", "==", user.email));
            const userQuerySnapshot = await getDocs(userQuery);

            if (userQuerySnapshot.empty) {
                console.error('User not found in Firestore.');
                return;
            }

            const userDoc = userQuerySnapshot.docs[0];
            const userDocRef = userDoc.ref;
            const userData = userDoc.data();
            const userName = `${userData.name} ${userData.lastName}`;

            const galleryCollection = collection(db, 'Galeria de Imágenes');
            const userGalleryDocRef = doc(galleryCollection, userName);

            // Remove both the URL and the metadata entry.
            await updateDoc(userGalleryDocRef, {
              images: arrayRemove(selectedImage),
              uploadDates: arrayRemove(imageMetadata[selectedImage] ? {url: selectedImage, ...imageMetadata[selectedImage]} : null) //Remove image metadata
            });


            // 3. Update Local State
              setUserImages(prevImages => prevImages.filter(imgUrl => imgUrl !== selectedImage)); // Remove from userImages.
            //Remove the image from images array, only if we are NOT in showDeleteImages,
            // if we are, we don't want to remove it from the general array, only from userImages
            if(!showDeleteImages){
                setImages(prevImages => prevImages.filter(imgUrl => imgUrl !== selectedImage));
            }
            setSelectedImage(null);  // Clear selected image (close modal)
            alert("Imagen borrada exitosamente.");
            // Remove metadata for the deleted image.
            setImageMetadata(prevMetadata => {
                const newMetadata = { ...prevMetadata };
                delete newMetadata[selectedImage]; // Remove the entry
                return newMetadata;
            });
            await loadUserImages(auth.currentUser.email); //  Reload images after adding

        } catch (error) {
            console.error("Error deleting image:", error);
            alert("Error al borrar la imagen: " + error.message);
        }
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
                            className={`gallery-image ${selectedImage === imageUrl && showDeleteImages ? 'selected' : ''}`}
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
                {!showDeleteImages ? (
                    <>
                        <input type="file" id="file-upload" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                        <button className="mount-archive-button" onClick={() => document.getElementById('file-upload').click()}>
                            Subir Archivo
                        </button>
                    </>
                ) : (
                    <button className="delete-archive-button" onClick={handleDeleteImage}>
                        Borrar Imagen
                    </button>
                )}
                 <button className="delete-archive-button" onClick={toggleDeleteMode}>
                        {showDeleteImages ? "Cancelar" : "Borrar Archivo"}
                 </button>
            </div>

             {uploading && (
                <div className="upload-progress-bar-container">
                    <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                </div>
            )}

            {/* Conditionally render the modal based on selectedImage AND showDeleteImages */}
            {selectedImage && !showDeleteImages && (
                <div className="modal-overlay" onWheel={handleWheel}>
                    <button className="close-button" onClick={(e) => { e.stopPropagation(); closeImage(e); }}>
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
                        onClick={(e) => e.stopPropagation()} // Prevent close on container click
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
                            onClick={(e) => e.stopPropagation()} // Prevent close on image click
                        />
                        {/* Display image metadata */}
                        {imageMetadata[selectedImage] && (
                            <div className="image-info">
                                <p>Subido por: {imageMetadata[selectedImage].uploader}</p>
                                <p>Fecha y hora: {imageMetadata[selectedImage].date}</p>
                            </div>
                        )}

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