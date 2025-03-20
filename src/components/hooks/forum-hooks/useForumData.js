// --- START OF FILE useForumData.js ---
import { useState, useEffect } from 'react';
import { db } from '../../../firebase-config'; // Ensure correct path
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";

/**
 * Custom hook to fetch forum and comment data, including user details and dates.
 * @returns {Object}  An object containing the forum data, loading state, and error state.
 */
export const useForumData = () => {
    const [forumData, setForumData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchForumData = async () => {
            try {
                const forosSnapshot = await getDocs(query(collection(db, "Foros"), orderBy("Date", "desc"))); //order by most recent
                const forums = [];

                for (const foroDoc of forosSnapshot.docs) {
                    const foro = foroDoc.data();
                    foro.id = foroDoc.id;

                    // Fetch user data for the forum creator
                    let userForumData = {}; // Initialize to prevent errors if user data doesn't load
                    if (foro.Email) { //Check the Email exist
                        const userDocRef = doc(db, "Users", foro.Email);
                        const userDocSnap = await getDoc(userDocRef);
                        if (userDocSnap.exists()) {
                            userForumData = userDocSnap.data();
                        } else {
                            console.warn(`No user found for email: ${foro.Email}`);
                        }
                    }



                    // Fetch comments for each forum
                    const commentsQuery = query(collection(db, "Foros", foroDoc.id, "comments"), orderBy("Date", "asc")); //oldest comment first
                    const commentsSnapshot = await getDocs(commentsQuery);
                    const comments = [];

                    for (const commentDoc of commentsSnapshot.docs) {
                        const comment = commentDoc.data();
                        comment.id = commentDoc.id;

                        // Fetch user data for each comment
                        let userCommentData = {};  // Initialize to prevent errors
                        if (comment.Email) { //check exist the email
                            const userDocRef = doc(db, "Users", comment.Email);
                            const userDocSnap = await getDoc(userDocRef);
                            if (userDocSnap.exists()) {
                                userCommentData = userDocSnap.data();
                            }
        
                        }

                        // Combine comment data with user data
                        comments.push({
                            ...comment,
                            userName: userCommentData.userName || 'Usuario Desconocido', //Default Value in case the user get deleted
                            profileImage: userCommentData.profileImage || 'default_profile_image_url', // Provide a default image URL
                            commentDate: comment.Date, // Assuming you have a Date field in comments, ensure is a string
                        });
                    }


                    // Combine forum data with user data and comments
                    forums.push({
                        ...foro,
                        userName: userForumData.userName || 'Usuario Desconocido', //Default Value
                        profileImage: userForumData.profileImage || 'default_profile_image_url', //Default value
                        forumDate: foro.Date, // Assuming you have a Date field in forums, ensure is a string
                        comments: comments, //the array with the comments
                    });
                }

                setForumData(forums);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching forum data:", error);
                setError("Error al cargar los foros y comentarios");
                setLoading(false);
            }
        };

        fetchForumData();
    }, []);

    return { forumData, loading, error };
};


export default useForumData;
