// useGalleryMetrics.js
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase-config';

const useGalleryMetrics = () => {
  const [publishedImages, setPublishedImages] = useState(0);
  const [reportedImages, setReportedImages] = useState(0);
  const [participatingUsers, setParticipatingUsers] = useState(0);
  const [createdHashtags, setCreatedHashtags] = useState(0);
  const [usedHashtags, setUsedHashtags] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use Sets to track unique uploaders and reporters
        let uploaders = new Set();
        let reporters = new Set();
        let totalUsedHashtags = 0;
        let totalPublishedImages = 0; // Use local variables for counting
        let totalReportedImages = 0;

        // --- Published Images Count and Participating Users (Uploaders) ---
        const galeriaRef = collection(db, 'Galeria de Imágenes');
        const galeriaSnapshot = await getDocs(galeriaRef);

        for (const userDoc of galeriaSnapshot.docs) {
          const userDocRef = doc(db, 'Galeria de Imágenes', userDoc.id);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData.images && Array.isArray(userData.images)) {
              totalPublishedImages += userData.images.length; // Increment local count
              uploaders.add(userDoc.id);  // Add uploader's email to the Set

              // Count all used hashtags
              for (const image of userData.images) {
                if (image.hashtags && Array.isArray(image.hashtags)) {
                  totalUsedHashtags += image.hashtags.length;
                }
              }
            }
          }
        }
        setPublishedImages(totalPublishedImages); // Update state with local count


        // --- Reported Images Count and Participating Users (Reporters) ---
        const reportedRef = collection(db, 'Imágenes Reportadas');
        const reportedSnapshot = await getDocs(reportedRef);

        for (const reportDoc of reportedSnapshot.docs) {
          const reportDocRef = doc(db, "Imágenes Reportadas", reportDoc.id);
          const reportDocSnap = await getDoc(reportDocRef);

          if (reportDocSnap.exists()) {
            const reportData = reportDocSnap.data();
            if (reportData.images && Array.isArray(reportData.images)) {
              totalReportedImages += reportData.images.length; // Increment local count
              reporters.add(reportDoc.id); // Add reporter's email to the Set
            }
          }
        }
        setReportedImages(totalReportedImages); // Update state with local count

        // Combine unique uploaders and reporters
        const allParticipants = new Set([...uploaders, ...reporters]);
        setParticipatingUsers(allParticipants.size); // Total unique participants
        setUsedHashtags(totalUsedHashtags);

        // --- Created Hashtags Count ---
        const hashtagsRef = collection(db, 'Hashtags');
        const hashtagsSnapshot = await getDocs(hashtagsRef);
        setCreatedHashtags(hashtagsSnapshot.size);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    publishedImages,
    reportedImages,
    participatingUsers,
    createdHashtags,
    usedHashtags,
    loading,
    error
  };
};

export default useGalleryMetrics;