// SearchTest.jsx
import React, { useState } from 'react';
import './SearchTest.css';
import searchIcon from '../../../src/assets/images/lupa-search.webp';
import { db } from './../../firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { useExperiences } from '../../components/hooks/experiences-hooks/useExperiences';

function SearchTest() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState('');
    const navigate = useNavigate();
    
    // Use the same hook that ExperiencesPage uses to ensure consistent data format
    const { experiences, loading } = useExperiences();

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

    // Function to handle navigation to experience details - now using the pre-fetched experiences
    const handleExperienceClick = (experienceId) => {
        // Find the experience in our pre-loaded experiences array
        const experience = experiences.find(exp => exp.id === experienceId);
        
        if (experience) {
            // Create the URL-friendly name
            const urlFriendlyName = experience.name.toLowerCase().replace(/ /g, '-');
            
            // Use the same navigation method as ExperiencesPage
            navigate(`/booking/${urlFriendlyName}`, { state: { experience } });
        } else {
            console.error("Experience not found in loaded experiences");
            setSearchError("No se pudo encontrar la experiencia.");
        }
    };

    const performSearch = async (term) => {
        try {
            const lowerCaseTerm = term.toLowerCase().trim();
            if (!lowerCaseTerm) {
                setSearchError("Por favor, ingrese un término de búsqueda.");
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
            // Instead of querying Firestore directly, filter the experiences from the hook
            const matchingExperiences = experiences.filter(experience => {
                // Only include experiences with accepted status or no status
                if (experience.rawData && experience.rawData.status && 
                    experience.rawData.status !== 'accepted') {
                    return false;
                }

                // Search in normalized data fields
                const nameMatch = experience.name.toLowerCase().startsWith(lowerCaseTerm);
                const locationMatch = experience.puntoDeSalida && 
                                     experience.puntoDeSalida.toLowerCase().startsWith(lowerCaseTerm);
                
                // Search in raw data fields if needed
                let rawDataMatch = false;
                if (experience.rawData) {
                    // Check numeric fields
                    const priceMatch = experience.rawData.precio && 
                                     experience.rawData.precio.toString().startsWith(lowerCaseTerm);
                    const distanceMatch = experience.rawData.longitudRecorrido && 
                                        experience.rawData.longitudRecorrido.toString().startsWith(lowerCaseTerm);
                    
                    rawDataMatch = priceMatch || distanceMatch;
                }
                
                return nameMatch || locationMatch || rawDataMatch;
            });
            
            // Format the matching experiences for display in search results
            matchingExperiences.forEach(experience => {
                allResults.push({
                    coleccion: 'Experiencias',
                    id: experience.id,
                    nombre: experience.name,
                    precio: experience.price,
                    puntoDeSalida: experience.puntoDeSalida,
                    longitudRecorrido: experience.distance,
                    horarioInicio: experience.rawData?.horarioInicio,
                    horarioFin: experience.rawData?.horarioFin,
                    minimoUsuarios: experience.minPeople,
                    maximoUsuarios: experience.maxPeople,
                    dificultad: experience.difficulty,
                    // This creates a reference to our useExperiences data
                    experienceObject: experience
                });
            });

            setSearchResults(allResults);
        } catch (error) {
            console.error('Error searching Firestore:', error);
            setSearchError('Error searching. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className='min-h-screen pt-10 bg-[#172a1a]'>
            <div className="container-search-test">
                <h1 className="Title-search-test">Búsquedas</h1>
                <p className="subtitulo-search-test">Ingresa un término de búsqueda.</p>

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
                                disabled={isSearching || loading}
                            />
                            <img src={searchIcon} alt="Search" className="search-icon" />
                            {isSearching && <span className="searching-text">Buscando...</span>}
                            {loading && <span className="searching-text">Cargando experiencias...</span>}
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
                                                {item.title && <p><strong>Título:</strong> {item.title}</p>}
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
                                                {item.nombre && <p><strong>Nombre:</strong> {item.nombre}</p>}
                                                {item.precio && <p><strong>Precio:</strong> {item.precio} $</p>}
                                                {item.puntoDeSalida && <p><strong>Punto de Salida:</strong> {item.puntoDeSalida}</p>}
                                                {item.longitudRecorrido && <p><strong>Longitud Recorrido:</strong> {item.longitudRecorrido}</p>}
                                                {item.horarioInicio && item.horarioFin && (
                                                    <p><strong>Horario:</strong> {item.horarioInicio} - {item.horarioFin}</p>
                                                )}
                                                {item.minimoUsuarios && <p><strong>Minimo Usuarios:</strong> {item.minimoUsuarios}</p>}
                                                {item.maximoUsuarios && <p><strong>Maximo Usuarios:</strong> {item.maximoUsuarios}</p>}
                                                {item.dificultad !== undefined && <p><strong>Dificultad:</strong> {item.dificultad}</p>}
                                            </>
                                        )}
                                    </div>

                                    {/* Different handling for different collections */}
                                    {item.coleccion === 'Experiencias' ? (
                                        <button 
                                            onClick={() => handleExperienceClick(item.id)} 
                                            className="result-link">
                                            Ir a la Experiencia
                                        </button>
                                    ) : (
                                        <Link to={item.page} className="result-link">
                                            Ir a la Página
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchTest;