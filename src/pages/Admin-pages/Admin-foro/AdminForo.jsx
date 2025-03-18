// AdminForo.jsx (with more debugging and focused CSS)
import React, { useState, useEffect } from 'react';
import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection";
import NewForo from "../../../components/Admin-components/admin-foro/StartNewForum";
import { adminBaseStyles } from '../../../components/Admin-components/adminBaseStyles';
import useForumMetrics from "../../../components/hooks/forum-hooks/useForumMetrics";
import LoadingState from "../../../components/common/LoadingState/LoadingState";
import { db } from '../../../firebase-config';
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import './AdminForo.css'; // Import the CSS file

const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/150'; // USE A REAL DEFAULT

const AdminForo = () => {
    // ... (rest of the component code, up to the return statement) ...
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
                            profileImage: comment.profileImage || DEFAULT_IMAGE_URL,
                            commentDate: formattedCommentDate,
                        });
                    }

                    forums.push({
                        ...foro,
                        userName: forumUserName,
                        profileImage: foro.profileImage || DEFAULT_IMAGE_URL,
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
            <div className={`inset-0 mx-32 my-8 flex flex-col justify-start items-start px-8 md:px-16 ${adminBaseStyles}`}>
                <h1 className=" text-white text-4xl md:text-5xl font-bold">Foro</h1>
                <p className="text-red-500 mt-4">Error: {metricsError || dataError}</p>
            </div>
        );
    }

    return (
        <div className={`inset-0 mx-32 my-8 flex flex-col justify-start items-start px-8 md:px-16 ${adminBaseStyles}`}>
            <h1 className=" text-white text-4xl md:text-5xl font-bold">Foro</h1>
            <h1 className=" text-white text-lg md:text-lg">Espacio dinámico y compartido...</h1>
            <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
            <h1 className=" text-white text-3xl md:text-3xl font-bold">Informacion Relevante</h1>
            <div className="flex justify-start space-x-10">
                <RelevantInfoS number={totalForos} description="Foros Disponibles Actualmente" />
                <RelevantInfoS number={totalComments} description="Comentarios totales" />
                <RelevantInfoS number={reportedForums} description="Foros reportados" />
                <RelevantInfoS number={reportedComments} description="Comentarios Reportados" />
                <RelevantInfoS number={participatingUsers} description="Usuarios participantes" />
            </div>
            <hr className="border-1 border-white-600 sm:w-10 md:w-96" />

            <div>
                <h2 className="text-2xl font-bold text-white mt-8">Foros y Comentarios (DEBUG)</h2>
                {forumData.map((foro) => (
                    <div key={foro.id} className="forum-item my-4 p-4 border border-gray-200 rounded-md">
                        <h3 className="forum-title text-xl font-semibold text-white">{foro.Title}</h3>
                        <p className='forum-info text-white'>Creado por: {foro.userName}, {foro.forumDate}</p>
                        <img
                            src={foro.profileImage}
                            alt={`Profile of ${foro.userName}`}
                            className="w-10 h-10 rounded-full"
                            onError={(e) => {
                                console.error("Error loading image:", e.target.src);
                                e.target.src = DEFAULT_IMAGE_URL;
                            }}
                        />

                        <div className="mt-2">
                            {foro.comments.map((comment) => (
                                <div key={comment.id} className="comment-item p-2 my-2 border border-gray-300 rounded-md">
                                    <p className='comment-description text-white'>{comment.description}</p>
                                    <p className='comment-info text-white'>Comentado por: {comment.userName}, {comment.commentDate}</p>
                                    <img
                                        src={comment.profileImage}
                                        alt={`Profile of ${comment.userName}`}
                                        className="w-8 h-8 rounded-full"
                                        onError={(e) => {
                                            console.error("Error loading image:", e.target.src);
                                            e.target.src = DEFAULT_IMAGE_URL;
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
            <NewForo />
        </div>
    );
};

export default AdminForo;