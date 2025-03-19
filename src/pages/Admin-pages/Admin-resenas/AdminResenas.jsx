// AdminResenas.jsx
import React, { useState, useEffect } from 'react';
import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection";
import { adminBaseStyles } from '../../../components/Admin-components/adminBaseStyles';
import useReviewMetrics from '../../../components/hooks/reviews-hooks/useReviewMetrics';
import LoadingState from '../../../components/common/LoadingState/LoadingState';
import { db } from '../../../firebase-config';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import profileFallbackImage from '/src/assets/images/landing-page/profile_managemente/profile_picture_1.webp';
import './AdminResenas.css';

const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';

    let date; // Declare date here

    if (typeof timestamp === 'string') return timestamp;

    if (timestamp instanceof Date) {
        date = timestamp; // Assign to date
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    }

    if (timestamp.toDate) {
        date = timestamp.toDate(); // Assign to date
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    }

    return 'Fecha no disponible';
};

const AdminReviewCard = ({ review, onDelete, isDeleting }) => {
    const rating = typeof review.rating === 'number' ? review.rating : 0;

    return (
        <div className={`admin-review-card ${isDeleting ? 'deleting' : ''}`}>
            <div className="review-header">
                <img src={review.profileImage || profileFallbackImage} alt={review.user || "Usuario"} className="review-profile-image" />
                <div className="review-user-info">
                    <p className="review-user-name">{review.user || "Usuario Anónimo"}</p>
                    <p className="review-date">{formatDate(review.date)}</p>
                    <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className={`review-star ${i < rating ? 'filled' : ''}`}>★</span>
                        ))}
                    </div>
                </div>
            </div>
            <p className="review-experience-name">Experiencia: {review.experienceId}</p>
            <p className="review-text">{review.text}</p>
            <button className="delete-review-button" onClick={() => onDelete(review.experienceId, review.id, review.user)}>
                Borrar Reseña
            </button>
        </div>
    );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay-gallery">
            <div className="modal-content-container-gallery delete-modal">
                <p>{message || "¿Estás seguro de que quieres borrar esta reseña?"}</p>
                <div className="modal-buttons">
                    <button className="confirm-button" onClick={onConfirm}>Confirmar</button>
                    <button className="cancel-button" onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

const AdminResenas = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { totalReviews, reviews5e, reviews4e, reviews3e, reviews2e, reviews1e, loading, error } = useReviewMetrics(refreshTrigger);
    const [allReviews, setAllReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewsError, setReviewsError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);
    const [deletingReview, setDeletingReview] = useState(null);
    
    // Local metrics state for immediate updates
    const [localMetrics, setLocalMetrics] = useState({
        totalReviews: 0,
        reviews5e: 0,
        reviews4e: 0,
        reviews3e: 0,
        reviews2e: 0,
        reviews1e: 0
    });

    // Update local metrics when the fetched metrics change
    useEffect(() => {
        if (!loading && !error) {
            setLocalMetrics({
                totalReviews,
                reviews5e,
                reviews4e,
                reviews3e,
                reviews2e,
                reviews1e
            });
        }
    }, [totalReviews, reviews5e, reviews4e, reviews3e, reviews2e, reviews1e, loading, error]);

    useEffect(() => {
        const fetchReviews = async () => {
            setReviewsLoading(true);
            setReviewsError(null);
            try {
                const experiencesRef = collection(db, 'Experiencias');
                const experiencesSnapshot = await getDocs(experiencesRef);
                let allReviewsData = [];

                for (const expDoc of experiencesSnapshot.docs) {
                    const rawData = expDoc.data().rawData;
                    if (rawData && !(rawData.status === 'accepted' || rawData.status === undefined)) continue;
                    const reviewsRef = collection(db, 'Experiencias', expDoc.id, 'reviews');
                    const reviewsSnapshot = await getDocs(reviewsRef);
                    reviewsSnapshot.forEach((reviewDoc) => {
                        const reviewData = reviewDoc.data();
                        const rating = typeof reviewData.rating === 'number' ? reviewData.rating : 0;
                        allReviewsData.push({ id: reviewDoc.id, ...reviewData, rating: rating, experienceId: expDoc.id });
                    });
                }
                setAllReviews(allReviewsData);
            } catch (err) {
                console.error("Error fetching reviews:", err);
                setReviewsError("Error al cargar las reseñas.");
            } finally {
                setReviewsLoading(false);
            }
        };
        fetchReviews();
    }, [refreshTrigger]);

    // Initiate deletion process (show modal)
    const handleDeleteReview = (experienceId, reviewId, userName) => {
        setReviewToDelete({ experienceId, reviewId, userName });
        setIsDeleteModalOpen(true);
    };

    // Confirm deletion (called from modal)
    const handleConfirmDelete = async () => {
        if (!reviewToDelete) return;

        setDeleteError(null);
        try {
            const { experienceId, reviewId } = reviewToDelete;
            
            // Find the review to get its rating before deletion
            const reviewToRemove = allReviews.find(review => review.id === reviewId);
            
            // Set the specific review as deleting using a composite key
            setDeletingReview({
                experienceId,
                reviewId
            });
            
            // Wait for animation before actually deleting
            setTimeout(async () => {
                const reviewRef = doc(db, 'Experiencias', experienceId, 'reviews', reviewId);
                await deleteDoc(reviewRef);
                
                // Update UI in two ways:
                // 1. Immediate filter to remove deleted review
                setAllReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
                
                // 2. Update local metrics immediately
                if (reviewToRemove) {
                    setLocalMetrics(prev => {
                        const rating = reviewToRemove.rating || 0;
                        const newMetrics = { ...prev, totalReviews: prev.totalReviews - 1 };
                        
                        // Decrement the specific star count
                        if (rating === 5) newMetrics.reviews5e -= 1;
                        else if (rating === 4) newMetrics.reviews4e -= 1;
                        else if (rating === 3) newMetrics.reviews3e -= 1;
                        else if (rating === 2) newMetrics.reviews2e -= 1;
                        else if (rating === 1) newMetrics.reviews1e -= 1;
                        
                        return newMetrics;
                    });
                }
                
                // 3. Trigger a backend refresh for consistency
                setRefreshTrigger(prev => prev + 1);
                
                // Reset the deleting state
                setDeletingReview(null);
            }, 500); // Matching transition time in CSS
            
        } catch (err) {
            console.error("Error deleting review:", err);
            setDeleteError("Failed to delete the review.");
            setDeletingReview(null);
        } finally {
            setIsDeleteModalOpen(false);
            setReviewToDelete(null);
        }
    };

    // Cancel deletion (called from modal)
    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setReviewToDelete(null);
    };

    if (loading || reviewsLoading) {
        return <LoadingState text={loading ? "Cargando estadísticas..." : "Cargando reseñas..."} />;
    }

    if (error || reviewsError) {
        return (
            <div className={`inset-0 mx-32 my-8 flex flex-col justify-start items-start px-8 md:px-16 ${adminBaseStyles}`}>
                <p className="text-red-500">Error: {error || reviewsError}</p>
                <button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Reintentar
                </button>
            </div>
        );
    }
    if (deleteError) {
        return (
            <div className={`inset-0 mx-32 my-8 flex flex-col justify-start items-start px-8 md:px-16 ${adminBaseStyles}`}>
                <p className="text-red-500">{deleteError}</p>
                <button onClick={() => setDeleteError(null)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    OK
                </button>
            </div>
        );
    }

    return (
        <div className={`inset-0 mx-4 md:mx-8 lg:mx-32 my-8 flex flex-col justify-start items-start px-4 md:px-8 lg:px-16 ${adminBaseStyles}`}>
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold">Reseñas</h1>
            <h1 className="text-white text-base md:text-lg">Nuestros usuarios nos dejan su puntuación...</h1>
            <hr className="border-1 border-white-600 w-full md:w-96" />
            <h1 className="text-white text-2xl md:text-3xl font-bold">Informacion Relevante</h1>
            <div className="flex flex-wrap justify-start gap-4 md:gap-6 lg:gap-10 my-4">
                <RelevantInfoS number={localMetrics.totalReviews} description="Reseñas Recibidas" />
                <RelevantInfoS number={localMetrics.reviews5e} description="Reseñas con 5 estrellas" />
                <RelevantInfoS number={localMetrics.reviews4e} description="Reseñas con 4 estrellas" />
                <RelevantInfoS number={localMetrics.reviews3e} description="Reseñas con 3 estrellas" />
                <RelevantInfoS number={localMetrics.reviews2e} description="Reseñas con 2 estrellas" />
                <RelevantInfoS number={localMetrics.reviews1e} description="Reseñas con 1 estrella" />
            </div>
            <hr className="border-1 border-white-600 w-full md:w-96" />

            <h2 className="text-xl md:text-2xl font-bold text-white mt-8">Todas las Reseñas</h2>
            <div className="admin-reviews-grid">
                {allReviews.map((review) => (
                    <AdminReviewCard 
                        key={`${review.experienceId}-${review.id}`} 
                        review={review} 
                        onDelete={handleDeleteReview}
                        isDeleting={deletingReview && 
                                   deletingReview.reviewId === review.id && 
                                   deletingReview.experienceId === review.experienceId} 
                    />
                ))}
            </div>

            {/* Render the confirmation modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};

export default AdminResenas;