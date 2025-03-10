// GalleryPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { storage, db, auth } from '../../../firebase-config';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, query, where, getDocs, arrayRemove } from 'firebase/firestore';
import './GalleryPage.css';

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
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showDeleteImages, setShowDeleteImages] = useState(false);

    const [mockImages, setMockImages] = useState([
        { url: "..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png", uploadedBy: "Mock User", uploadDate: "01/01/2023/12:00" },
        { url: "..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png", uploadedBy: "Mock User", uploadDate: "01/01/2023/12:00" },
        { url: "..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png", uploadedBy: "Mock User", uploadDate: "01/01/2023/12:00" },
        { url: "..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png", uploadedBy: "Mock User", uploadDate: "01/01/2023/12:00" },
        { url: "..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png", uploadedBy: "Mock User", uploadDate: "01/01/2023/12:00" },
        { url: "..//../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png", uploadedBy: "Mock User", uploadDate: "01/01/2023/12:00" },
    ]);


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
        const y = event.touches[0].clientY - dragStart.y;
        setDragOffset({ x, y });
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // --- FILE TYPE CHECK ---
        const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Invalid file type. Only PNG, JPEG, and WebP images are allowed.');
            return;
        }

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
                        const userData = userDoc.data();
                        const userName = `${userData.name} ${userData.lastName}`;

                        const now = new Date();
                        const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}/${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

                        const galleryCollection = collection(db, 'Galeria de Imágenes');
                        const userGalleryDocRef = doc(galleryCollection, userName);
                        const userGalleryDocSnap = await getDoc(userGalleryDocRef);

                        const imageData = {
                            url: downloadURL,
                            uploadedBy: userName,
                            uploadDate: formattedDate
                        };

                        if (userGalleryDocSnap.exists()) {
                            await updateDoc(userGalleryDocRef, {
                                email: user.email, //Consider removing email, since the doc ID is the username
                                images: arrayUnion(imageData)
                            });
                            console.log("Image URL added to existing gallery document.");
                        } else {
                            await setDoc(userGalleryDocRef, {
                                email: user.email, //Consider removing email, since the doc ID is the username
                                images: [imageData]
                            });
                            console.log("New gallery document created.");
                        }

                         // **CRUCIAL CHANGE:** Update the 'images' state to trigger a re-render
                        const newImageData = {
                            url: downloadURL,
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
            // **FIX:**  Use optional chaining and nullish coalescing for safety
            const imagePath = image.url?.split("/o/")[1]?.split("?")[0] ?? '';
            const decodedImagePath = decodeURIComponent(imagePath);
            return !reportedImageRefs.includes(decodedImagePath);
        });


        // Combine Firestore images with mock images, avoiding duplicates
        const allImages = [...mockImages];
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
        const imageUrl = selectedImage.url;

        try {
            // 1. Delete from Firebase Storage
            const imageRef = ref(storage, imageUrl);
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
            const userData = userDoc.data();
            const userName = `${userData.name} ${userData.lastName}`;

            const galleryCollection = collection(db, 'Galeria de Imágenes');
            const userGalleryDocRef = doc(galleryCollection, userName);

            await updateDoc(userGalleryDocRef, {
                images: arrayRemove(selectedImage)  // Remove the image object
            });

            // 3. Update Local State
            setUserImages(prevImages => prevImages.filter(img => img.url !== imageUrl)); // Remove from userImages.

            //Since now we are working with all images and user images, we have to filter in both states
            setImages(prevImages => prevImages.filter(img => img.url !== imageUrl));
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
      //Get uploader email from 'Lista de Usuarios' collection
    let uploaderEmailReal = "";
    const usersCollection = collection(db, 'Lista de Usuarios');
    const userQuery = query(usersCollection, where("name", "==", uploaderEmail.split(" ")[0])); // Assuming 'name' field contains the first name
    const userQuerySnapshot = await getDocs(userQuery);

    if (!userQuerySnapshot.empty) {
        const userDoc = userQuerySnapshot.docs[0];
        uploaderEmailReal = userDoc.data().email;  // Get real email
    } else {
        console.error("Uploader not found");
        return; // Stop the report action if no user founded
    }
    // **Prevent self-reporting:**
    if (reporterEmail === uploaderEmailReal) {
        alert("No puedes reportar tus propias imágenes.");
        return;
    }

    const imagePath = image.url.split("/o/")[1].split("?")[0];
    const decodedImagePath = decodeURIComponent(imagePath);
    const imageRef = decodedImagePath;

    try {
        const reportedImagesCollection = collection(db, 'Imágenes Reportadas');
        const reporterDocRef = doc(reportedImagesCollection, reporterEmail);
        const reporterDocSnap = await getDoc(reporterDocRef);

        const reportData = {
            imageRef: imageRef,
            uploaderEmail: uploaderEmailReal // Store the uploader's email
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
        <div className="galeria-page">
            <h1 className="title">GALERIA</h1>
            <div className="gallery-content">
                <button className="scroll-button left" onClick={scrollLeft}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <div className="image-container" ref={imageContainerRef}>
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image.url}
                            alt={`Imagen ${index}`}
                            className={`gallery-image ${selectedImage?.url === image.url && showDeleteImages ? 'selected' : ''}`}
                            onClick={() => openImage(image)}
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

            {selectedImage && !showDeleteImages && (
                <div className="modal-overlay" onWheel={handleWheel}>
                    <button className="close-button" onClick={(e) => { e.stopPropagation(); closeImage(e); }}>
                        X
                    </button>
                    <button
                        className="report-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            reportImage(selectedImage);
                        }}
                    >
                        Reportar imagen
                    </button>
                    <div className="modal-content-container"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage.url}
                            alt="Imagen Ampliada"
                            className="modal-image"
                            style={{
                                transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                                cursor: isDragging ? 'grabbing' : 'grab',
                            }}
                            ref={modalImageRef}
                            onClick={(e) => e.stopPropagation()}
                        />

                        <div className="image-info">
                            <p>Publicado por: {selectedImage.uploadedBy}</p>
                            <p>Fecha: {selectedImage.uploadDate}</p>
                        </div>

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