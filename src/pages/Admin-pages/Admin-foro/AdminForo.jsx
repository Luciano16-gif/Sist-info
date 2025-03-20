// AdminForo.jsx (Responsive Version)
import React, { useState, useEffect } from 'react';
import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection";
import { adminBaseStyles } from '../../../components/Admin-components/adminBaseStyles';
import useForumMetrics from "../../../components/hooks/forum-hooks/useForumMetrics";
import LoadingState from "../../../components/common/LoadingState/LoadingState";
import { db } from '../../../firebase-config';
import { collection, getDocs, query, orderBy, doc, getDoc, deleteDoc } from "firebase/firestore";
import LazyImage from "../../../components/common/LazyImage/LazyImage"; // Import the LazyImage component
import './AdminForo.css'; // Import the CSS file

// Default fallback will be handled by LazyImage component

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay-gallery">
            <div className="modal-content-container-gallery delete-modal">
                <p>{message || "¿Estás seguro de que quieres borrar este elemento?"}</p>
                <div className="modal-buttons">
                    <button className="confirm-button" onClick={onConfirm}>Confirmar</button>
                    <button className="cancel-button" onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

const AdminForo = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const {
        totalForos, totalComments, reportedForums,
        reportedComments, participatingUsers, loading: metricsLoading,
        error: metricsError,
    } = useForumMetrics(refreshTrigger);

    const [forumData, setForumData] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [dataError, setDataError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    
    // New states for tracking deleting items for animation
    const [deletingForumId, setDeletingForumId] = useState(null);
    const [deletingComment, setDeletingComment] = useState(null);
    
    // Local metrics state for immediate updates
    const [localMetrics, setLocalMetrics] = useState({
        totalForos: 0,
        totalComments: 0,
        reportedForums: 0,
        reportedComments: 0,
        participatingUsers: 0
    });

    // Update local metrics when the fetched metrics change
    useEffect(() => {
        if (!metricsLoading && !metricsError) {
            setLocalMetrics({
                totalForos,
                totalComments,
                reportedForums,
                reportedComments,
                participatingUsers
            });
        }
    }, [totalForos, totalComments, reportedForums, reportedComments, participatingUsers, metricsLoading, metricsError]);

    useEffect(() => {
        const fetchForumData = async () => {
            try {
                const forosSnapshot = await getDocs(query(collection(db, "Foros"), orderBy("Date", "desc")));
                const forums = [];

                for (const foroDoc of forosSnapshot.docs) {
                    const foro = foroDoc.data();
                    foro.id = foroDoc.id;

                    const forumUserName = foro.userName || 'Usuario Desconocido';
                    let formattedForumDate = "Fecha no disponible";
                    if (foro.Date) {
                        const [day, month, year] = foro.Date.split("/");
                        if (day && month && year) {
                            const parsedDate = new Date(year, month - 1, day);
                            if (!isNaN(parsedDate)) {
                                formattedForumDate = parsedDate.toLocaleDateString('es-ES');
                            }
                        }
                    }

                    const commentsQuery = query(collection(db, "Foros", foroDoc.id, "comments"), orderBy("Date", "asc"));
                    const commentsSnapshot = await getDocs(commentsQuery);
                    const comments = [];

                    for (const commentDoc of commentsSnapshot.docs) {
                        const comment = commentDoc.data();
                        comment.id = commentDoc.id;

                        const commentUserName = comment.userName || 'Usuario Desconocido';
                        let formattedCommentDate = "Fecha no disponible";
                        if (comment.Date) {
                            const [day, month, year] = comment.Date.split("/");
                            if (day && month && year) {
                                const parsedDate = new Date(year, month - 1, day);
                                if (!isNaN(parsedDate)) {
                                    formattedCommentDate = parsedDate.toLocaleDateString('es-ES');
                                }
                            }
                        }

                        comments.push({
                            ...comment,
                            userName: commentUserName,
                            profileImage: comment.profileImage,
                            commentDate: formattedCommentDate,
                        });
                    }

                    forums.push({
                        ...foro,
                        userName: forumUserName,
                        profileImage: foro.profileImage,
                        forumDate: formattedForumDate,
                        comments: comments,
                    });
                }

                setForumData(forums);
                setDataLoading(false);
            } catch (error) {
                console.error("Error fetching forum data:", error);
                setDataError("Error al cargar los foros y comentarios");
                setDataLoading(false);
            }
        };

        fetchForumData();
    }, [refreshTrigger]);

    // Initiate deletion process for a forum
    const handleDeleteForum = (forumId) => {
        setItemToDelete({ type: 'forum', forumId });
        setIsDeleteModalOpen(true);
    };

    // Initiate deletion process for a comment
    const handleDeleteComment = (forumId, commentId) => {
        setItemToDelete({ type: 'comment', forumId, commentId });
        setIsDeleteModalOpen(true);
    };

    // Confirm deletion
    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        setDeleteError(null);
        try {
            if (itemToDelete.type === 'forum') {
                // Set deleting state for animation
                setDeletingForumId(itemToDelete.forumId);
                
                // Find forum to get comment count for metrics update
                const forumToDelete = forumData.find(forum => forum.id === itemToDelete.forumId);
                const commentCount = forumToDelete?.comments?.length || 0;
                
                // Update local metrics immediately
                setLocalMetrics(prev => ({
                    ...prev,
                    totalForos: Math.max(0, prev.totalForos - 1),
                    totalComments: Math.max(0, prev.totalComments - commentCount)
                }));
                
                // Wait for animation before actual deletion
                setTimeout(async () => {
                    // Delete the forum document
                    const forumRef = doc(db, 'Foros', itemToDelete.forumId);
                    await deleteDoc(forumRef);
                    
                    // Update state to remove the deleted forum
                    setForumData(prevData => prevData.filter(forum => forum.id !== itemToDelete.forumId));
                    
                    // Trigger metrics refresh
                    setRefreshTrigger(prev => prev + 1);
                    
                    // Reset animation state
                    setDeletingForumId(null);
                }, 500); // Match CSS transition time
                
            } else if (itemToDelete.type === 'comment') {
                // Set deleting state for animation
                setDeletingComment({
                    forumId: itemToDelete.forumId,
                    commentId: itemToDelete.commentId
                });
                
                // Update local metrics immediately
                setLocalMetrics(prev => ({
                    ...prev,
                    totalComments: Math.max(0, prev.totalComments - 1)
                }));
                
                // Wait for animation before actual deletion
                setTimeout(async () => {
                    // Delete the comment document
                    const commentRef = doc(db, 'Foros', itemToDelete.forumId, 'comments', itemToDelete.commentId);
                    await deleteDoc(commentRef);
                    
                    // Update state to remove the deleted comment
                    setForumData(prevData => prevData.map(forum => {
                        if (forum.id === itemToDelete.forumId) {
                            return {
                                ...forum,
                                comments: forum.comments.filter(comment => comment.id !== itemToDelete.commentId)
                            };
                        }
                        return forum;
                    }));
                    
                    // Trigger metrics refresh
                    setRefreshTrigger(prev => prev + 1);
                    
                    // Reset animation state
                    setDeletingComment(null);
                }, 500); // Match CSS transition time
            }
        } catch (err) {
            console.error("Error deleting item:", err);
            setDeleteError("Error al eliminar el elemento.");
            // Reset animation states in case of error
            setDeletingForumId(null);
            setDeletingComment(null);
        } finally {
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };

    // Cancel deletion
    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };

    if (metricsLoading || dataLoading) {
        return <LoadingState text="Cargando métricas y datos del foro..." />;
    }

    if (metricsError || dataError) {
        return (
            <div className={`w-full px-4 sm:px-6 md:px-8 lg:px-16 my-4 sm:my-6 md:my-8 flex flex-col justify-start items-start ${adminBaseStyles}`}>
                <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">Foro</h1>
                <p className="text-red-500 mt-4">Error: {metricsError || dataError}</p>
            </div>
        );
    }

    if (deleteError) {
        return (
            <div className={`w-full px-4 sm:px-6 md:px-8 lg:px-16 my-4 sm:my-6 md:my-8 flex flex-col justify-start items-start ${adminBaseStyles}`}>
                <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">Foro</h1>
                <p className="text-red-500 mt-4">Error: {deleteError}</p>
                <button onClick={() => setDeleteError(null)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    OK
                </button>
            </div>
        );
    }

    return (
        <div className={`w-full px-4 sm:px-6 md:px-8 lg:px-16 my-4 sm:my-6 md:my-8 flex flex-col justify-start items-start ${adminBaseStyles}`}>
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">Foro</h1>
            <h1 className="text-white text-base sm:text-lg">Espacio dinámico y compartido...</h1>
            <hr className="border-1 border-white-600 w-full sm:w-48 md:w-96 mb-6" />
            
            <h1 className="text-white text-2xl sm:text-3xl font-bold mt-4">Informacion Relevante</h1>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full my-4">
                <RelevantInfoS number={localMetrics.totalForos} description="Foros Disponibles Actualmente" />
                <RelevantInfoS number={localMetrics.totalComments} description="Comentarios totales" />
                <RelevantInfoS number={localMetrics.reportedForums} description="Foros reportados" />
                <RelevantInfoS number={localMetrics.reportedComments} description="Comentarios Reportados" />
                <RelevantInfoS number={localMetrics.participatingUsers} description="Usuarios participantes" />
            </div>
            
            <hr className="border-1 border-white-600 w-full sm:w-48 md:w-96 mt-6 mb-6" />

            <div className="w-full">
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-4 sm:mt-8">Foros y Comentarios</h2>
                {forumData.map((foro) => (
                    <div 
                        key={`${foro.id}-${refreshTrigger}`} 
                        className={`forum-item my-4 p-2 sm:p-4 border border-gray-200 rounded-md ${deletingForumId === foro.id ? 'deleting' : ''}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="forum-title text-lg sm:text-xl font-semibold text-white">{foro.Title}</h3>
                            <button 
                                className="delete-forum-button" 
                                onClick={() => handleDeleteForum(foro.id)}
                            >
                                Borrar Foro
                            </button>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
                                <LazyImage
                                    src={foro.profileImage}
                                    alt={`Profile of ${foro.userName}`}
                                    placeholderColor="#3a4a3a"
                                />
                            </div>
                            <p className='forum-info text-white text-sm sm:text-base'>
                                Creado por: {foro.userName}, {foro.forumDate}
                            </p>
                        </div>

                        <div className="mt-4">
                            {foro.comments.map((comment) => (
                                <div 
                                    key={`${comment.id}-${refreshTrigger}`} 
                                    className={`comment-item p-2 my-2 border border-gray-300 rounded-md relative ${
                                        deletingComment && 
                                        deletingComment.forumId === foro.id && 
                                        deletingComment.commentId === comment.id ? 'deleting' : ''
                                    }`}
                                >
                                    <p className='comment-description text-white'>{comment.description}</p>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden">
                                            <LazyImage
                                                src={comment.profileImage}
                                                alt={`Profile of ${comment.userName}`}
                                                placeholderColor="#3a4a3a"
                                            />
                                        </div>
                                        <p className='comment-info text-white text-xs sm:text-sm'>
                                            Comentado por: {comment.userName}, {comment.commentDate}
                                        </p>
                                    </div>
                                    <button 
                                        className="delete-comment-button" 
                                        onClick={() => handleDeleteComment(foro.id, comment.id)}
                                    >
                                        Borrar Comentario
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Render the confirmation modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                message={itemToDelete?.type === 'forum' 
                    ? "¿Estás seguro de que quieres borrar este foro y todos sus comentarios?" 
                    : "¿Estás seguro de que quieres borrar este comentario?"
                }
            />
        </div>
    );
};

export default AdminForo;