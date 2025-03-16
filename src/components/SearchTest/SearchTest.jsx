// SearchTest.jsx (Modified for Correct Forum URLs and Comment Searching)
import React, { useState, useEffect } from 'react';
import './SearchTest.css';
import searchIcon from '../../../src/assets/images/lupa-search.png';
import { db } from './../../firebase-config';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from 'react-router-dom';

function SearchTest() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setSearchError('');
        setIsSearching(true);

        const trimmedSearchTerm = searchTerm.trim();

        if (!trimmedSearchTerm) {
            setSearchError("Please enter a search term.");
            setIsSearching(false);
            return;
        }

        const isNumericSearch = /^\d+$/.test(trimmedSearchTerm);

        if (!isNumericSearch && trimmedSearchTerm.length < 3) {
            setSearchError("Please enter at least 3 characters for text searches.");
            setIsSearching(false);
            return;
        }

        performSearch(trimmedSearchTerm);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearchSubmit(event);
        }
    };

    const excludeFields = (data) => {
        const excludedKeys = ['email', 'phone', 'fullName', "Foto de Perfil", "address", "birthDate", "cedula", "image", "languages", "qualifications", "weeklyDays", "weeklyHours", "userType", "reportedReviews", "schedule"];

        if (Array.isArray(data)) {
            return data.map(item => excludeFields(item));
        } else if (typeof data === 'object' && data !== null) {
            const filteredData = {};
            for (const key in data) {
                if (!excludedKeys.includes(key)) {
                    filteredData[key] = excludeFields(data[key]);
                }
            }
            return filteredData;
        }
        return data;
    };

    const getCurrentUser = () => {
        return new Promise((resolve, reject) => {
            const auth = getAuth();
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                resolve(user);
            }, reject);
        });
    };

    const isNameField = (collectionName, fieldName) => {
        const nameFields = {
            'Galeria de Imágenes': ['uploadedBy'],
            'Foros': ['userName'],
            'Experiencias': [],
            'solicitudes-guias': ['user'],
            'payments': []
        };
        return nameFields[collectionName] && nameFields[collectionName].includes(fieldName);
    };

    const collectionToPageMap = {
        'Experiencias': '/experiencias',
        'Hashtags': '/galeria',
        'payments': '/booking-process',
        'solicitudes-guias': '/guide-request',
        'Configuraciones de Experiencias': '/admin-experiencias-pendientes',
        'Foros': '/foro',
        'Galeria de Imágenes': '/galeria',
        'Imágenes Reportadas': '/admin-landing',
    };

    const pageToDisplayNameMap = {
        '/experiencias': 'Experiencias',
        '/galeria': 'Galería',
        '/booking-process': 'Pagos',
        '/guide-request': 'Solicitudes de Guías',
        '/admin-experiencias-pendientes': 'Admin: Experiencias Pendientes',
        '/foro': 'Foros',
        '/admin-landing': 'Admin: Imágenes Reportadas',
    };

    const normalizeString = (str) => {
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    //NEW: Helper function to find image
    const findImageWithHashtag = (docData, hashtag) => {
        if (docData && docData.images && Array.isArray(docData.images)) {
            for (const image of docData.images) {
                if (image.hashtags && image.hashtags.includes(hashtag)) {
                    return image;
                }
            }
        }
        return null; // No image found with the hashtag
    };

    const performSearch = async (term) => {
        try {
            const collectionsToSearch = Object.keys(collectionToPageMap);
            let allResults = [];
            const currentUser = await getCurrentUser();
            const lowerCaseTerm = term.toLowerCase();
            const numericTerm = parseInt(term);
            const normalizedTerm = normalizeString(term);
            const isRatingKeyword = ['puntuacion', 'calificacion'].some(keyword => normalizeString(keyword).startsWith(normalizedTerm));

            for (const collectionName of collectionsToSearch) {
                let collectionRef = collection(db, collectionName);
                let q = null;

                if (collectionName === 'payments' && currentUser) {
                    q = query(collectionRef, where('userEmail', '==', currentUser.email));
                }
                if (collectionName === 'solicitudes-guias' && currentUser) {
                    q = query(collectionRef, where('userEmail', '==', currentUser.email));
                }

                const querySnapshot = await getDocs(q || collectionRef);

                for (const docSnap of querySnapshot.docs) {
                    const docData = docSnap.data();
                    const filteredData = excludeFields(docData);
                    const docId = docSnap.id;
                    const page = collectionToPageMap[collectionName] || '/';
                    const displayName = pageToDisplayNameMap[page] || 'Unknown Page';

                    if (docId.toLowerCase().includes('@') && docId.toLowerCase().includes('.')) {
                        continue;
                    }

                    if (docId.toLowerCase().startsWith(lowerCaseTerm) && docId.length >= 3) {
                        allResults.push({
                            id: docId,
                            page: page,
                            displayName: displayName,
                            value: docId,
                        });
                    }

                    const searchRecursive = (obj, currentCollection, currentDocId) => {
                        if (typeof obj === 'object' && obj !== null) {
                            for (let key in obj) {
                                if (obj.hasOwnProperty(key)) {

                                    // --- Configuraciones de Experiencias Subcollections ---
                                    if (currentCollection === 'Configuraciones de Experiencias') {
                                        if (typeof obj[key] === 'string') {
                                            const lowerCaseValue = obj[key].toLowerCase();
                                            if (lowerCaseValue.startsWith(lowerCaseTerm)) {
                                                allResults.push({
                                                    id: currentDocId,
                                                    page: '/galeria',
                                                    displayName: pageToDisplayNameMap['/galeria'], //Use galeria here
                                                    value: obj[key],
                                                });
                                            }
                                        }
                                        else if (Array.isArray(obj[key])) {
                                            for (const item of obj[key]) {
                                                if (typeof item === 'string' && item.toLowerCase().startsWith(lowerCaseTerm)) {
                                                    allResults.push({
                                                        id: currentDocId,
                                                        page: '/galeria',
                                                        displayName: pageToDisplayNameMap['/galeria'], // Use galeria here
                                                        value: item,
                                                    });
                                                }
                                            }
                                        }

                                    }
                                    // Specific check for 'Title' or 'description' field in 'Foros'
                                    else if (currentCollection === 'Foros' && (key === 'Title' || key === 'description')) {
                                        const lowerCaseValue = obj[key].toLowerCase();
                                        if (lowerCaseValue.startsWith(lowerCaseTerm)) {
                                            allResults.push({
                                                id: currentDocId,
                                                page: `/foro/${currentDocId}`, // DYNAMIC URL
                                                displayName: displayName,
                                                value: obj[key],
                                                forumData: {
                                                    forumId: currentDocId,
                                                    showComments: true,
                                                    openCommentPopup: true,
                                                }
                                            });
                                        }
                                    }
                                    // Specific check for 'descripcion' in 'Experiencias'
                                    else if (currentCollection === 'Experiencias' && key === 'descripcion') {
                                        const lowerCaseValue = obj[key].toLowerCase();
                                        if (lowerCaseValue.startsWith(lowerCaseTerm)) {
                                            allResults.push({
                                                id: currentDocId,
                                                page: page,
                                                displayName: displayName,
                                                value: obj[key],
                                            });
                                        }
                                    }
                                    // Check for other name fields
                                    else if (typeof obj[key] === 'string' && isNameField(currentCollection, key)) {
                                        const lowerCaseValue = obj[key].toLowerCase();
                                        if (lowerCaseValue.startsWith(lowerCaseTerm) && lowerCaseValue.length >= 3) {
                                            allResults.push({
                                                id: currentDocId,
                                                page: page,
                                                displayName: displayName,
                                                value: obj[key],
                                            });
                                        }
                                    }

                                    // --- Check for hashtags in Galeria de Imágenes ---
                                    else if (currentCollection === 'Galeria de Imágenes' && key === 'hashtags') {
                                        if (Array.isArray(obj[key])) {
                                            for (const hashtag of obj[key]) {
                                                if (normalizeString(hashtag).startsWith(normalizedTerm)) {
                                                    // Find the image object containing the hashtag
                                                    const image = findImageWithHashtag(docData, hashtag);
                                                    if (image) {
                                                        allResults.push({
                                                            id: currentDocId, // or a unique identifier for the image
                                                            page: page,
                                                            displayName: displayName,
                                                            value: image.url,
                                                            imageData: image, // Pass the ENTIRE image object
                                                        });
                                                    }

                                                }
                                            }
                                        }
                                    }
                                    // --- Numeric Field Checks (Experiencias) ---
                                    else if (currentCollection === 'Experiencias' && !isNaN(numericTerm)) {
                                        if (key === 'longitudRecorrido' || key === 'maximoUsuarios' || key === 'minimoUsuarios' || key === 'precio') {
                                            if (obj[key] === numericTerm) {
                                                allResults.push({
                                                    id: currentDocId,
                                                    page: page,
                                                    displayName: displayName,
                                                    value: obj[key],
                                                });
                                            }
                                        }
                                    }
                                    // --- Check for string values that contain email patterns ---
                                    else if (typeof obj[key] === 'string' && obj[key].toLowerCase().includes('@') && obj[key].toLowerCase().includes('.')) {
                                        continue; // Skip this field
                                    }
                                    else if (typeof obj[key] === 'object') {
                                        searchRecursive(obj[key], currentCollection, currentDocId);
                                    }
                                }
                            }
                        }
                    };

                    if (collectionName === 'Experiencias') {
                        const reviewsRef = collection(db, 'Experiencias', docId, 'reviews');
                        const reviewsSnapshot = await getDocs(reviewsRef);

                        let totalRating = 0;
                        let reviewCount = 0;

                        for (const reviewDoc of reviewsSnapshot.docs) {
                            const reviewData = reviewDoc.data();

                            if (reviewDoc.id.toLowerCase().includes('@') && reviewDoc.id.toLowerCase().includes('.')) {
                                continue;
                            }

                            if (reviewData.text && reviewData.text.toLowerCase().includes('@') && reviewData.text.toLowerCase().includes('.')) {
                                continue;
                            }

                            if (reviewData.text && reviewData.text.toLowerCase().startsWith(lowerCaseTerm)) {
                                allResults.push({
                                    id: reviewDoc.id,
                                    page: page,
                                    displayName: displayName,
                                    value: reviewData.text,
                                });
                            }

                            if (!isNaN(numericTerm) && reviewData.rating === numericTerm) {
                                allResults.push({
                                    id: reviewDoc.id,
                                    page: page,
                                    displayName: displayName,
                                    value: reviewData.rating,
                                });
                            } else if (isRatingKeyword) {
                                allResults.push({
                                    id: reviewDoc.id,
                                    page: page,
                                    displayName: displayName,
                                    value: reviewData.rating,
                                });
                            }

                            if (typeof reviewData.rating === 'number') {
                                totalRating += reviewData.rating;
                                reviewCount++;
                            }
                        }

                        if (reviewCount > 0) {
                            const averageRating = totalRating / reviewCount;
                            if (!isNaN(numericTerm) && averageRating === numericTerm) {
                                allResults.push({
                                    id: docId,
                                    page: page,
                                    displayName: displayName,
                                    value: averageRating,
                                });
                            } else if (isRatingKeyword) {
                                allResults.push({
                                    id: docId,
                                    page: page,
                                    displayName: displayName,
                                    value: averageRating,
                                });
                            }
                        }
                    }


                   // --- Search within Forum Comments ---
                    if (collectionName === 'Foros') {
                         // Get forum data
                        const forumData = docSnap.data();

                        if (forumData.description && forumData.description.toLowerCase().startsWith(lowerCaseTerm)) {
                            allResults.push({
                                id: docId,
                                page: `/foro/${docId}`,
                                displayName: displayName,
                                value: forumData.description,
                                forumUserName: forumData.userName, // Add userName for the forum
                                forumData: {
                                        forumId: docId,
                                        showComments: true,
                                    }
                            });
                        }


                        const commentsRef = collection(db, 'Foros', docId, 'comments');
                        const commentsSnapshot = await getDocs(commentsRef);

                        for (const commentDoc of commentsSnapshot.docs) {
                            const commentData = commentDoc.data();
                            const commentId = commentDoc.id;

                            // Skip comment if ID or description contains email-like patterns
                            if (commentId.toLowerCase().includes('@') && commentId.toLowerCase().includes('.')) {
                                continue;
                            }
                            if (commentData.description && commentData.description.toLowerCase().includes('@') && commentData.description.toLowerCase().includes('.')) {
                                continue;
                            }

                            if (commentData.description && commentData.description.toLowerCase().startsWith(lowerCaseTerm)) {
                                allResults.push({
                                    id: commentId,
                                    page: `/foro/${docId}`, //  Go to the forum page
                                    displayName: `Comment in ${displayName}`, // Show it is inside a forum
                                    value: commentData.description,
                                    commentUserName: commentData.userName, // Add userName for the comment
                                    forumData: {          // Send forum data, so, the comments are visible
                                        forumId: docId,
                                        showComments: true,
                                    }
                                });
                            }
                        }
                    }

                    searchRecursive(filteredData, collectionName, docId);
                }
            }

            setSearchResults(allResults);
        } catch (error) {
            console.error('Error searching Firestore:', error);
            setSearchError('Error searching. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };



    return (
        <div className="container-search-test">
            <h1 className="titulo-search-test">Search Test</h1>
            <p className="subtitulo-search-test">Enter a term to search.</p>

            <form className="form-search-test" onSubmit={handleSearchSubmit}>
                <div className="campo-search-test">
                    <label htmlFor="search-input">Search:</label>
                    <div className="input-container">
                        <input
                            type="text"
                            id="search-input"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyDown}
                            className={`input-search-test ${searchError ? "input-error-search-test" : ""}`}
                            placeholder="Enter search term..."
                            disabled={isSearching}
                        />
                        <img src={searchIcon} alt="Search" className="search-icon" />
                        {isSearching && <span className="searching-text">Searching...</span>}
                    </div>
                </div>
            </form>
            {searchError && <div className="error-message-search-test">{searchError}</div>}

            {searchResults.length > 0 && (
                <div className='results-container-search-test'>
                    <h2>Results:</h2>
                    <div className="results-wrapper">
                        {searchResults.map((item, index) => (
                            <div key={index} className="result-item">
                                <div className="result-details">
                                    <p><strong>Page:</strong> {item.displayName}</p>
                                    <p><strong>Value:</strong> {item.value}</p>
                                    {/* Display userName for forums and comments */}
                                     {item.forumUserName && (
                                        <p><strong>Forum Creator:</strong> {item.forumUserName}</p>
                                    )}
                                    {item.commentUserName && (
                                        <p><strong>Comment Creator:</strong> {item.commentUserName}</p>
                                     )}
                                </div>
                                <Link
                                    to={{
                                        pathname: item.page,  //  Use item.page directly
                                        state: item.forumData
                                            ? { forumData: item.forumData }
                                            : item.imageData
                                                ? { imageData: item.imageData }
                                                : {} // Default to empty object if neither is present
                                    }}
                                    className="result-link"
                                >
                                    Go to Page
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchTest;