// ForumPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import './ForumPage.css';

function ForumPage() {
    const forumContainerRef = useRef(null);
    const textRefs = useRef([]);
    const [showComments, setShowComments] = useState(null);
    const [forums] = useState([
        {
            id: 1,
            profileImage: '../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png',
            title: "Guía #19: \"Consejos de Seguridad\"",
            date: "Hace 2 semanas",
            content: "Excursión en la montaña: experiencia increíble, seguridad fundamental. Puntos clave:\n1. Planificación\n2. Equipo\n3. Clima\n4. Hidratación\n5. Ambiente\n6. Límites\n7. Comunicación",
            userName: "Guía Excursionista",
            comments: [
               { id: 101, user: "Usuario #789", text: "¡Excelentes consejos! Siempre llevo un silbato y una manta térmica por si acaso.", date: "Hace 1 semana", replyingTo: "Guía Excursionista" },
                { id: 102, user: "Usuario #123", text: "La planificación es clave. Nunca salgo sin revisar el pronóstico del tiempo varias veces.", date: "Hace 5 días" , replyingTo: "Guía Excursionista"},
                { id: 103, user: "Usuario #456", text: "Yo agregaría llevar un pequeño botiquín de primeros auxilios, incluso para caminatas cortas.", date: "Hace 2 días", replyingTo: "Usuario #789" },
                { id: 104, user: "Usuario #999", text: "Muy cierto lo del botiquín.", date: "Hace 1 día", replyingTo: "Usuario #456" },
            ]
        },
        {
            id: 2,
            profileImage: '../../src/assets/images/landing-page/profile_managemente/profile_picture_2.png',
            title: "Usuario #424: \"Mi Experiencia\"",
            date: "Hace 3 semanas",
            content: "Excursión: comparto lugares. ¡Aquí algunos!\nPico Naiguatá\nLaguna de Los Patos\nCascada\nMirador\nSendero",
            userName: "Usuario #424",
            comments: []
        },
        {
            id: 3,
            profileImage: '../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png',
            title: "Guía #20: \"Equipo Esencial\"",
            date: "Hace 1 semana",
            content: "Equipo adecuado: crucial para seguridad y comodidad. Elementos:\n1. Mochila\n2. Botas\n3. Ropa\n4. Chaqueta\n5. Botiquín\n6. Mapa/GPS\n7. Linterna",
            userName: "Guía Excursionista",
            comments: []
        },
        {
            id: 4,
            profileImage: '../../src/assets/images/landing-page/profile_managemente/profile_picture_2.png',
            title: "Usuario #555: \"Recomendaciones\"",
            date: "Hace 4 días",
            content: "Recomendaciones adicionales:\n- Informa\n- Verifica clima\n- Agua\n- Protector solar\n- No rastro",
            userName: "Usuario #555",
            comments: []
        }
    ]);

    const addTextRef = (el) => {
        if (el && !textRefs.current.includes(el)) {
            textRefs.current.push(el);
        }
    };

    const checkForOverflow = () => {
      textRefs.current.forEach(ref => {
        if (ref.scrollHeight > ref.clientHeight) {
          ref.classList.add('fade');
        } else {
          ref.classList.remove('fade');
        }
      });
    };

    useEffect(() => {
        if (!showComments) {
            checkForOverflow();

            const handleResize = () => checkForOverflow();
            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }
    }, [forums, showComments]);


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

    const [replyingTo, setReplyingTo] = useState(null);
    const [showCommentPopup, setShowCommentPopup] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [targetForumId, setTargetForumId] = useState(null); // New state

    const handleViewComments = (forumId) => {
        setShowComments(forumId);
        setTargetForumId(null); // Reset target forum ID when manually viewing comments

    };

    const handleAddComment = (forumId, userName) => {
        setReplyingTo(userName);
        setTargetForumId(forumId);  // Store the forum ID
        setShowComments(forumId);   // Show comments *first*
        setShowCommentPopup(true);
    };


    const handleAddCommentToComment = (forumId, commentId, replyingToUser) => {
        setReplyingTo(replyingToUser);
        setTargetForumId(forumId); // Also set from within comment section
        setShowCommentPopup(true);
    };

    const handleCloseCommentPopup = () => {
        setShowCommentPopup(false);
        setReplyingTo(null);
        setNewComment("");
    };

    const handleCommentInputChange = (event) => {
      setNewComment(event.target.value);
    };

     const handlePublishComment = () => {
        // Implementar lógica para publicar.
        console.log("Publicando comentario:", newComment, "respondiendo a:", replyingTo, "en foro:", targetForumId);
        handleCloseCommentPopup(); // Close popup after publishing.
    };

    const handleBackToForums = () => {
        setShowComments(null);
        setReplyingTo(null);
        setTargetForumId(null); // Reset target forum ID on back
    };

    const selectedForum = forums.find(f => f.id === showComments);

    return (
        <div className="forum-page-forum">
            <h1 className="forum-title-forum">Foros</h1>
            <div className="forum-wrapper-forum">
                {showComments ? (
                    // Comments View
                    <div className="comments-view-forum">
                        <button className="back-button-forum" onClick={handleBackToForums}>
                            {"< Volver a Foros"}
                        </button>
                        <div className="original-post-forum">
                            <div className="profile-image-container-forum">
                                <img src={selectedForum.profileImage} alt="Profile" className="profile-image-forum" />
                            </div>
                            <div className="forum-content-forum">
                                <h2 className="forum-subtitle-forum">{selectedForum.title}</h2>
                                <p className='forum-date-forum'>{selectedForum.date}</p>
                                <p className="forum-text-forum forum-text-no-fade-forum">{selectedForum.content}</p>
                                 <div className="forum-buttons-forum" style={{marginLeft: "auto", marginRight: "auto", marginTop: "10px"}}>
                                    <span className="forum-button-forum" onClick={() => handleAddComment(selectedForum.id, selectedForum.userName)}>
                                        Comentar
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="comments-container-forum">
                           {selectedForum.comments.map(comment => (
                                <div className="comment-item-forum" key={comment.id}>
                                    <div className="comment-content-forum">
                                         <p className="comment-user-forum">
                                            {comment.user}
                                            {comment.replyingTo && <span className="replying-to-text"> Respondiendo a {comment.replyingTo}</span>}
                                        </p>
                                        <p className="comment-date-forum">{comment.date}</p>
                                        <p className="comment-text-forum">{comment.text}</p>
                                        <div className="comment-button-container-forum">
                                            <span className="forum-button-forum"  onClick={() => handleAddCommentToComment(selectedForum.id, comment.id, comment.user)}>Comentar</span>
                                         </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                         {/* Comment Popup */}
                        {showCommentPopup && (
                            <div className="comment-popup-overlay">
                                <div className="comment-popup">
                                     <span className="close-button" onClick={handleCloseCommentPopup}>×</span>
                                    <p className="replying-to-popup">
                                        {replyingTo ? `Respondiendo a ${replyingTo}` : 'Escribe un comentario'}
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
                    // Forum List View
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
                                <div className="forum-item-forum" key={forum.id}>
                                    <div className="profile-image-container-forum">
                                        <img src={forum.profileImage} alt="Profile" className="profile-image-forum" />
                                    </div>
                                    <div className="forum-content-forum">
                                        <h2 className="forum-subtitle-forum">{forum.title}</h2>
                                        <p className='forum-date-forum'>{forum.date}</p>
                                        <p className="forum-text-forum" ref={addTextRef}>{forum.content}</p>
                                        <div className="forum-buttons-forum">
                                            <span className="forum-button-forum" onClick={() => handleViewComments(forum.id)}>
                                                Ver Comentarios
                                            </span>
                                           {/* Pass forum.userName here */}
                                            <span className="forum-button-forum" onClick={() => handleAddComment(forum.id, forum.userName)}>
                                                Comentar
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="create-topic-button-forum">Crear un Tema</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ForumPage;