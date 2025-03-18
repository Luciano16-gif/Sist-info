// AdminForo.jsx (Responsive Version)
import React, { useState, useEffect } from 'react';
import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection";
import { adminBaseStyles } from '../../../components/Admin-components/adminBaseStyles';
import useForumMetrics from "../../../components/hooks/forum-hooks/useForumMetrics";
import LoadingState from "../../../components/common/LoadingState/LoadingState";
import { db } from '../../../firebase-config';
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import LazyImage from "../../../components/common/LazyImage/LazyImage"; // Import the LazyImage component
import './AdminForo.css'; // Import the CSS file

// Default fallback will be handled by LazyImage component

const AdminForo = () => {
    const {
        totalForos, totalComments, reportedForums,
        reportedComments, participatingUsers, loading: metricsLoading,
        error: metricsError,
    } = useForumMetrics();

    const [forumData, setForumData] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [dataError, setDataError] = useState(null);

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
    }, []);

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

    return (
        <div className={`w-full px-4 sm:px-6 md:px-8 lg:px-16 my-4 sm:my-6 md:my-8 flex flex-col justify-start items-start ${adminBaseStyles}`}>
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">Foro</h1>
            <h1 className="text-white text-base sm:text-lg">Espacio dinámico y compartido...</h1>
            <hr className="border-1 border-white-600 w-full sm:w-48 md:w-96 mb-6" />
            
            <h1 className="text-white text-2xl sm:text-3xl font-bold mt-4">Informacion Relevante</h1>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full my-4">
                <RelevantInfoS number={totalForos} description="Foros Disponibles Actualmente" />
                <RelevantInfoS number={totalComments} description="Comentarios totales" />
                <RelevantInfoS number={reportedForums} description="Foros reportados" />
                <RelevantInfoS number={reportedComments} description="Comentarios Reportados" />
                <RelevantInfoS number={participatingUsers} description="Usuarios participantes" />
            </div>
            
            <hr className="border-1 border-white-600 w-full sm:w-48 md:w-96 mt-6 mb-6" />

            <div className="w-full">
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-4 sm:mt-8">Foros y Comentarios</h2>
                {forumData.map((foro) => (
                    <div key={foro.id} className="forum-item my-4 p-2 sm:p-4 border border-gray-200 rounded-md">
                        <h3 className="forum-title text-lg sm:text-xl font-semibold text-white">{foro.Title}</h3>
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
                                <div key={comment.id} className="comment-item p-2 my-2 border border-gray-300 rounded-md">
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
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminForo;