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

                const fieldsToCheck = ['nombre', 'puntoSalida', 'longitudRecorrido', 'horarioInicio', 'horarioFin', 'maximoUsuarios', 'minimoUsuarios', 'dificultad', 'puntuacion', 'precio'];
                for (const field of fieldsToCheck) {
                    if (docData[field] !== undefined) {
                        if (typeof docData[field] === 'string' && docData[field].toLowerCase().startsWith(lowerCaseTerm)) {
                            // Construct URL-friendly name
                            const urlFriendlyName = docData.nombre.toLowerCase().replace(/ /g, '-');
                            allResults.push({
                                coleccion: 'Experiencias',
                                id: docId,
                                nombre: docData.nombre,
                                page: `/booking/${urlFriendlyName}`, // Use dynamic route
                                puntoDeSalida: docData.puntoSalida,
                                longitudRecorrido: docData.longitudRecorrido,
                                horarioInicio: docData.horarioInicio,
                                horarioFin: docData.horarioFin,
                                maximoUsuarios: docData.maximoUsuarios,
                                minimoUsuarios: docData.minimoUsuarios,
                                dificultad: docData.dificultad,
                                precio: docData.precio,
                                // puntuacion: docData.puntuacion

                            });
                            break; // Stop checking other fields if one matches.
                        } else if (typeof docData[field] === 'number' && docData[field].toString().startsWith(lowerCaseTerm)) {
                            // Construct URL-friendly name (still need name for the URL)
                             const urlFriendlyName = docData.nombre.toLowerCase().replace(/ /g, '-');
                              allResults.push({
                                coleccion: 'Experiencias',
                                id: docId,
                                nombre: docData.nombre,
                                page: `/booking/${urlFriendlyName}`, // Use dynamic route.
                                puntoDeSalida: docData.puntoSalida,
                                longitudRecorrido: docData.longitudRecorrido,
                                horarioInicio: docData.horarioInicio,
                                horarioFin: docData.horarioFin,
                                maximoUsuarios: docData.maximoUsuarios,
                                minimoUsuarios: docData.minimoUsuarios,
                                dificultad: docData.dificultad,
                                precio: docData.precio,
                                // puntuacion: docData.puntuacion
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
            <h1 className="Title-search-test">Búsquedas</h1>
            <p className="subtitulo-search-test">Ingresa un término de búsqueda.</p>

            <form className="form-search-test" onSubmit={handleSearchSubmit}>
                <div className="campo-search-test">
                    <label htmlFor="search-input">Buscar:</label>
                    <div className="input-container">
                        <input
                            type="text"
                            id="search-input"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyDown}
                            className={`input-search-test ${searchError ? "input-error-search-test" : ""}`}
                            placeholder="Escriba el término a buscar..."
                            disabled={isSearching}
                        />
                        <img src={searchIcon} alt="Search" className="search-icon" />
                        {isSearching && <span className="searching-text">Buscando...</span>}
                    </div>
                </div>
            </form>
            {searchError && <div className="error-message-search-test">{searchError}</div>}

            {searchResults.length > 0 && (
                <div className='results-container-search-test'>
                    <h2>Resultados:</h2>
                    <div className="results-wrapper">
                        {searchResults.map((item, index) => (
                            <div key={index} className="result-item">
                                <div className="result-details">
                                    <p><strong>Página:</strong> {item.coleccion}</p>
                                     {/*Foros*/}
                                    {item.coleccion === 'Foros' && (
                                        <>
                                            {/* <p><strong>ID:</strong> {item.id}</p> */}
                                            {item.title && <p><strong>Título:</strong> {item.title}</p>}
                                            {/* {item.descripcion && <p><strong>Descripción:</strong> {item.descripcion}</p>} */}
                                             {item.userName && <p><strong>Usuario:</strong> {item.userName}</p>}
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
                                            {/* <p><strong>ID:</strong> {item.id}</p> */}
                                            {item.nombre && <p><strong>Nombre:</strong> {item.nombre}</p>}
                                            {item.precio && <p><strong>Precio:</strong> {item.precio} $</p>}
                                            {item.puntoDeSalida && <p><strong>Punto de Salida:</strong> {item.puntoDeSalida}</p>}
                                            {item.longitudRecorrido && <p><strong>Longitud Recorrido:</strong> {item.longitudRecorrido} km</p>}
                                            {item.horarioInicio && <p><strong>Horario de Inicio:</strong> {item.horarioInicio}</p>}
                                            {item.horarioFin && <p><strong>Horario de Fin:</strong> {item.horarioFin}</p>}
                                            {item.minimoUsuarios && <p><strong>Minimo Usuarios:</strong> {item.minimoUsuarios}</p>}
                                            {item.maximoUsuarios && <p><strong>Maximo Usuarios:</strong> {item.maximoUsuarios}</p>}
                                            {item.dificultad && <p><strong>Dificultad:</strong> {item.dificultad}</p>}
                                            {/* {item.puntuacion && <p><strong>Puntuacion:</strong> {item.puntuacion}</p>} */}
                                        </>
                                    )}

                                </div>

                                 <Link to={item.page} className="result-link">
                                        Ir a la Página  
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