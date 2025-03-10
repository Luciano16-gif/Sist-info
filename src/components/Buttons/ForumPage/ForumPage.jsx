// ForumPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, getDoc, query, orderBy, setDoc } from "firebase/firestore";
import { db } from './../../../firebase-config';
import './ForumPage.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage"; // Imports are present but not directly used here


const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe();
            if (user) {
                try {
                    const userDocRef = doc(db, "Lista de Usuarios", user.email);
                    const userDocSnap = await getDoc(userDocRef);
                    if (!userDocSnap.exists()) {
                        console.warn("Usuario no encontrado en Firestore:", user.email);
                        // Fallback to default image and anonymous user
                        resolve({
                            email: user.email,
                            profileImage: "url_por_defecto.jpg",  // Default URL if user not found
                            userName: "Usuario Anónimo"
                        });
                        return;
                    }
                    const userData = userDocSnap.data();
                    let profileImageUrl = "url_por_defecto.jpg"; // Default image

                    // Get the profile image URL *if it exists*
                    if (userData['Foto de Perfil']) {
                        profileImageUrl = userData['Foto de Perfil']; // Use the URL from Firestore
                    }

                    resolve({
                        email: user.email,
                        profileImage: profileImageUrl, // This is the key: using the stored URL
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

function ForumPage() {
    const forumContainerRef = useRef(null);
    const [showComments, setShowComments] = useState(null);
    const [forums, setForums] = useState([]);
    const [comments, setComments] = useState([]);
    const [loadingForums, setLoadingForums] = useState(true);
    const [loadingComments, setLoadingComments] = useState(false);
    const [error, setError] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyingToUserName, setReplyingToUserName] = useState(null);
    const [showCommentPopup, setShowCommentPopup] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [targetForumId, setTargetForumId] = useState(null);
    const [showCreateForumPopup, setShowCreateForumPopup] = useState(false);
    const [newForumTitle, setNewForumTitle] = useState("");
    const [newForumDescription, setNewForumDescription] = useState("");


    useEffect(() => {
        const fetchForums = async () => {
            setLoadingForums(true);
            setError(null);
            try {
                const forumsRef = collection(db, "Foros");
                const q = query(forumsRef, orderBy("ID")); // Keep ordering for consistency
                const querySnapshot = await getDocs(q);
                const fetchedForums = [];
                for (const docSnap of querySnapshot.docs) {
                    const forumData = docSnap.data();
                    let profileImageUrl = "url_por_defecto.jpg"; // Default

                    // Fetch profile image URL from "Lista de Usuarios"
                    if (forumData.Email) {
                        const userDocRef = doc(db, "Lista de Usuarios", forumData.Email);
                        const userDocSnap = await getDoc(userDocRef);
                        if (userDocSnap.exists()) {
                            const userData = userDocSnap.data();
                            // Use 'Foto de Perfil' if it exists
                            if (userData['Foto de Perfil']) {
                                profileImageUrl = userData['Foto de Perfil']; // Use the URL
                            }
                        }
                    }
                    fetchedForums.push({
                        ...forumData,
                        firestoreId: docSnap.id,
                        profileImage: profileImageUrl, // Set the profile image URL
                    });
                }
                setForums(fetchedForums);
            } catch (err) {
                console.error("Error al cargar los foros:", err);
                setError("Error al cargar los foros: " + err.message);
            } finally {
                setLoadingForums(false);
            }
        };
        fetchForums();
    }, []);

    useEffect(() => {
        const fetchComments = async (forumId) => {
            setLoadingComments(true);
            setError(null);
            try {
                const commentsRef = collection(db, "Foros", forumId, "comments");
                const q = query(commentsRef, orderBy("ID"));
                const querySnapshot = await getDocs(q);
                const fetchedComments = [];
                for (const docSnap of querySnapshot.docs) {
                    const commentData = docSnap.data();
                    let profileImageUrl = "url_por_defecto.jpg"; // Default

                    if (commentData.Email) {
                        const userDocRef = doc(db, "Lista de Usuarios", commentData.Email);
                        const userDocSnap = await getDoc(userDocRef);
                        if (userDocSnap.exists()) {
                            const userData = userDocSnap.data();
                            // Use 'Foto de Perfil'
                            if (userData['Foto de Perfil']) {
                                profileImageUrl = userData['Foto de Perfil']; // Use the URL
                            }
                        }
                    }
                    fetchedComments.push({
                        ...commentData,
                        firestoreId: docSnap.id,
                        profileImage: profileImageUrl,  // Set the profile image URL
                    });
                }
                setComments(fetchedComments);
            } catch (err) {
                console.error("Error al cargar los comentarios:", err);
                setError("Error al cargar los comentarios: " + err.message);
            } finally {
                setLoadingComments(false);
            }
        };
        if (showComments) {
            fetchComments(showComments);
        } else {
            setComments([]);
        }
    }, [showComments]);

    const scrollLeft = () => {
        if (forumContainerRef.current) {
            forumContainerRef.current.scrollBy({ left: -520, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (forumContainerRef.current) {
            forumContainerRef.current.scrollBy({ left: 520, behavior: 'smooth' });
        }
    };

    const handleViewComments = (forumId) => {
        setShowComments(forumId);
    };

    const handleAddComment = (forumId) => {
        const user = getCurrentUser();
        if (!user) {
            setError("Debes iniciar sesión para comentar.");
            return;
        }
        setTargetForumId(forumId);
        setShowComments(forumId);
        setShowCommentPopup(true);
    };

    const handleAddCommentToComment = (forumId, commentId, replyingToUser) => {
        const user = getCurrentUser();
        if (!user) {
            setError("Debes iniciar sesión para comentar.");
            return;
        }
        setReplyingTo(commentId);
        setReplyingToUserName(replyingToUser);
        setTargetForumId(forumId);
        setShowCommentPopup(true);
    };

    const handleCloseCommentPopup = () => {
        setShowCommentPopup(false);
        setReplyingTo(null);
        setNewComment("");
        setReplyingToUserName(null);
    };

    const handleCommentInputChange = (event) => {
        setNewComment(event.target.value);
    };

    const handlePublishComment = async () => {
        const user = await getCurrentUser();
        if (!user) {
            setError("Debes iniciar sesión para publicar un comentario.");
            return;
        }
        if (!newComment.trim()) {
            setError("El comentario no puede estar vacío.");
            return;
        }
        if (!targetForumId) {
            setError("Error interno: No se especificó el foro de destino.");
            return;
        }
        try {
            const forumRef = doc(db, "Foros", targetForumId);
            const forumSnap = await getDoc(forumRef);
            if (!forumSnap.exists()) {
                setError("El foro no existe.");
                return;
            }
            const commentsRef = collection(db, "Foros", targetForumId, "comments");
            let newCommentId;
            if (replyingTo) {
                const parentComment = comments.find(c => c.firestoreId === replyingTo);
                if (!parentComment) {
                    setError("No se ha encontrado el comentario principal al que se va a responder");
                    return;
                }
                const replyCount = comments.filter(c => c.ID && c.ID.startsWith(parentComment.ID + ".")).length;
                newCommentId = `${parentComment.ID}.${replyCount + 1}`;
            } else {
                const commentsSnap = await getDocs(commentsRef);
                newCommentId = `${targetForumId}.${commentsSnap.size + 1}`;
            }
            const newCommentData = {
                ID: newCommentId,
                description: newComment,
                Email: user.email,
                Date: new Date().toLocaleDateString('es-ES'),
                replyingTo: replyingToUserName || null,
                userName: user.userName,
                profileImage: user.profileImage, // Use stored URL
            };
            await setDoc(doc(commentsRef, newCommentId), newCommentData);
            setComments([...comments, { ...newCommentData, firestoreId: newCommentId }]);
            setShowCommentPopup(false);
            setNewComment("");
            setReplyingTo(null);
            setReplyingToUserName(null);
        } catch (err) {
            console.error("Error al publicar el comentario:", err);
            setError("Error al publicar el comentario: " + err.message);
        }
    };

    const handleBackToForums = () => {
        setShowComments(null);
        setReplyingTo(null);
        setTargetForumId(null);
        setReplyingToUserName(null);
    };

    const handleCreateTopic = () => {
        const user = getCurrentUser();
        if (!user) {
            setError("Debes iniciar sesión para crear un tema.");
            return;
        }
        setShowCreateForumPopup(true);
    };

    const handleCloseCreateForumPopup = () => {
        setShowCreateForumPopup(false);
        setNewForumTitle("");
        setNewForumDescription("");
    };

    const handleForumTitleChange = (event) => {
        setNewForumTitle(event.target.value);
    };

    const handleForumDescriptionChange = (event) => {
        setNewForumDescription(event.target.value);
    };

    const handlePublishForum = async () => {
        const user = await getCurrentUser();
        if (!user) {
            setError("Debes iniciar sesión para publicar un foro.");
            return;
        }
        if (!newForumTitle.trim() || !newForumDescription.trim()) {
            setError("El título y la descripción no pueden estar vacíos.");
            return;
        }
        try {
            const forumsRef = collection(db, "Foros");
            // --- KEY CHANGE: Find the highest existing ID ---
            const forumsSnap = await getDocs(forumsRef);
            let highestId = 0;
            forumsSnap.forEach(docSnap => {
                const id = parseInt(docSnap.data().ID);
                if (!isNaN(id) && id > highestId) {
                    highestId = id;
                }
            });
            const newForumId = String(highestId + 1); // Increment the highest ID.
            // --- END KEY CHANGE ---

            const newForumData = {
                ID: newForumId,
                Title: newForumTitle,
                description: newForumDescription,
                Email: user.email,
                Date: new Date().toLocaleDateString('es-ES'),
                userName: user.userName,
                profileImage: user.profileImage,  // Use stored URL
            };
            await setDoc(doc(db, "Foros", newForumId), newForumData);

            // Add to the local state *using the correct firestoreId*
            setForums([...forums, { ...newForumData, firestoreId: newForumId }]);

            setShowCreateForumPopup(false);
            setNewForumTitle("");
            setNewForumDescription("");
        } catch (err) {
            console.error("Error al publicar el foro:", err);
            setError("Error al publicar el foro: " + err.message);
        }
    };

    const selectedForum = forums.find(f => f.firestoreId === showComments);

    if (loadingForums) {
        return <div>Cargando foros...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="forum-page-forum">
            <h1 className="forum-title-forum">Foros</h1>
            <div className="forum-wrapper-forum">
                {showComments ? (
                    <div className="comments-view-forum">
                        <button className="back-button-forum" onClick={handleBackToForums}>
                            {"< Volver a Foros"}
                        </button>
                        {selectedForum ? (
                            <div className="original-post-forum">
                                <div className="profile-image-container-forum">
                                    {/* Display the image using the stored URL */}
                                    <img src={selectedForum.profileImage} alt="Profile" className="profile-image-forum" />
                                </div>
                                <div className="forum-content-forum">
                                    <h2 className="forum-subtitle-forum">{selectedForum.Title}</h2>
                                    <p className='forum-date-forum'>{selectedForum.Date}</p>
                                    <p className="forum-text-forum forum-text-no-fade-forum">{selectedForum.description}</p>
                                    <div className="forum-buttons-forum" style={{ marginLeft: "auto", marginRight: "auto", marginTop: "10px" }}>
                                        <span className="forum-button-forum" onClick={() => handleAddComment(selectedForum.firestoreId, selectedForum.userName)}>
                                            Comentar
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>No se ha seleccionado ningún foro, o el foro no existe.</div>
                        )}
                        <div className="comments-container-forum">
                            {loadingComments ? (
                                <div>Cargando comentarios...</div>
                            ) : (
                                comments.map(comment => (
                                    <div className="comment-item-forum" key={comment.firestoreId}>
                                        <div className="profile-image-container-forum">
                                            {/* Display image using stored URL */}
                                            <img src={comment.profileImage} alt="Profile" className="profile-image-forum" />
                                        </div>
                                        <div className="comment-content-forum">
                                            <p className="comment-user-forum">
                                                {comment.userName}
                                                {comment.replyingTo && <span className="replying-to-text"> Respondiendo a {comment.replyingTo}</span>}
                                            </p>
                                            <p className="comment-date-forum">{comment.Date}</p>
                                            <p className="comment-text-forum">{comment.description}</p>
                                            <div className="comment-button-container-forum">
                                                <span className="forum-button-forum" onClick={() => handleAddCommentToComment(selectedForum.firestoreId, comment.firestoreId, comment.userName)}>Comentar</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {showCommentPopup && (
                            <div className="comment-popup-overlay">
                                <div className="comment-popup">
                                    <span className="close-button" onClick={handleCloseCommentPopup}>×</span>
                                    <p className="replying-to-popup">
                                        {replyingToUserName ? `Respondiendo a ${replyingToUserName}` : 'Escribe un comentario'}
                                    </p>
                                    <textarea
                                        className="comment-input"
                                        placeholder="Introduce un texto"
                                        value={newComment}
                                        onChange={handleCommentInputChange}
                                    />
                                    <button className="publish-button" onClick={handlePublishComment}>Publicar</button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="scroll-buttons-container-forum">
                            <button className="scroll-button-forum left-forum" onClick={scrollLeft}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>
                            <button className="scroll-button-forum right-forum" onClick={scrollRight}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>
                        </div>
                        <div className="forum-container-forum" ref={forumContainerRef}>
                            {forums.map((forum) => (
                                <div className="forum-item-forum" key={forum.firestoreId}>
                                    <div className="profile-image-container-forum">
                                        {/*  Display the image using stored URL */}
                                        <img src={forum.profileImage} alt="Profile" className="profile-image-forum" />
                                    </div>
                                    <div className="forum-content-forum">
                                        <h2 className="forum-subtitle-forum">{forum.Title}</h2>
                                        <p className='forum-date-forum'>{forum.Date}</p>
                                        <p className="forum-text-forum">{forum.description}</p>
                                        <div className="forum-buttons-forum">
                                            <span className="forum-button-forum" onClick={() => handleViewComments(forum.firestoreId)}>
                                                Ver Comentarios
                                            </span>
                                            <span className="forum-button-forum" onClick={() => handleAddComment(forum.firestoreId)}>
                                                Comentar
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="create-topic-button-forum" onClick={handleCreateTopic}>
                            Crear un Tema
                        </button>
                        {showCreateForumPopup && (
                            <div className="comment-popup-overlay">
                                <div className="comment-popup">
                                    <span className="close-button" onClick={handleCloseCreateForumPopup}>
                                        ×
                                    </span>
                                    <p className="replying-to-popup">Crear Nuevo Foro</p>
                                    <input
                                        type="text"
                                        className="comment-input"
                                        placeholder="Título del foro"
                                        value={newForumTitle}
                                        onChange={handleForumTitleChange}
                                        style={{ height: "45px" }}
                                    />
                                    <textarea
                                        className="comment-input"
                                        placeholder="Descripción del foro"
                                        value={newForumDescription}
                                        onChange={handleForumDescriptionChange}
                                    />
                                    <button className="publish-button" onClick={handlePublishForum}>
                                        Publicar Foro
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ForumPage;