// ForumPage.jsx (navigate to route and show popup - CORRECTED)
import React, { useState, useRef, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, getDoc, query, orderBy, setDoc, updateDoc } from "firebase/firestore";
import { db } from './../../../firebase-config';
import './ForumPage.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useLocation, useNavigate, useParams } from 'react-router-dom';

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

function ForumPage() {
    const forumContainerRef = useRef(null);
    const [forums, setForums] = useState([]);
    const [comments, setComments] = useState([]);
    const [loadingForums, setLoadingForums] = useState(true);
    const [loadingComments, setLoadingComments] = useState(false);
    const [error, setError] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyingToUserName, setReplyingToUserName] = useState(null);
    const [showCommentPopup, setShowCommentPopup] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [showCreateForumPopup, setShowCreateForumPopup] = useState(false);
    const [newForumTitle, setNewForumTitle] = useState("");
    const [newForumDescription, setNewForumDescription] = useState("");
    const [reportedForums, setReportedForums] = useState([]);
    const [reportedComments, setReportedComments] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const { forumId } = useParams();
    const forumsLoaded = useRef(false);
    const commentsLoaded = useRef(false);
    const popupOpened = useRef(false); // NEW REF

    useEffect(() => {
        const loadReportedData = async () => {
            const user = await getCurrentUser();
            if (user) {
                const userDocRef = doc(db, "lista-de-usuarios", user.email);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setReportedForums(userData.reportedForums || []);
                    setReportedComments(userData.reportedComments || []);
                }
            }
        };
        loadReportedData();
    }, []);

    useEffect(() => {
        const fetchForums = async () => {
            setLoadingForums(true);
            setError(null);
            const user = await getCurrentUser();

            try {
                const forumsRef = collection(db, "Foros");
                const q = query(forumsRef, orderBy("ID"));
                const querySnapshot = await getDocs(q);
                const fetchedForums = [];
                for (const docSnap of querySnapshot.docs) {
                    const forumData = docSnap.data();

                    if (user && reportedForums.includes(docSnap.id)) {
                        continue;
                    }

                    let profileImageUrl = "url_por_defecto.jpg";

                    if (forumData.Email) {
                        const userDocRef = doc(db, "lista-de-usuarios", forumData.Email);
                        const userDocSnap = await getDoc(userDocRef);
                        if (userDocSnap.exists()) {
                            const userData = userDocSnap.data();
                            if (userData['Foto de Perfil']) {
                                profileImageUrl = userData['Foto de Perfil'];
                            }
                        }
                    }
                    fetchedForums.push({
                        ...forumData,
                        firestoreId: docSnap.id,
                        profileImage: profileImageUrl,
                    });
                }
                setForums(fetchedForums);
                forumsLoaded.current = true;
            } catch (err) {
                console.error("Error al cargar los foros:", err);
                setError("Error al cargar los foros: " + err.message);
            } finally {
                setLoadingForums(false);
            }
        };
        fetchForums();

    }, [reportedForums]);

    useEffect(() => {
        const fetchComments = async (forumId) => {
            setLoadingComments(true);
            setError(null);
            const user = await getCurrentUser();
            try {
                const commentsRef = collection(db, "Foros", forumId, "comments");
                const q = query(commentsRef, orderBy("ID"));
                const querySnapshot = await getDocs(q);
                const fetchedComments = [];
                for (const docSnap of querySnapshot.docs) {
                    const commentData = docSnap.data();

                    if (user && reportedComments.includes(docSnap.id)) {
                        continue;
                    }

                    let profileImageUrl = "url_por_defecto.jpg";

                    if (commentData.Email) {
                        const userDocRef = doc(db, "lista-de-usuarios", commentData.Email);
                        const userDocSnap = await getDoc(userDocRef);
                        if (userDocSnap.exists()) {
                            const userData = userDocSnap.data();
                            if (userData['Foto de Perfil']) {
                                profileImageUrl = userData['Foto de Perfil'];
                            }
                        }
                    }
                    fetchedComments.push({
                        ...commentData,
                        firestoreId: docSnap.id,
                        profileImage: profileImageUrl,
                    });
                }
                setComments(fetchedComments);
                commentsLoaded.current = true;
            } catch (err) {
                console.error("Error al cargar los comentarios:", err);
                setError("Error al cargar los comentarios: " + err.message);
            } finally {
                setLoadingComments(false);
            }
        };

        if (forumId) {
            fetchComments(forumId);
        } else {
            setComments([]);
        }

    }, [forumId, reportedComments]);

    useEffect(() => {
        if (forumsLoaded.current && location.state && location.state.forumData) {
            const { forumId: stateForumId, showComments, openCommentPopup } = location.state.forumData;
            if (stateForumId) {
                const foundForum = forums.find((f) => f.firestoreId === stateForumId);

                if (foundForum) {
                    if (showComments || openCommentPopup) {
                        navigate(`/foro/${stateForumId}`, { replace: true });
                    }
                } else {
                    console.warn("Forum not found in loaded forums:", stateForumId);
                }
            }
        }
    }, [forums, location.state, navigate, forumsLoaded.current]);

      useEffect(() => {
        //Check the showPopup flag AND if the popup hasn't been opened yet
        if (location.state && location.state.showPopup && !popupOpened.current && forumId ) {
            setShowCommentPopup(true);
            popupOpened.current = true; // Mark the popup as opened

            // Clear the flag: VERY IMPORTANT
            navigate(location.pathname, { state: {showPopup: false}, replace: true });
        }
    }, [location, navigate, forumId, popupOpened]);


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
        navigate(`/foro/${forumId}`);
    };

    const handleAddComment = (forumId) => {
        const user = getCurrentUser();
        if (!user) {
            setError("Debes iniciar sesión para comentar.");
            return;
        }
        // Navigate to the forum page and *then* show the popup
        navigate(`/foro/${forumId}`, { state: { showPopup: true } }); // Pass showPopup in state
    };


    const handleAddCommentToComment = (forumId, commentId, replyingToUser) => {
        const user = getCurrentUser();
        if (!user) {
            setError("Debes iniciar sesión para comentar.");
            return;
        }
        setReplyingTo(commentId);
        setReplyingToUserName(replyingToUser);
         navigate(`/foro/${forumId}`, { state: { showPopup: true } });
    };

    const handleCloseCommentPopup = () => {
        setShowCommentPopup(false);
        setReplyingTo(null);
        setNewComment("");
        setReplyingToUserName(null);
          //Remove state after closing
        if (location.state && location.state.showPopup) {
             navigate(location.pathname, { state: null, replace: true });
        }
        popupOpened.current = false; // Reset the popupOpened ref
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
        if (!forumId) {
            setError("Error interno: No se especificó el foro de destino.");
            return;
        }
        try {
            const forumRef = doc(db, "Foros", forumId);
            const forumSnap = await getDoc(forumRef);
            if (!forumSnap.exists()) {
                setError("El foro no existe.");
                return;
            }
            const commentsRef = collection(db, "Foros", forumId, "comments");
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
                newCommentId = `${forumId}.${commentsSnap.size + 1}`;
            }
            const newCommentData = {
                ID: newCommentId,
                description: newComment,
                Email: user.email,
                Date: new Date().toLocaleDateString('es-ES'),
                replyingTo: replyingToUserName || null,
                userName: user.userName,
                profileImage: user.profileImage,
            };
            await setDoc(doc(commentsRef, newCommentId), newCommentData);
             const newCom = { ...newCommentData, firestoreId: newCommentId }
            setComments(prevComments => [ ...prevComments, newCom]);
             //Remove state after publishing
            if (location.state && location.state.showPopup) {
                navigate(location.pathname, { state: null, replace: true });
            }
            setShowCommentPopup(false);
            setNewComment("");
            setReplyingTo(null);
            setReplyingToUserName(null);
            popupOpened.current = false; // Reset after publishing


        } catch (err) {
            console.error("Error al publicar el comentario:", err);
            setError("Error al publicar el comentario: " + err.message);
        }
    };

    const handleBackToForums = () => {
        setReplyingTo(null);
        setReplyingToUserName(null);
        navigate('/foro');
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
            const forumsSnap = await getDocs(forumsRef);
            let highestId = 0;
            forumsSnap.forEach(docSnap => {
                const id = parseInt(docSnap.data().ID);
                if (!isNaN(id) && id > highestId) {
                    highestId = id;
                }
            });
            const newForumId = String(highestId + 1);

            const newForumData = {
                ID: newForumId,
                Title: newForumTitle,
                description: newForumDescription,
                Email: user.email,
                Date: new Date().toLocaleDateString('es-ES'),
                userName: user.userName,
                profileImage: user.profileImage,
            };
            await setDoc(doc(db, "Foros", newForumId), newForumData);

            setForums([...forums, { ...newForumData, firestoreId: newForumId }]);

            setShowCreateForumPopup(false);
            setNewForumTitle("");
            setNewForumDescription("");
        } catch (err) {
            console.error("Error al publicar el foro:", err);
            setError("Error al publicar el foro: " + err.message);
        }
    };

    const handleReportForum = async (forumId) => {
       const user = await getCurrentUser();
        if (!user) {
            setError("Debes iniciar sesión para reportar un foro.");
             setTimeout(() => setError(null), 2000);
            return;
        }

        const forumToReport = forums.find(f => f.firestoreId === forumId);
        if (forumToReport && forumToReport.Email === user.email) {
            setError("No puedes reportar tu propio foro.");
            setTimeout(() => setError(null), 2000);
            return;
        }

        try {
            const userDocRef = doc(db, "lista-de-usuarios", user.email);
            await updateDoc(userDocRef, {
                reportedForums: [...reportedForums, forumId]
            });
            setReportedForums([...reportedForums, forumId]);
            navigate('/foro');
        } catch (error) {
            console.error("Error al reportar el foro:", error);
            setError("Error al reportar el foro: " + error.message);
            setTimeout(() => setError(null), 2000);
        }
    };

    const handleReportComment = async (commentId) => {
        const user = await getCurrentUser();
        if (!user) {
            setError("Debes iniciar sesión para reportar un comentario.");
            setTimeout(() => setError(null), 2000);
            return;
        }
        const commentToReport = comments.find(c => c.firestoreId === commentId);

        if (commentToReport && commentToReport.Email === user.email) {
            setError("No puedes reportar tu propio comentario.");
            setTimeout(() => setError(null), 2000);
            return;
        }

        try {
            const userDocRef = doc(db, "lista-de-usuarios", user.email);
            await updateDoc(userDocRef, {
                reportedComments: [...reportedComments, commentId]
            });
            setReportedComments([...reportedComments, commentId]);

        } catch (error) {
            console.error("Error al reportar el comentario:", error);
            setError("Error al reportar el comentario: " + error.message);
            setTimeout(() => setError(null), 2000);
        }
    };

    const selectedForum = forums.find(f => f.firestoreId === forumId);

    if (loadingForums) {
        return <div>Cargando foros...</div>;
    }
    if (loadingComments && forumId){
        return <div>Cargando comentarios...</div>
    }


   return (
    <div className="forum-page-forum">
        {error && <div>Error: {error}</div>}
        {!forumId && <h1 className="forum-title-forum">Foros</h1>}
        <div className="forum-wrapper-forum">
            {forumId ? (
                <div className="comments-view-forum">
                    <button className="back-button-forum" onClick={handleBackToForums}>
                        {"< Volver a Foros"}
                    </button>
                    {selectedForum ? (
                        <div className="original-post-forum">
                            <div className="profile-image-container-forum">
                                <img src={selectedForum.profileImage} alt="Profile" className="profile-image-forum" />
                            </div>
                            <div className="forum-content-forum">
                                <h2 className="forum-subtitle-forum">{selectedForum.Title}</h2>
                                <p className='forum-date-forum'>{selectedForum.Date}</p>
                                <p className="forum-text-forum forum-text-no-fade-forum">{selectedForum.description}</p>
                                <div className="forum-buttons-forum" style={{ marginLeft: "auto", marginRight: "auto", marginTop: "10px" }}>
                                    <span className="forum-button-forum" onClick={() => handleAddComment(selectedForum.firestoreId)}>
                                        Comentar
                                    </span>
                                     <span className="forum-button-forum" onClick={() => handleReportForum(selectedForum.firestoreId)}>
                                        Reportar Foro
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>No se ha seleccionado ningún foro, o el foro no existe.</div>
                    )}
                    <div className="comments-container-forum">
                        {comments.map(comment => (
                                <div className="comment-item-forum" key={comment.firestoreId}>
                                    <div className="profile-image-container-forum">
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
                                            <span className="forum-button-forum" onClick={() => handleAddCommentToComment(forumId, comment.firestoreId, comment.userName)}>Comentar</span>
                                            <span className="forum-button-forum" onClick={() => handleReportComment(comment.firestoreId)}>
                                                 Reportar
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
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