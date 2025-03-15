// ReviewsPage.jsx
import React, { useRef, useState, useEffect } from 'react';
import './ReviewsPage.css';
import { useExperiences } from '../../components/hooks/experiences-hooks/useExperiences';
import ExperienceCard, { calculateAverageRating } from '../../components/experiences/ExperienceCard'; // Import calculateAverageRating
import '../ExperiencesPage/ExperiencesPage.css';
import { doc, updateDoc, getDoc, collection, serverTimestamp, getDocs, setDoc } from "firebase/firestore";
import { db } from './../../firebase-config';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import profileFallbackImage from '../../assets/images/landing-page/profile_managemente/profile_picture_1.png';


const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe();
            if (user) {
                try {
                    const userDocRef = doc(db, "lista-de-usuarios", user.email);
                    const userDocSnap = await getDoc(userDocRef);
                    if (!userDocSnap.exists()) {
                        console.warn("Usuario no encontrado en Firestore:", user.email);
                        resolve({
                            email: user.email,
                            profileImage: "url_por_defecto.jpg",
                            userName: "Usuario Anónimo"
                        });
                        return;
                    }
                    const userData = userDocSnap.data();
                    let profileImageUrl = "url_por_defecto.jpg";
                    if (userData['Foto de Perfil']) {
                        profileImageUrl = userData['Foto de Perfil'];
                    }
                    resolve({
                        email: user.email,
                        profileImage: profileImageUrl,
                        userName: userData.name + " " + userData.lastName || user.displayName || "Usuario Anónimo"
                    });
                } catch (error) {
                    console.error("Error al obtener la información del usuario:", error);
                    reject(error);
                }
            } else {
                resolve(null);
            }
        }, (error) => {
            reject(error);
        });
    });
};

const LoadingState = () => (
    <div className="loading-container">
        <p>Cargando experiencias...</p>
        <div className="loading-spinner"></div>
    </div>
);

const ErrorState = ({ message }) => (
    <div className="error-container">
        <p>Error: {message}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
            Reintentar
        </button>
    </div>
);

const EmptyState = () => (
    <div className="empty-container">
        <p>No hay experiencias disponibles en este momento.</p>
        <p>¡Vuelve pronto para descubrir nuevas aventuras!</p>
    </div>
);

function ReviewsPage() {
    const { experiences, loading, error } = useExperiences();
    const experienceRefs = useRef([]);
    const reviewsContainerRef = useRef(null);
    const [selectedReview, setSelectedReview] = useState(null);
    const [reportedReviews, setReportedReviews] = useState([]); // Store reported review IDs
    const [errorReport, setError] = useState(null);  //Error general de la pagina  // Changed to errorReport
    const [showReviewPopup, setShowReviewPopup] = useState(false);
    const [newReviewText, setNewReviewText] = useState("");
    const [rating, setRating] = useState(0);
    const [localExperiences, setLocalExperiences] = useState([]);
    const [allReviews, setAllReviews] = useState({});
    const [reviewError, setReviewError] = useState(""); // Error especifico al publicar
    const [reviewReportErrors, setReviewReportErrors] = useState({}); //NEW, specific errors



    useEffect(() => {
        const loadReportedData = async () => {
            const user = await getCurrentUser();
            if (user) {
                const userDocRef = doc(db, "lista-de-usuarios", user.email);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setReportedReviews(userData.reportedReviews || []); // Load reported reviews
                }
            }
        };
        loadReportedData();
    }, []);

    useEffect(() => {
        if (experiences) {
            setLocalExperiences(experiences);
        }
    }, [experiences]);

    // --- MODIFIED useEffect ---
    useEffect(() => {
        const fetchAllReviewsData = async () => {
            if (localExperiences.length > 0) {
                let reviewsData = {};
                for (const experience of localExperiences) {
                    const experienceRef = doc(db, 'Experiencias', experience.id);
                    const reviewsCollectionRef = collection(experienceRef, 'reviews');
                    const querySnapshot = await getDocs(reviewsCollectionRef);

                    const reviews = [];
                    querySnapshot.forEach((doc) => {
                        reviews.push({ id: doc.id, ...doc.data() });
                    });

                    const averageRating = calculateAverageRating(reviews);
                    reviewsData[experience.id] = reviews;
                    reviewsData[`${experience.id}-averageRating`] = averageRating;
                }
                setAllReviews(reviewsData);
            }
        };

        fetchAllReviewsData();
    }, [localExperiences]); // Run when localExperiences changes


    const scrollLeft = () => {
        if (reviewsContainerRef.current) {
            reviewsContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (reviewsContainerRef.current) {
            reviewsContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const handleViewMore = (experience) => {
        setSelectedReview(experience);
    };

    const handleBackToReviews = () => {
        setSelectedReview(null);
    };

    const handleReportReview = async (experienceId, reviewId) => {
        const user = await getCurrentUser();
        if (!user) {
            setReviewReportErrors(prevErrors => ({
                ...prevErrors,
                [reviewId]: "Debes iniciar sesión para reportar una reseña."
            }));
            setTimeout(() => setReviewReportErrors(prevErrors => ({ ...prevErrors, [reviewId]: null })), 5000);
            return;
        }

        const reviewsForExperience = allReviews[experienceId] || [];
        const reviewToReport = reviewsForExperience.find(review => review.id === reviewId);

        if (!reviewToReport) {
            setReviewReportErrors(prevErrors => ({
                ...prevErrors,
                [reviewId]: "La reseña no existe."
            }));
            setTimeout(() => setReviewReportErrors(prevErrors => ({ ...prevErrors, [reviewId]: null })), 5000);
            return;
        }

        if (reviewToReport.userEmail === user.email) {
            setReviewReportErrors(prevErrors => ({
                ...prevErrors,
                [reviewId]: "No puedes reportar tu propia reseña."
            }));
            setTimeout(() => setReviewReportErrors(prevErrors => ({ ...prevErrors, [reviewId]: null })), 5000);
            return;
        }

        if (reportedReviews.includes(reviewId)) {
            setReviewReportErrors(prevErrors => ({
                ...prevErrors,
                [reviewId]: "Ya has reportado esta reseña."
            }));
            setTimeout(() => setReviewReportErrors(prevErrors => ({ ...prevErrors, [reviewId]: null })), 5000);
            return;
        }

        try {
            const userDocRef = doc(db, "lista-de-usuarios", user.email);
            await updateDoc(userDocRef, {
                reportedReviews: [...reportedReviews, reviewId]
            });
            setReportedReviews([...reportedReviews, reviewId]);

        } catch (error) {
            console.error("Error al reportar la reseña:", error);
            setReviewReportErrors(prevErrors => ({
                ...prevErrors,
                [reviewId]: "Error al reportar la reseña."
            }));
            setTimeout(() => setReviewReportErrors(prevErrors => ({ ...prevErrors, [reviewId]: null })), 5000);
        }
    };



    const handleOpenReviewPopup = () => {
        if (selectedReview) {
            setShowReviewPopup(true);
            setRating(0);
            setReviewError(""); // Resetear el error al abrir el popup
        }
    };

    const handleCloseReviewPopup = () => {
        setShowReviewPopup(false);
        setNewReviewText("");
        setRating(0);
        setReviewError(""); // Resetear el error al cerrar
    };

    const handleReviewTextChange = (event) => {
        setNewReviewText(event.target.value);
        if (reviewError) {  //Limpia el error si el usuario empieza a escribir
            setReviewError("");
        }
    };

    const handleRatingClick = (newRating) => {
        setRating(newRating);
        if (reviewError) { //Limpia el error si el usuario cambia el rating
            setReviewError("");
        }
    };

    const handlePublishReview = async () => {
        const user = await getCurrentUser();

        if (!user) {
            setError("Debes iniciar sesión para publicar una reseña.");
            setTimeout(() => setError(null), 5000);
            return;
        }
        if (!newReviewText.trim()) {
            setReviewError("La reseña no puede estar vacía.");
            return; // Importante: salir de la función si hay un error
        }
        if (!selectedReview) {
            setError("Error: No se ha seleccionado una experiencia.");
            setTimeout(() => setError(null), 5000);
            return;
        }
        if (rating === 0) {
            setReviewError("Por favor, selecciona una puntuación.");
            return; // Importante: salir de la función si hay un error
        }

        try {
            const experienceRef = doc(db, 'Experiencias', selectedReview.id);

            const reviewsCollectionRef = collection(experienceRef, 'reviews');

            const userReviewRef = doc(reviewsCollectionRef, user.email);

            // Use a Date object for immediate display
            const now = new Date();
            const newReview = {
                user: user.userName,
                text: newReviewText,
                date: now, // Store the immediate Date object.
                userEmail: user.email,
                profileImage: user.profileImage,
                rating: rating,
            };
            
            // First update the local state, then the DB
            setAllReviews(prevReviews => {
                const existingReviews = prevReviews[selectedReview.id] || [];
                const reviewIndex = existingReviews.findIndex(review => review.userEmail === user.email);

                if (reviewIndex > -1) {
                    existingReviews[reviewIndex] = { ...newReview, id: user.email };
                } else {
                    existingReviews.push({ ...newReview, id: user.email });
                }
                const averageRating = calculateAverageRating(existingReviews);

                return {
                    ...prevReviews,
                    [selectedReview.id]: existingReviews,
                    [`${selectedReview.id}-averageRating`]: averageRating
                };
            });
                
            // Now update the database.  Firebase will handle the server timestamp.
            await setDoc(userReviewRef, {
                ...newReview,
                date: serverTimestamp() // Let Firebase set the *server* timestamp.
            });


            setShowReviewPopup(false);
            setNewReviewText("");
            setRating(0);
            setReviewError(""); //Resetear

        } catch (error) {
            console.error("Error al publicar la reseña:", error);
            setError("Error al publicar la reseña: " + error.message);
            setTimeout(() => setError(null), 5000);
        }
    };


    if (!loading && !error && experiences.length > 0) {
        experienceRefs.current = experiences.map((_, i) => experienceRefs.current[i] || React.createRef());
    }

    const renderContent = () => {
        if (loading) {
            return <LoadingState />;
        }
        if (error) {
            return <ErrorState message={error} />;
        }
        const filteredExperiences = localExperiences.filter(exp => !reportedReviews.includes(exp.id));
        if (filteredExperiences.length === 0 && !selectedReview) {
            return <EmptyState />;
        }
        return filteredExperiences.map((experience, index) => (
            <ExperienceCard
                key={experience.id}
                experience={{
                    ...experience,
                    reviews: allReviews[experience.id] || [], // Pass reviews
                }}
                onViewMore={handleViewMore}
                forwardedRef={experienceRefs.current[index]}
                isReviewsPage={true}
            />
        ));
    };
    const renderRatingCircles = (rating) => {
        const circles = [];
        for (let i = 1; i <= 5; i++) {
            circles.push(
                <div
                    key={i}
                    className={`difficulty-circle-reviews ${i <= rating ? 'selected-yellow-reviews' : ''}`}
                ></div>
            );
        }
        return <div className="difficulty-container-reviews">{circles}</div>;
    };

    //  IMPROVED formatDate FUNCTION
    const formatDate = (timestamp) => {
        if (!timestamp) {
            return 'Fecha no disponible'; // Handle null/undefined case.
        }

        // If it's already a string, assume it's formatted and return it.
        if (typeof timestamp === 'string') {
            return timestamp;
        }


        // Handle Date objects (for newly created reviews)
        if (timestamp instanceof Date) {
            const date = timestamp;
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-11
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }

        // If it's a Firestore Timestamp, convert it.
        if (timestamp.toDate) {
            const date = timestamp.toDate();
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-11
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }

        //  Fallback if the timestamp is neither a string nor a Firestore Timestamp
        return 'Fecha no disponible';
    };


    return (
        <div className="container-reviews">
            {errorReport && <div className='errorReport'>{errorReport}</div>}
            <h1 className="title-reviews">RESEÑAS</h1>
            {selectedReview ? (
                <div className="selected-review-container">
                    <button className="back-button-reviews" onClick={handleBackToReviews}>
                        {"< Volver a Reseñas"}
                    </button>
                    <ExperienceCard
                        key={selectedReview.id}
                        experience={{
                            ...selectedReview,
                            reviews: allReviews[selectedReview.id] || [], // Pass reviews even for selected review
                        }}
                        isExpanded={true}
                        isReviewsPage={true}
                    />

                    <div className="reviews-list">
                        {allReviews[selectedReview.id] && allReviews[selectedReview.id].length > 0 ? (
                            allReviews[selectedReview.id]
                                .filter(review => !reportedReviews.includes(review.id)) // Filter out reported reviews
                                .map((review) => (
                                    <div key={review.id} className="review-item-container">
                                        <div className="review-header">
                                            <img src={review.profileImage || profileFallbackImage} alt="User" className="review-profile-image" />
                                            <div className="user-info" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                                <div style={{ width: 'fit-content' }}>
                                                    <p className="review-user-name">{review.user}</p>
                                                    <p className="review-date">
                                                        {formatDate(review.date)}
                                                    </p>
                                                </div>
                                                {renderRatingCircles(review.rating)}
                                            </div>
                                        </div>
                                        <p className="review-text-content">{review.text}</p>
                                        {/* Report Button */}
                                        <button
                                            className="report-button"
                                            onClick={() => handleReportReview(selectedReview.id, review.id)}
                                        >
                                            Reportar Reseña
                                        </button>
                                        {/* Display review-specific error */}
                                        {reviewReportErrors[review.id] && (
                                            <div className="review-error">{reviewReportErrors[review.id]}</div>
                                        )}
                                    </div>
                                ))
                        ) : (
                            <p>No hay reseñas para esta experiencia.</p>
                        )}
                    </div>

                    <div className="review-actions">
                        <button className="make-review-button" onClick={handleOpenReviewPopup}>
                            Hacer Reseña
                        </button>
                    </div>
                    {showReviewPopup && (
                        <div className="comment-popup-overlay">
                            <div className="comment-popup">
                                <span className="close-button-review" onClick={handleCloseReviewPopup}>×</span>
                                <p className="replying-to-popup">Escribe una reseña</p>
                                <div className="difficulty-container">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <div
                                            key={value}
                                            className={`difficulty-circle ${value <= rating ? 'selected' : ''}`}
                                            onClick={() => handleRatingClick(value)}
                                        ></div>
                                    ))}
                                </div>
                                {reviewError && <div className="review-error">{reviewError}</div>}
                                <textarea
                                    className="comment-input"
                                    placeholder="Introduce un texto"
                                    value={newReviewText}
                                    onChange={handleReviewTextChange}
                                />
                                <button className="publish-button" onClick={handlePublishReview}>Publicar</button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <div className="scroll-buttons-container-reviews">
                        <button className="scroll-button-reviews left-reviews" onClick={scrollLeft}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        <button className="scroll-button-reviews right-reviews" onClick={scrollRight}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                    <div className="reviews-wrapper-reviews" ref={reviewsContainerRef}>
                        {renderContent()}
                    </div>
                </>
            )}
        </div>
    );
}

export default ReviewsPage;