import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../../firebase-config';
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, query, where, getDocs, arrayRemove, runTransaction, onSnapshot } from 'firebase/firestore';
import './GalleryPage.css';
import storageService from '../../../cloudinary-services/storage-service';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function GalleryPage() {
    const [images, setImages] = useState([]);
    const [userImages, setUserImages] = useState([]);
    const imageContainerRef = useRef(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const modalImageRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showDeleteImages, setShowDeleteImages] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [hashtags, setHashtags] = useState([]);
    const [availableHashtags, setAvailableHashtags] = useState([]);
    const [newHashtag, setNewHashtag] = useState("");
    const [hashtagError, setHashtagError] = useState("");
    const [searchHashtag, setSearchHashtag] = useState("");
    const [searchDate, setSearchDate] = useState(""); //  "YYYY-MM-DD" format
    const [filteredImages, setFilteredImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]); // New state for selected images
    const [showReportModal, setShowReportModal] = useState(false); // State to control report modal visibility
    const [reportReason, setReportReason] = useState("");       // State to store the report reason
    const [reportingImage, setReportingImage] = useState(null); // State to store the image being reported
    // Remove reportModalPosition, it's no longer needed


    const location = useLocation();
    const navigate = useNavigate();
    const imagesLoadedRef = useRef(false);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
            if (user) {
                await loadUserImages(user.email);
            } else {
                setUserImages([]);
            }
            loadAllImages();
        });

        loadAvailableHashtags();

        const unsubscribeHashtags = onSnapshot(collection(db, 'Hashtags'), (snapshot) => {
            const updatedHashtags = snapshot.docs.map(doc => doc.id);
            setAvailableHashtags(updatedHashtags);
            localStorage.setItem('availableHashtags', JSON.stringify(updatedHashtags));
            localStorage.setItem('hashtagsTimestamp', Date.now().toString());
        });

        return () => {
            unsubscribeAuth();
            unsubscribeHashtags();
        };
    }, []);

    useEffect(() => {
        if (imagesLoadedRef.current && location.state && location.state.imageData) {
            const imageUrlToFind = location.state.imageData.url;
            const foundImage = images.find(img => img.url === imageUrlToFind);
            if (foundImage) {
                openImage(foundImage);
            } else {
                console.warn("Image not found in loaded images:", imageUrlToFind);
            }
        }
    }, [images, location.state]);

    useEffect(() => {
        let result = [...images];

        if (searchHashtag) {
            const searchTerm = searchHashtag.toLowerCase(); // Convert search term to lowercase
            result = result.filter(image =>
                image.hashtags && image.hashtags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        if (searchDate) {
            result = result.filter(image => {
                const [day, month, yearAndTime] = image.uploadDate.split('/');
                const [year] = yearAndTime.split('/');
                const normalizedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                return normalizedDate === searchDate;
            });
        }

        setFilteredImages(result);
    }, [images, searchHashtag, searchDate]);


    const scrollLeft = () => {
        if (imageContainerRef.current) {
            imageContainerRef.current.scrollBy({ left: -440, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (imageContainerRef.current) {
            imageContainerRef.current.scrollBy({ left: 440, behavior: 'smooth' });
        }
    };

    const openImage = (image) => {
        if (!showDeleteImages) {
            const encodedImageUrl = encodeURIComponent(image.url);
            navigate(`/galeria/${encodedImageUrl}`, { state: { image } });
        }
    };

    const closeImage = () => {
        navigate('/galeria');
    };

    const handleZoomIn = () => setZoomLevel(prevZoom => Math.min(prevZoom + 0.2, 3));
    const handleZoomOut = () => setZoomLevel(prevZoom => Math.max(prevZoom - 0.2, 0.4));

    const handleWheel = (event) => {
        if (!showDeleteImages) {
            event.preventDefault();
            event.deltaY < 0 ? handleZoomIn() : handleZoomOut();
        }
    };

    const handleMouseDown = (event) => {
        if (!showDeleteImages) {
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

    const handleMouseUp = () => setIsDragging(false);
    const handleMouseLeave = () => setIsDragging(false);

    const handleTouchStart = (event) => {
        if (!showDeleteImages) {
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

    const handleTouchEnd = () => setIsDragging(false);


    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Invalid file type. Only PNG, JPEG, and WebP images are allowed.');
            return;
        }

        setSelectedFile(file);
        setShowUploadModal(true);
        setHashtags([]);
        setHashtagError("");
    };

    const handleConfirmUpload = async () => {
        if (!selectedFile) return;

        if (hashtags.length === 0) {
            setHashtagError("Please add at least one hashtag.");
            return;
        }
        setHashtagError("");

        setUploading(true);
        setUploadProgress(0);

        try {
            const uploadResult = await storageService.uploadFile('gallery', selectedFile);
            setUploadProgress(100); // Immediate feedback
            alert('File uploaded successfully!');

            if (!auth.currentUser) {
                console.error("No user logged in.");
                alert("Por favor regístrate para subir imágenes.");
                return;
            }

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
            const userGalleryDocRef = doc(galleryCollection, user.email);
            const userGalleryDocSnap = await getDoc(userGalleryDocRef);

            const imageData = {
                url: uploadResult.downloadURL,
                uploadedBy: userName,
                uploadDate: formattedDate,
                hashtags: hashtags,
            };

            if (userGalleryDocSnap.exists()) {
                await updateDoc(userGalleryDocRef, { images: arrayUnion(imageData) });
                console.log("Image URL added to existing gallery document.");
            } else {
                await setDoc(userGalleryDocRef, { images: [imageData] });
                console.log("New gallery document created.");
            }

            // Update Hashtags collection (Crucial for efficiency)
            for (const hashtag of hashtags) {
                const hashtagRef = doc(db, 'Hashtags', hashtag);
                const hashtagDoc = await getDoc(hashtagRef);

                if (hashtagDoc.exists()) {
                    // Increment count using a transaction (for concurrency safety)
                    await runTransaction(db, async (transaction) => {
                        const currentDoc = await transaction.get(hashtagRef);
                        const currentCount = currentDoc.exists() ? currentDoc.data().count : 0;
                        transaction.update(hashtagRef, { count: currentCount + 1 });
                    });
                } else {
                    // Create the hashtag document
                    await setDoc(hashtagRef, { count: 1 });
                }
            }

            // Update local state
            setImages(prevImages => [...prevImages, imageData]);
            await loadUserImages(user.email);

        } catch (uploadError) {
            console.error("Upload failed:", uploadError);
            alert("Error uploading file: " + uploadError.message);
        } finally {
            setUploading(false);
            setUploadProgress(0);
            setShowUploadModal(false);
            setSelectedFile(null);
            setHashtags([]);
        }
    };


    const handleCancelUpload = () => {
        setShowUploadModal(false);
        setSelectedFile(null);
        setHashtags([]);
        setHashtagError("");
    };

    const handleAddHashtag = () => {
        if (newHashtag.trim() && !hashtags.includes(newHashtag.trim())) {
            const hashtagRegex = /^[a-zA-Z0-9_]+$/;
            if (!hashtagRegex.test(newHashtag.trim())) {
                setHashtagError("Los hashtags solamente pueden contener letras, números y espacios");
                return;
            }
            setHashtags([...hashtags, newHashtag.trim()]);
            setNewHashtag("");
            setHashtagError("");
        }
    };  

    const handleHashtagClick = (tag) => {
        if (!hashtags.includes(tag)) {
            setHashtags([...hashtags, tag]);
        }
    };

    const handleRemoveHashtag = (tagToRemove) => {
        setHashtags(hashtags.filter(tag => tag !== tagToRemove));
    };



    const loadUserImages = async (userEmail) => {
        try {
            const galleryCollection = collection(db, 'Galeria de Imágenes');
            const userGalleryDocRef = doc(galleryCollection, userEmail);
            const userGalleryDocSnap = await getDoc(userGalleryDocRef);

            if (userGalleryDocSnap.exists()) {
                const galleryData = userGalleryDocSnap.data();
                setUserImages(galleryData.images && Array.isArray(galleryData.images) ? galleryData.images : []);
            } else {
                setUserImages([]);
            }
        } catch (error) {
            console.error("Error loading user images:", error);
            alert("Error loading images: " + error.message);
        }
    };

    const toggleDeleteMode = () => {
        setShowDeleteImages(!showDeleteImages);
        // The key change:  Load *all* images when NOT in delete mode, and *only user* images WHEN in delete mode.
        if (!showDeleteImages) { // Entering delete mode. Show only user images.
            setImages(userImages);
        } else { // Exiting delete mode.  Show all images
            loadAllImages();
        }
        setSelectedImages([]); // Reset selected images when toggling mode
        navigate('/galeria');
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
                        if (image.url) { firestoreImages.push(image); }
                        else { console.warn("Skipping image with missing URL:", image); }
                    });
                }
            });

            let reportedImageRefs = [];
            if (auth.currentUser) {
                const reportedImagesCollection = collection(db, 'Imágenes Reportadas');
                const reporterDocRef = doc(reportedImagesCollection, auth.currentUser.email);
                const reporterDocSnap = await getDoc(reporterDocRef);

                if (reporterDocSnap.exists()) {
                    const reportedData = reporterDocSnap.data();
                    if (reportedData.images && Array.isArray(reportedData.images)) {
                        reportedImageRefs = reportedData.images.map(image => image.imageRef);
                    }
                }
            }
            firestoreImages = firestoreImages.filter(image => !reportedImageRefs.includes(image.publicId || image.url));

            setImages(firestoreImages);
            imagesLoadedRef.current = true;

        } catch (error) {
            console.error("Error loading images from Firestore:", error);
        }
    };

    const toggleImageSelection = (image) => {
        if (!showDeleteImages) return; // Only allow selection in delete mode

        const imageUrl = image.url;
        if (selectedImages.includes(imageUrl)) {
            setSelectedImages(selectedImages.filter(url => url !== imageUrl));
        } else {
            setSelectedImages([...selectedImages, imageUrl]);
        }
      };

    const handleDeleteImage = async () => {
        if (!auth.currentUser) {
            alert("Please log in to delete images.");
            return;
        }

        if (selectedImages.length === 0) {
            alert("Please select images to delete.");
            return;
        }

        try {
             for (const imageUrl of selectedImages) {

                const selectedImage = userImages.find(img => img.url === imageUrl);

                if (!selectedImage) {
                    console.error("Image to delete not found:", imageUrl);
                    continue; // Skip to the next image
                }

                const publicId = selectedImage.publicId || storageService.ref(selectedImage.url).fullPath;

                if (!publicId) {
                    console.error("Could not determine publicId for deletion:", imageUrl);
                    continue;
                }
                await storageService.deleteFile(publicId);


                const user = auth.currentUser;
                const galleryCollection = collection(db, 'Galeria de Imágenes');
                const userGalleryDocRef = doc(galleryCollection, user.email);

                await updateDoc(userGalleryDocRef, { images: arrayRemove(selectedImage) });

                if (selectedImage.hashtags && Array.isArray(selectedImage.hashtags)) {
                    for (const hashtag of selectedImage.hashtags) {
                      const hashtagRef = doc(db, 'Hashtags', hashtag);
                        await runTransaction(db, async (transaction) => {
                            const currentDoc = await transaction.get(hashtagRef);
                            if (currentDoc.exists()) {
                                const currentCount = currentDoc.data().count;
                                if (currentCount > 1) {
                                    transaction.update(hashtagRef, { count: currentCount - 1 });
                                } else {
                                    transaction.delete(hashtagRef);
                                }
                            }
                        });
                    }
                }

                //  Update local state *after* successful Firestore and storage deletion:
                setUserImages(prevImages => prevImages.filter(img => img.url !== imageUrl));
                setImages(prevImages => prevImages.filter(img => img.url !== imageUrl));
             }

            alert("Images deleted successfully.");
            setSelectedImages([]); // Clear selection after deleting
            await loadUserImages(auth.currentUser.email);  // Reload after deleting.
            navigate('/galeria'); // Navigate after successful deletion.


        } catch (error) {
            console.error("Error deleting image:", error);
            alert("Error deleting image: " + error.message);
        }
    };

    const openReportModal = (image, event) => {
        event.stopPropagation();
        setReportingImage(image);
        setShowReportModal(true);
        setReportReason("");
        // No need to calculate position anymore
    };

    const closeReportModal = () => {
      setShowReportModal(false);
      setReportingImage(null);
    }

  const handleReportSubmit = async () => {
    if (!reportingImage) return;

    if (!auth.currentUser) {
        alert("Please log in to report images.");
        closeReportModal();
        return;
    }
    const reporterEmail = auth.currentUser.email;

    // Obtenemos el email del que subio la imagen, a partir de la URL
    const galleryCollection = collection(db, 'Galeria de Imágenes');
    const querySnapshot = await getDocs(galleryCollection);
    let uploaderEmail = null;

    querySnapshot.forEach((doc) => {
        const galleryData = doc.data();
        if (galleryData.images && Array.isArray(galleryData.images)) {
            galleryData.images.forEach(img => {
                if (img.url === reportingImage.url) {
                    uploaderEmail = doc.id; // El ID del documento es el email del uploader
                }
            });
        }
    });

    if (reporterEmail === uploaderEmail) {
        alert("You cannot report your own images.");
        closeReportModal();
        return;
    }

    const imageIdentifier = reportingImage.publicId || reportingImage.url;
    const imageRef = imageIdentifier;


    if (!reportReason.trim()) {
        alert("Please provide a reason for reporting.");
        return;
    }


    try {
        const reportedImagesCollection = collection(db, 'Imágenes Reportadas');
        const reporterDocRef = doc(reportedImagesCollection, auth.currentUser.email);
        const reporterDocSnap = await getDoc(reporterDocRef);

        // --- Date Formatting ---
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0'); // Added minutes for more precision
        const formattedReportDate = `${day}/${month}/${year} - ${hours}:${minutes}`;
        // --- End Date Formatting ---


        const reportData = {
            imageRef,
            uploaderEmail: uploaderEmail,
            reportReason: reportReason,
            reportDate: formattedReportDate // Use the formatted date
        };


        if (reporterDocSnap.exists()) {
            await updateDoc(reporterDocRef, { images: arrayUnion(reportData) });
            console.log("Image report added to existing document.");
        } else {
            await setDoc(reporterDocRef, { images: [reportData] });
            console.log("New report document created.");
        }

        setImages(prevImages => prevImages.filter(img => img.url !== reportingImage.url));
        alert("Image reported successfully.");
        closeReportModal();
        navigate('/galeria');

    } catch (error) {
        console.error("Error reporting image:", error);
        alert("Error reporting image: " + error.message);
    }
};



    const loadAvailableHashtags = async () => {
        try {
            const cachedHashtags = localStorage.getItem('availableHashtags');
            const cacheTimestamp = localStorage.getItem('hashtagsTimestamp');

            if (cachedHashtags && cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < 3600000) {
                setAvailableHashtags(JSON.parse(cachedHashtags));
                return;
            }

            const hashtagsCollection = collection(db, 'Hashtags');
            const querySnapshot = await getDocs(hashtagsCollection);
            const fetchedHashtags = [];
            querySnapshot.forEach((doc) => {
                fetchedHashtags.push(doc.id);
            });

            setAvailableHashtags(fetchedHashtags);

            localStorage.setItem('availableHashtags', JSON.stringify(fetchedHashtags));
            localStorage.setItem('hashtagsTimestamp', Date.now().toString());

        } catch (error) {
            console.error("Error loading available hashtags:", error);
        }
    };

    const renderImageModal = () => {
      const { imageId } = useParams();

      // Check if we are NOT in delete mode AND we have an imageId
      if (!showDeleteImages && imageId) {
        const decodedImageUrl = decodeURIComponent(imageId);
        const selectedImage = images.find((img) => img.url === decodedImageUrl);

        // If we found the image, render the modal
        if (selectedImage) {
          return (
            <div className="modal-overlay-gallery" onWheel={handleWheel}>
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
                <button
                  className="close-button-gallery"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeImage();
                  }}
                >
                  X
                </button>
                <button
                  className="report-button-gallery"
                  onClick={(e) => openReportModal(selectedImage, e)}
                >
                  Reportar imagen
                </button>
                <img
                  src={selectedImage.url}
                  alt="Imagen Ampliada"
                  className="modal-image-gallery"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                    cursor: isDragging ? "grabbing" : "grab",
                  }}
                  ref={modalImageRef}
                  onClick={(e) => e.stopPropagation()}
                />

                <div className="image-info-gallery">
                  <p>Publicado por: {selectedImage.uploadedBy}</p>
                  <p>Fecha: {selectedImage.uploadDate}</p>
                  {selectedImage.hashtags &&
                    selectedImage.hashtags.length > 0 && (
                      <p>Hashtags: {selectedImage.hashtags.join(", ")}</p>
                    )}
                </div>

                <div className="zoom-controls-gallery">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZoomIn();
                    }}
                  >
                    +
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZoomOut();
                    }}
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
          );
        }
      }

      // In all other cases (delete mode, no imageId, image not found), return null
      return null;
    };


    const handleSearchChange = (e) => {
        const { name, value } = e.target;

        if (name === 'hashtag') {
            setSearchHashtag(value);
        } else if (name === 'date') {
            setSearchDate(value);
        }
    }

    const handleClearFilters = () => {
        setSearchHashtag("");
        setSearchDate("");
    }

    return (
        <div className="galeria-page-gallery">
            <h1 className="title-gallery">GALERIA</h1>

            {/* Search Filters */}
            <div className="search-filters-gallery">
                <input
                    type="text"
                    placeholder="Buscar por hashtag..."
                    value={searchHashtag}
                    onChange={handleSearchChange}
                    name="hashtag"
                />
                <input
                    type="date"
                    placeholder="Buscar por fecha (YYYY-MM-DD)..."
                    value={searchDate}
                    onChange={handleSearchChange}
                    name="date"
                />
                <button onClick={handleClearFilters}>Limpiar Filtros</button>
            </div>

            <div className="gallery-content-gallery">
                <button className="scroll-button-gallery left-gallery" onClick={scrollLeft}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <div className="image-container-gallery" ref={imageContainerRef}>
                    {filteredImages.map((image, index) => (
                        <img
                            key={index}
                            src={image.url}
                            alt={`Imagen ${index}`}
                            className={`gallery-image-gallery ${selectedImages.includes(image.url) ? 'selected-gallery' : ''}`}
                            onClick={() => {
                                if (showDeleteImages) {
                                    toggleImageSelection(image);
                                } else {
                                    openImage(image);
                                }
                            }}
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

            {showUploadModal && (
                <div className="modal-overlay-gallery">
                    <div className="modal-content-container-gallery" style={{ maxWidth: '500px' }}>
                        <button className="close-button-gallery" onClick={handleCancelUpload}>X</button>
                        <h2 style={{ color: '#8AFFB9', fontSize: '26px', marginBottom: '18px' }}>Subir Imagen</h2>
                        {selectedFile && (
                            <img src={URL.createObjectURL(selectedFile)} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                        )}

                        <div style={{ marginTop: '20px', marginBottom: '10px', width: "100%" }}>
                            <label htmlFor="hashtag-input" style={{ color: 'white', display: 'block', marginBottom: "5px" }}>Hashtags:</label>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', width: '100%' }}>
                                <input
                                    type="text"
                                    id="hashtag-input"
                                    value={newHashtag}
                                    onChange={(e) => setNewHashtag(e.target.value)}
                                    placeholder="Añade un hashtag"
                                    style={{ flexGrow: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddHashtag(); }}

                                />
                                <button onClick={handleAddHashtag} style={{ padding: '8px 12px', borderRadius: '4px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>Añadir</button>
                            </div>
                            {hashtagError && <p style={{ color: 'red', marginTop: '5px' }}>{hashtagError}</p>}

                            <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                {hashtags.map((tag) => (
                                    <span key={tag} style={{ backgroundColor: '#ddd', padding: '5px', borderRadius: '4px', display: 'flex', alignItems: "center", gap: '2px' }}>
                                        {tag}
                                        <button onClick={() => handleRemoveHashtag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>x</button>
                                    </span>
                                ))}
                            </div>

                            <div style={{ marginTop: '10px' }}>
                                <p style={{ color: 'white', marginBottom: '5px' }}>Hashtags Disponibles:</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                    {availableHashtags.map((tag) => (
                                        <span key={tag} style={{ backgroundColor: '#eee', padding: '5px', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleHashtagClick(tag)}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px', width: '100%' }}>
                            <button disabled={uploading} onClick={handleConfirmUpload} style={{ padding: '10px 15px', borderRadius: '4px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
                                {uploading ? 'Subiendo...' : 'Publicar imagen'}
                            </button>
                            <button onClick={handleCancelUpload} style={{ padding: '10px 15px', borderRadius: '4px', backgroundColor: '#ccc', color: 'black', border: 'none' }}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

             {showReportModal && (
                <div className="modal-overlay-gallery" style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', zIndex: 1001}}>
                    <div className="modal-content-container-gallery" style={{position: 'relative'}}>
                        <button className="close-button-gallery" onClick={closeReportModal} style={{position: 'absolute', top: '10px', right: '10px'}}>X</button>
                        <h2>Reportar Imagen</h2>
                        <p>Escriba el motivo de su reporte:</p>
                        <textarea
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            placeholder="Escriba su motivo..."
                            style={{width: '100%',  padding: '8px',  marginBottom: '10px',  borderRadius: '4px',  border: '1px solid #ccc'}}
                        />
                        <button onClick={handleReportSubmit}>Subir Reporte</button>
                    </div>
                </div>
                )}

            {renderImageModal()}
        </div>
    );
}

export default GalleryPage;