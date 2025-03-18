// AdminResenas.jsx
import React from 'react';
import RelevantInfoS from "../../../components/Admin-components/admin-buttons/InfoSection";
import Reviews from '../../../components/Admin-components/admin-resenas/ReviewAdmin';
import { adminBaseStyles } from '../../../components/Admin-components/adminBaseStyles';
import useReviewMetrics from '../../../components/hooks/reviews-hooks/useReviewMetrics'; // Import the custom hook
import LoadingState from '../../../components/common/LoadingState/LoadingState'; // Import LoadingState


const AdminResenas = () => {
    const { totalReviews, reviews5e, reviews4e, reviews3e, reviews2e, reviews1e, loading, error } = useReviewMetrics();

    if (loading) {
        return <LoadingState text="Cargando estadísticas..." />;
    }

    if (error) {
        return (
            <div className={`inset-0 mx-32 my-8 flex flex-col justify-start items-start px-8 md:px-16 ${adminBaseStyles}`}>
                <p className="text-red-500">Error: {error}</p>
                <button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Reintentar
                </button>
            </div>
        );
    }
    return (
        <div className={`inset-0 mx-32 my-8 flex flex-col justify-start items-start px-8 md:px-16 ${adminBaseStyles}`}>
            <h1 className=" text-white text-4xl md:text-5xl font-bold">
                Reseñas
            </h1>
            <h1 className=" text-white text-lg md:text-lg">
                Nuestros usuarios nos dejan su puntuación y su opinión con respecto a su experiencia
                junto a nosotros.
            </h1>
            <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
            <h1 className=" text-white text-3xl md:text-3xl font-bold">
                Informacion Relevante
            </h1>
            <div className="flex justify-start space-x-10">
                <RelevantInfoS number={totalReviews} description="Resenas Recibidas" />
                <RelevantInfoS number={reviews5e} description="Resenas con 5 estrellas" />
                <RelevantInfoS number={reviews4e} description="Resenas con 4 estrellas" />
                <RelevantInfoS number={reviews3e} description="Resenas con 3 estrellas" />
                <RelevantInfoS number={reviews2e} description="Resenas con 2 estrellas" />
                <RelevantInfoS number={reviews1e} description="Resenas con 1 estrella" />
            </div>
            <hr className="border-1 border-white-600 sm:w-10 md:w-96" />
            <Reviews />
        </div>
    );
};

export default AdminResenas;