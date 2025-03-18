import { useState, useEffect } from 'react';
import { db } from '../../../firebase-config'; // Make sure the path is correct
import { collection, getDocs, query } from "firebase/firestore";

/**
 * Custom hook to fetch forum metrics for the admin dashboard.
 * @returns {Object} Forum metrics
 */
export const useForumMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalForos: 0,
    totalComments: 0,
    reportedForums: 0,
    reportedComments: 0,
    participatingUsers: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Fetch total forums
        const forosSnapshot = await getDocs(collection(db, "Foros"));
        const totalForos = forosSnapshot.size;

        // Fetch total comments and participating users
        let totalComments = 0;
        const userIds = new Set();

        for (const foroDoc of forosSnapshot.docs) {
          const commentsQuery = query(collection(db, "Foros", foroDoc.id, "comments"));
          const commentsSnapshot = await getDocs(commentsQuery);
          totalComments += commentsSnapshot.size;

          commentsSnapshot.forEach(commentDoc => {
            const commentData = commentDoc.data();
            if (commentData && commentData.Email) {
              userIds.add(commentData.Email);
            }
          });

          const foroData = foroDoc.data();
          if (foroData && foroData.Email) {
            userIds.add(foroData.Email);
          }
        }
         const participatingUsers = userIds.size;


        // Fetch Reported Forums and Comments
        const reportsSnapshot = await getDocs(collection(db, "Reported Forums and Comments"));
        let reportedForums = 0;
        let reportedComments = 0;

        for (const reportDoc of reportsSnapshot.docs) {
            const reportData = reportDoc.data(); // Access the document data

            if (reportData && Array.isArray(reportData.forumData)) { //check if reportData exists
                reportedForums += reportData.forumData.filter(item => item && item.type === "forum").length;  // Count forum reports
            }
            if(reportData && Array.isArray(reportData.commentData)){
                reportedComments += reportData.commentData.filter(item => item && item.type === "comment").length;
            }
            else if (reportData && Array.isArray(reportData.comments)) { //check the old way to report
                    reportedComments += reportData.comments.length; //old way to report comments
            }
        }

        // Update state with calculated metrics
        setMetrics({
          totalForos,
          totalComments,
          reportedForums,
          reportedComments,
          participatingUsers,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching forum metrics:", error);
        setMetrics(prev => ({
          ...prev,
          loading: false,
          error: "Error al cargar métricas del foro",
        }));
      }
    };

    fetchMetrics();
  }, []);

  return metrics;
};

export default useForumMetrics;