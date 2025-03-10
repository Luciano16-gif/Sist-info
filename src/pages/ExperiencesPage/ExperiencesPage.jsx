// ExperiencesPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import './ExperiencesPage.css';
import { db, storage } from '../../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

function ExperiencesPage() {
    const [experiences, setExperiences] = useState([]);
    const experienceRefs = useRef([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchExperiences = async () => {
            const experiencesCollection = collection(db, "Experiencias");
            const experiencesSnapshot = await getDocs(experiencesCollection);
            const experiencesList = [];

            for (const doc of experiencesSnapshot.docs) {
                const data = doc.data();
                console.log("Raw data from Firestore:", data); // Add this line for debugging

                let imageUrl = '';
                try {
                    const imageRef = ref(storage, data.imageUrl);
                    imageUrl = await getDownloadURL(imageRef);
                } catch (error) {
                    console.error("Error al obtener la URL de la imagen:", error);
                    imageUrl = '../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png';
                }

                const experience = {
                    id: doc.id,
                    name: data.nombre,
                    description: data.descripcion,
                    difficulty: data.dificultad,
                    price: data.precio,
                    distance: data.longitudRecorrido + " km",
                    duracion: data.duracionRecorrido,
                    time: data.horarioInicio + " - " + data.horarioFin,
                    days: data.fechas.join(', '),
                    maxPeople: data.maximoUsuarios,
                    minPeople: data.minimoUsuarios,
                    availableSlots: data.cuposDisponibles,
                    imageUrl: imageUrl,
                    rating: data.puntuacion,
                    registeredUsers: data.usuariosInscritos,
                    incluidos: data.incluidosExperiencia,
                    puntoDeSalida: data.puntoSalida,
                };

                experiencesList.push(experience);
            }

            setExperiences(experiencesList);
            experienceRefs.current = experiencesList.map((_, i) => experienceRefs.current[i] || React.createRef());
            setLoading(false); // Set loading to false after data is fetched
        };

        fetchExperiences();
    }, []);

    const scrollToExperience = (index) => {
        if (experienceRefs.current[index] && experienceRefs.current[index].current) {
            experienceRefs.current[index].current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    const renderRatingStars = (rating) => {
        const fullStars = Math.floor(rating);
        const stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={`full-${i}`} className='dot-experiences'></span>);
        }
        for (let i = fullStars; i < 5; i++) {
            stars.push(<span key={`gray-${i}`} className='dot-gray-experiences'></span>);
        }
        return stars;
    };

    const renderDifficultyDots = (difficulty) => {
        const difficultyLevel = parseInt(difficulty, 10);
        const dots = [];

        if (isNaN(difficultyLevel)) {
          return <span>Invalid difficulty</span>;
        }

        for (let i = 0; i < difficultyLevel; i++) {
            dots.push(<span key={`diff-full-${i}`} className='dot-experiences'></span>);
        }
        for (let i = difficultyLevel; i < 5; i++) {
            dots.push(<span key={`diff-gray-${i}`} className='dot-gray-experiences'></span>);
        }
        return dots;
    };

    const handleViewMore = (experience) => {
        if (loading) { // Check if data is still loading
            console.log("Data is still loading. Cannot view details yet.");
            return;
        }
        console.log("Experience ID being passed:", experience.id); // Add this line
        navigate('/booking', { state: { experience } });
    };

    if (loading) {
        return <div>Loading experiences...</div>; // Show a loading message
    }

    return (
        <div className="container-experiences" style={{ marginTop: "60px" }}>
            <h1 className="title-experiences" style={{ marginTop: "40px" }}>¡Todas nuestras experiencias disponibles para ti!</h1>

            {experiences.map((experience, index) => (
                <div className="experience-card-experiences" key={experience.id} ref={experienceRefs.current[index]}>
                    {/* ... rest of your ExperienceCard content ... */}
                    <div className="image-container-experiences">
                        <img src={experience.imageUrl} alt={experience.name} className="image-experiences" />
                        <div className="price-overlay-experiences">{experience.price} $</div>
                    </div>
                    <div className="experience-info-experiences">
                        <div className="rating-box-experiences">
                            <span>Puntuación: </span>
                            {renderRatingStars(experience.rating)}
                        </div>
                        <div className="rating-box-experiences">
                            <span>Dificultad: </span>
                            {renderDifficultyDots(experience.difficulty)}
                        </div>
                        <h2 className="subtitle-experiences">{experience.name}</h2>
                        <p className="description-experiences">{experience.description}</p>

                        <div className="data-container-experiences">
                            <p className="data-text-experiences">
                                <img src="../../src/assets/images/ExperiencesPage/camino.png" alt="Camino" className="camino-icon-experiences" />
                                {experience.distance}
                            </p>
                            <p className="data-text-experiences">
                                <img src="../../src/assets/images/ExperiencesPage/calendario.png" alt="Calendario" className="calendar-icon-experiences" />
                                <i className="far fa-clock"></i> {experience.time}
                            </p>
                            <p className="data-text-experiences">
                                <img src="../../src/assets/images/ExperiencesPage/participantes.png" alt="Participantes" className="participantes-icon-experiences" />
                                {experience.registeredUsers} / {experience.maxPeople} Cupos
                            </p>
                        </div>
                        <button className="button-experiences" onClick={() => handleViewMore(experience)}>Ver más</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ExperiencesPage;