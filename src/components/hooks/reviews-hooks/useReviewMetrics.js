// useReviewMetrics.js
import { useState, useEffect } from 'react';
import { db } from '../../../firebase-config'; // Correct path
import { collection, getDocs, doc } from 'firebase/firestore';

export const useReviewMetrics = () => {
    const [metrics, setMetrics] = useState({
        totalReviews: 0,
        reviews5e: 0,
        reviews4e: 0,
        reviews3e: 0,
        reviews2e: 0,
        reviews1e: 0,
        loading: true,
        error: null,
    });

    useEffect(() => {
        const fetchReviewStats = async () => {
            try {
                const experiencesRef = collection(db, 'Experiencias');
                const experiencesSnapshot = await getDocs(experiencesRef);

                let totalReviews = 0;
                let reviews1e = 0;
                let reviews2e = 0;
                let reviews3e = 0;
                let reviews4e = 0;
                let reviews5e = 0;

                for (const expDoc of experiencesSnapshot.docs) {
                    // Check if rawData exists and has status
                    const rawData = expDoc.data().rawData;
                    if (rawData) {
                        // Include experiences with 'accepted' status or no status
                        if (!(rawData.status === 'accepted' || rawData.status === undefined)) continue;
                    }

                    const reviewsRef = collection(db, 'Experiencias', expDoc.id, 'reviews');
                    const reviewsSnapshot = await getDocs(reviewsRef);

                    reviewsSnapshot.forEach((reviewDoc) => {
                        const reviewData = reviewDoc.data();
                        const rating = reviewData.rating;

                        totalReviews++;
                        if (rating === 1) reviews1e++;
                        if (rating === 2) reviews2e++;
                        if (rating === 3) reviews3e++;
                        if (rating === 4) reviews4e++;
                        if (rating === 5) reviews5e++;
                    });
                }

                setMetrics({
                    totalReviews,
                    reviews1e,
                    reviews2e,
                    reviews3e,
                    reviews4e,
                    reviews5e,
                    loading: false,
                    error: null,
                });
            } catch (err) {
                console.error("Error fetching review statistics:", err);
                setMetrics(prev => ({
                    ...prev,
                    loading: false,
                    error: "Error al cargar las estadísticas de reseñas.",
                }));
            }
        };

        fetchReviewStats();
    }, []);

    return metrics;
};

export default useReviewMetrics;