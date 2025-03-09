// ExperiencesPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import './ExperiencesPage.css';
import { db, storage } from '../../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

function ExperiencesPage() {
    const [experiences, setExperiences] = useState([]);
    const experienceRefs = useRef([]);

    useEffect(() => {
        const fetchExperiences = async () => {
            const experiencesCollection = collection(db, "Experiencias");
            const experiencesSnapshot = await getDocs(experiencesCollection);
            const experiencesList = [];

            for (const doc of experiencesSnapshot.docs) {
                const data = doc.data();
                let imageUrl = '';
                try {
                    const imageRef = ref(storage, data.imageUrl);
                    imageUrl = await getDownloadURL(imageRef);
                } catch (error) {
                    console.error("Error al obtener la URL de la imagen:", error);
                    imageUrl = '../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png';
                }

                experiencesList.push({
                    id: doc.id,
                    name: data.nombre,
                    description: data.descripcion,
                    difficulty: data.dificultad, //  <-- USE THE difficulty FIELD
                    price: data.precio,
                    distance: data.longitudRecorrido + " km",
                    duracion: data.duracionRecorrido,
                    time: data.horarioInicio + " - " + data.horarioFin,
                    days: data.fechas.join(', '),
                    maxPeople: data.maximoUsuarios,
                    minPeople: data.minimoUsuarios,
                    availableSlots: data.cuposDisponibles, // Keep this if you still use it
                    imageUrl: imageUrl,
                    rating: data.puntuacion,
                    dificultad: data.dificultad, // Redundant, but kept for clarity in initial fetch
                    registeredUsers: data.usuariosInscritos, //  <--  FETCH THE REGISTERED USERS
                });
            }

            setExperiences(experiencesList);
            experienceRefs.current = experiencesList.map((_, i) => experienceRefs.current[i] || React.createRef());
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

    //  NEW FUNCTION TO RENDER DIFFICULTY
    const renderDifficultyDots = (difficulty) => {
        const difficultyLevel = parseInt(difficulty, 10); // Ensure it's a number
        const dots = [];

        if (isNaN(difficultyLevel)) {
          return <span>Invalid difficulty</span>; // Or some other error handling
        }

        for (let i = 0; i < difficultyLevel; i++) {
            dots.push(<span key={`diff-full-${i}`} className='dot-experiences'></span>);
        }
        for (let i = difficultyLevel; i < 5; i++) {
            dots.push(<span key={`diff-gray-${i}`} className='dot-gray-experiences'></span>);
        }
        return dots;
    };



    return (
        <div className="container-experiences" style={{ marginTop: "60px" }}>
            <h1 className="title-experiences" style={{ marginTop: "40px" }}>¡Todas nuestras experiencias disponibles para ti!</h1>

            {experiences.map((experience, index) => (
                <div className="experience-card-experiences" key={experience.id} ref={experienceRefs.current[index]}>
                    <div className="image-container-experiences">
                        <img src={experience.imageUrl} alt={experience.name} className="image-experiences" />
                        <div className="price-overlay-experiences">{experience.price} $</div>
                    </div>
                    <div className="experience-info-experiences">
                        <div className="rating-box-experiences">
                            <span>Puntuación: </span>
                            {renderRatingStars(experience.rating)}
                        </div>
                        {/*  NEW DIFFICULTY SECTION */}
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
                                {/* DISPLAY REGISTERED USERS / MAX PEOPLE */}
                                {experience.registeredUsers} / {experience.maxPeople} Cupos
                            </p>
                        </div>
                        <button className="button-experiences" onClick={index < experiences.length - 1 ? () => scrollToExperience(index + 1) : undefined}>Ver más</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ExperiencesPage;