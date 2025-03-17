/* eslint-disable no-loop-func */
// SearchTest.jsx
import React, { useState } from 'react';
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
        performSearch(searchTerm);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearchSubmit(event);
        }
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


    const collectionToPageMap = {
        'Experiencias': '/experiencias',
        'Foros': '/foro',
        'Galeria de Imágenes': '/galeria',
    };


    const performSearch = async (term) => {
        try {
            const lowerCaseTerm = term.toLowerCase().trim();
            if (!lowerCaseTerm) {
                setSearchError("Please enter a search term.");
                setIsSearching(false);
                return;
            }

            let allResults = [];
            const currentUser = await getCurrentUser();

            // --- Foros ---
            const forosRef = collection(db, 'Foros');
            const forosSnapshot = await getDocs(forosRef);
            for (const docSnap of forosSnapshot.docs) {
                const docData = docSnap.data();
                const docId = docSnap.id;
                if (docData.Title && docData.Title.toLowerCase().startsWith(lowerCaseTerm)) {
                    allResults.push({
                        coleccion: 'Foros',
                        id: docId,
                        title: docData.Title,
                        descripcion: docData.descripcion,
                        userName: docData.userName,
                        page: `/foro/${docId}`
                    });
                }
                if (docData.descripcion && docData.descripcion.toLowerCase().startsWith(lowerCaseTerm)) {
                    allResults.push({
                        coleccion: 'Foros',
                        id: docId,
                        title: docData.Title,
                        descripcion: docData.descripcion,
                        userName: docData.userName,
                        page: `/foro/${docId}`
                    });
                }
            }

            // --- Galeria de Imágenes ---
             const galeriaRef = collection(db, 'Galeria de Imágenes');
            const galeriaSnapshot = await getDocs(galeriaRef);
            let reportedImageRefs = [];

            if (currentUser) {
                const reportedImagesRef = collection(db, 'Imágenes Reportadas');
                const reportedImagesSnapshot = await getDocs(reportedImagesRef);


                for (const reportedDoc of reportedImagesSnapshot.docs) {

                    if(reportedDoc.id === currentUser.uid){
                        const reportedData = reportedDoc.data();

                        if(reportedData.images && Array.isArray(reportedData.images)){
                            reportedData.images.forEach(image => {
                                if (image && image.imageRef) {
                                  reportedImageRefs.push(image.imageRef);
                                }
                            });

                        }
                    }
                }
            }


            for (const docSnap of galeriaSnapshot.docs) {
                const docData = docSnap.data();
                if (docData.images && Array.isArray(docData.images)) {
                    for (const image of docData.images) {
                        if (image.hashtags && Array.isArray(image.hashtags)) {
                            for (const hashtag of image.hashtags) {
                                if (hashtag.toLowerCase().startsWith(lowerCaseTerm)) {
                                     if (!reportedImageRefs.includes(image.url)) {  // Check against reported images
                                        const encodedImageUrl = encodeURIComponent(image.url);
                                        allResults.push({
                                            coleccion: 'Galeria de Imágenes',
                                            // url: image.url, // Remove URL from display
                                            page: '/galeria/' + encodedImageUrl
                                        });
                                    }
                                    break; //  Stop inner loop if found
                                }
                            }
                        }
                    }
                }
            }


            // --- Experiencias ---
            const experienciasRef = collection(db, 'Experiencias');
            const experienciasSnapshot = await getDocs(experienciasRef);
            for (const docSnap of experienciasSnapshot.docs) {
                const docData = docSnap.data();
                const docId = docSnap.id;

                const fieldsToCheck = ['nombre', 'puntoSalida', 'longitudRecorrido', 'horarioInicio', 'horarioFin', 'maximoUsuarios', 'minimoUsuarios', 'dificultad', 'puntuacion'];
                for (const field of fieldsToCheck) {
                    if (docData[field] !== undefined) {
                        if (typeof docData[field] === 'string' && docData[field].toLowerCase().startsWith(lowerCaseTerm)) {
                            allResults.push({
                                coleccion: 'Experiencias',
                                id: docId,
                                nombre: docData.nombre,
                                page: '/experiencias'
                            });
                            break; // Stop checking other fields if one matches.
                        } else if (typeof docData[field] === 'number' && docData[field].toString().startsWith(lowerCaseTerm)) {
                              allResults.push({
                                coleccion: 'Experiencias',
                                id: docId,
                                nombre: docData.nombre,
                                page: '/experiencias'
                            });
                            break; // Stop checking other fields
                        }
                    }
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
            <h1 className="Title-search-test">Search Test</h1>
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
                                    <p><strong>Collection:</strong> {item.coleccion}</p>
                                     {/*Foros*/}
                                    {item.coleccion === 'Foros' && (
                                        <>
                                            <p><strong>ID:</strong> {item.id}</p>
                                            {item.Title && <p><strong>Title:</strong> {item.Title}</p>}
                                            {item.descripcion && <p><strong>Description:</strong> {item.descripcion}</p>}
                                             {item.userName && <p><strong>User:</strong> {item.userName}</p>}
                                        </>
                                    )}
                                    {/*Galeria de Imagenes - No URL display */}
                                     {item.coleccion === 'Galeria de Imágenes' && (
                                        <>
                                            {/* No URL displayed here */}
                                        </>
                                    )}

                                    {/*Experiencias*/}
                                      {item.coleccion === 'Experiencias' && (
                                         <>
                                            <p><strong>ID:</strong> {item.id}</p>
                                            {item.nombre && <p><strong>Name:</strong> {item.nombre}</p>}
                                        </>
                                    )}

                                </div>

                                 <Link to={item.page} className="result-link">
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