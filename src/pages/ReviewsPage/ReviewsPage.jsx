// ReviewsPage.jsx - Updated with better responsiveness and improved styling
import React, { useRef, useState, useEffect } from 'react';
import './ReviewsPage.css';
import { useExperiences } from '../../components/hooks/experiences-hooks/useExperiences';
import ExperienceCard, { calculateAverageRating } from '../../components/experiences/ExperienceCard'; // Import calculateAverageRating
import '../ExperiencesPage/ExperiencesPage.css';
import { doc, updateDoc, getDoc, collection, serverTimestamp, getDocs, setDoc } from "firebase/firestore";
import { db } from './../../firebase-config';
import profileFallbackImage from '../../assets/images/landing-page/profile_managemente/profile_picture_1.png';
import { useAuth } from '../../components/contexts/AuthContext'; // Import useAuth hook
import LoadingState from '../../components/common/LoadingState/LoadingState';

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
    const { currentUser } = useAuth(); // Use the AuthContext
    
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
    const [userData, setUserData] = useState(null);
    const [isLoadingUserData, setIsLoadingUserData] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);

    // Check if device is mobile
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    // Fetch additional user data not provided by AuthContext
    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser) return;
            
            setIsLoadingUserData(true);
            try {
                const userDocRef = doc(db, "lista-de-usuarios", currentUser.email);
                const userDocSnap = await getDoc(userDocRef);
                
                if (userDocSnap.exists()) {
                    const data = userDocSnap.data();
                    const profileImageUrl = data['Foto de Perfil'] || profileFallbackImage;
                    const name = `${data.name || ''} ${data.lastName || ''}`.trim();
                    
                    setUserData({
                        email: currentUser.email,
                        profileImage: profileImageUrl,
                        userName: name || currentUser.displayName || "Usuario Anónimo"
                    });
                    
                    // Load reported reviews if any
                    setReportedReviews(data.reportedReviews || []);
                } else {
                    setUserData({
                        email: currentUser.email,
                        profileImage: profileFallbackImage,
                        userName: currentUser.displayName || "Usuario Anónimo"
                    });
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setIsLoadingUserData(false);
            }
        };
        
        fetchUserData();
    }, [currentUser]);

    // Modified to filter experiences by status - FIXED HERE
    useEffect(() => {
        if (experiences) {
            // Filter for only accepted experiences, just like in ExperiencesPage
            const filtered = experiences.filter(exp => {
                // Check if rawData exists and has status
                if (exp.rawData) {
                    // Include experiences with 'accepted' status or no status (for backward compatibility)
                    return exp.rawData.status === 'accepted' || exp.rawData.status === undefined;
                }
                return true; // Include experiences without rawData (shouldn't happen, but just in case)
            });
            setLocalExperiences(filtered);
        }
    }, [experiences]);

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
    }, [localExperiences]); 

    // Fixed scroll functions
    const scrollLeft = () => {
        if (reviewsContainerRef.current) {
            // Check if we're near the start to scroll all the way to the beginning
            const currentScrollPos = reviewsContainerRef.current.scrollLeft;
            
            if (currentScrollPos < 600) { // If we're close to the start, go to the beginning
                reviewsContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                // Otherwise, scroll by card width (or use a fixed amount that's enough to see previous card)
                const scrollAmount = isMobile ? -window.innerWidth * 0.9 : -600;
                reviewsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const scrollRight = () => {
        if (reviewsContainerRef.current) {
            // Use responsive scroll amount based on screen size
            const scrollAmount = isMobile ? window.innerWidth * 0.9 : 600;
            reviewsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Scroll to first experience
    const scrollToStart = () => {
        if (reviewsContainerRef.current) {
            reviewsContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
    };

    const handleViewMore = (experience) => {
        setSelectedReview(experience);
        setIsLoadingReviews(true);
        
        // Fetch reviews for this specific experience
        const fetchExperienceReviews = async () => {
            try {
                const experienceRef = doc(db, 'Experiencias', experience.id);
                const reviewsCollectionRef = collection(experienceRef, 'reviews');
                const querySnapshot = await getDocs(reviewsCollectionRef);

                const reviews = [];
                querySnapshot.forEach((doc) => {
                    reviews.push({ id: doc.id, ...doc.data() });
                });

                const averageRating = calculateAverageRating(reviews);
                
                // Update reviews for this specific experience
                setAllReviews(prevReviews => ({
                    ...prevReviews,
                    [experience.id]: reviews,
                    [`${experience.id}-averageRating`]: averageRating
                }));
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setError("Error al cargar las reseñas");
            } finally {
                // Add a small delay to prevent flashing if loading is too quick
                setTimeout(() => {
                    setIsLoadingReviews(false);
                }, 500);
            }
        };
        
        fetchExperienceReviews();
    };

    const handleBackToReviews = () => {
        setSelectedReview(null);
        setIsLoadingReviews(false);
        // When going back to review list, ensure we're scrolled to the start
        setTimeout(scrollToStart, 100);
    };

    const handleReportReview = async (experienceId, reviewId) => {
        if (!currentUser) {
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

        if (reviewToReport.userEmail === currentUser.email) {
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
            const userDocRef = doc(db, "lista-de-usuarios", currentUser.email);
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
        if (!currentUser || !userData) {
            setError("Debes iniciar sesión para publicar una reseña.");
            setTimeout(() => setError(null), 5000);
            return;
        }
        
        if (!newReviewText.trim()) {
            setReviewError("La reseña no puede estar vacía.");
            return;
        }
        
        if (!selectedReview) {
            setError("Error: No se ha seleccionado una experiencia.");
            setTimeout(() => setError(null), 5000);
            return;
        }
        
        if (rating === 0) {
            setReviewError("Por favor, selecciona una puntuación.");
            return;
        }

        try {
            const experienceRef = doc(db, 'Experiencias', selectedReview.id);
            const reviewsCollectionRef = collection(experienceRef, 'reviews');
            const userReviewRef = doc(reviewsCollectionRef, currentUser.email);

            // Use a Date object for immediate display
            const now = new Date();
            const newReview = {
                user: userData.userName,
                text: newReviewText,
                date: now, // Store the immediate Date object
                userEmail: currentUser.email,
                profileImage: userData.profileImage,
                rating: rating,
            };
            
            // First update the local state, then the DB
            setAllReviews(prevReviews => {
                const existingReviews = prevReviews[selectedReview.id] || [];
                const reviewIndex = existingReviews.findIndex(review => review.userEmail === currentUser.email);

                if (reviewIndex > -1) {
                    existingReviews[reviewIndex] = { ...newReview, id: currentUser.email };
                } else {
                    existingReviews.push({ ...newReview, id: currentUser.email });
                }
                const averageRating = calculateAverageRating(existingReviews);

                return {
                    ...prevReviews,
                    [selectedReview.id]: existingReviews,
                    [`${selectedReview.id}-averageRating`]: averageRating
                };
            });
                
            // Now update the database. Firebase will handle the server timestamp.
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
            return <LoadingState text="Cargando experiencias..." />;
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
    
    // Custom loading spinner component for reviews
    const ReviewsLoadingSpinner = () => (
        <div className="reviews-loading-container">
            <div className="reviews-loading-text">Cargando reseñas...</div>
            <div className="reviews-loading-spinner"></div>
        </div>
    );
    
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
                    <div className='flex w-full justify-center'>
                        <ExperienceCard
                            key={selectedReview.id}
                            experience={{
                                ...selectedReview,
                                reviews: allReviews[selectedReview.id] || [], // Pass reviews even for selected review
                            }}
                            isExpanded={true}
                            isReviewsPage={true}
                            onViewMore={handleViewMore} // Pass the required onViewMore prop
                        />  
                    </div>
                    

                    <div className="reviews-list">
                        {isLoadingReviews ? (
                            <ReviewsLoadingSpinner />
                        ) : allReviews[selectedReview.id] && allReviews[selectedReview.id].length > 0 ? (
                            allReviews[selectedReview.id]
                                .filter(review => !reportedReviews.includes(review.id)) // Filter out reported reviews
                                .map((review) => (
                                    <div key={review.id} className="review-item-container">
                                        <div className="review-header">
                                            <img 
                                                src={review.profileImage || profileFallbackImage} 
                                                alt="User" 
                                                className="review-profile-image" 
                                            />
                                            <div className="user-info">
                                                <div>
                                                    <p className="review-user-name">{review.user}</p>
                                                    <p className="review-date">{formatDate(review.date)}</p>
                                                </div>
                                                {renderRatingCircles(review.rating)}
                                            </div>
                                        </div>
                                        <p className="review-text-content">{review.text}</p>
                                        <button
                                            className="report-button"
                                            onClick={() => handleReportReview(selectedReview.id, review.id)}
                                        >
                                            Reportar Reseña
                                        </button>
                                        {reviewReportErrors[review.id] && (
                                            <div className="review-error">{reviewReportErrors[review.id]}</div>
                                        )}
                                    </div>
                                ))
                        ) : (
                            <div className="empty-reviews-message">
                                <p>No hay reseñas para esta experiencia.</p>
                                <p>¡Sé el primero en dejar tu opinión!</p>
                            </div>
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