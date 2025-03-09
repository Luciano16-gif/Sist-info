// ExperiencesPage.jsx

import React, { useRef } from 'react';
import './ExperiencesPage.css';

function ExperiencesPage() {
    const experienceRefs = [useRef(null), useRef(null)]; // Crea un array de refs.  Añade más si tienes más experiencias.

    const scrollToExperience = (index) => {
        if (experienceRefs[index] && experienceRefs[index].current) {
            experienceRefs[index].current.scrollIntoView({
                behavior: 'smooth', // Animación suave
                block: 'start',    // Alinea la parte superior del elemento con la parte superior del área visible.
            });
        }
    };

    return (
        <div className="container-experiences">
            <h1 className="title-experiences">¡Todas nuestras experiencias disponibles para ti!</h1>

            {/* Primera tarjeta */}
            <div className="experience-card-experiences" ref={experienceRefs[0]}>
                <div className="image-container-experiences">
                    <img src="../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png" alt="Cascada" className="image-experiences" />
                    <div className="price-overlay-experiences">25 $</div>
                </div>
                <div className="experience-info-experiences">
                    <div className="rating-box-experiences">
                        <span>Puntuación: </span>
                        <span className='dot-experiences'></span>
                        <span className='dot-experiences'></span>
                        <span className='dot-experiences'></span>
                        <span className='dot-experiences'></span>
                        <span className='dot-gray-experiences'></span>
                    </div>
                    <h2 className="subtitle-experiences">Sendero de la Cascada</h2>
                    <p className="description-experiences">Adéntrate en la frescura del bosque para encontrar una hermosa cascada oculta.  Esta ruta moderada combina la emoción del senderismo con la relajación. ¡Una aventura refrescante y revitalizante te espera!</p>
                    
                    <div className="data-container-experiences">
                        <p className="data-text-experiences">
                            <img src="../../src/assets/images/ExperiencesPage/camino.png" alt="Camino" className="camino-icon-experiences" />
                             6 KM
                        </p>
                        <p className="data-text-experiences">
                            <img src="../../src/assets/images/ExperiencesPage/calendario.png" alt="Calendario" className="calendar-icon-experiences" />
                            <i className="far fa-clock"></i> 7:00AM - 3:00PM
                        </p>
                        <p className="data-text-experiences">
                            <img src="../../src/assets/images/ExperiencesPage/participantes.png" alt="Participantes" className="participantes-icon-experiences" />
                            20 / 40 Cupos
                        </p>
                    </div>
                    <button className="button-experiences" onClick={() => scrollToExperience(1)}>Ver más</button> {/* Agregado onClick y texto cambiado*/}
                </div>
            </div>

            {/* Segunda tarjeta */}
            <div className="experience-card-experiences" ref={experienceRefs[1]}>
                 <div className="image-container-experiences">
                    <img src="../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png" alt="Ave" className="image-experiences" /> {/*Usa un placeholder mientras*/}
                    <div className="price-overlay-experiences">30 $</div>
                </div>
                <div className="experience-info-experiences">
                     <div className="rating-box-experiences">
                        <span>Puntuación: </span>
                        <span className='dot-experiences'></span>
                        <span className='dot-experiences'></span>
                        <span className='dot-experiences'></span>
                        <span className='dot-gray-experiences'></span>
                        <span className='dot-gray-experiences'></span>
                    </div>
                    <h2 className="subtitle-experiences">Sendero de la Flora y Fauna</h2>
                    <p className="description-experiences">Perfecto para los amantes de la naturaleza, este sendero te sumerge en el ecosistema de Ávila.  Con guías expertos, aprenderás sobre las especies únicas de flora y fauna mientras disfrutas de la tranquilidad del entorno natural.</p>
                   
                    <div className="data-container-experiences">
                        <p className="data-text-experiences">
                            <img src="../../src/assets/images/ExperiencesPage/camino.png" alt="Camino" className="camino-icon-experiences" />
                            5 KM
                        </p>
                        <p className="data-text-experiences">
                            <img src="../../src/assets/images/ExperiencesPage/calendario.png" alt="Calendario" className="calendar-icon-experiences" />
                            <i className="far fa-clock"></i> 9:00AM - 4:00PM
                        </p>
                        <p className="data-text-experiences">
                            <img src="../../src/assets/images/ExperiencesPage/participantes.png" alt="Participantes" className="participantes-icon-experiences" />
                            25 / 30 Cupos
                        </p>
                    </div>
                    <button className="button-experiences">Ver más</button>  {/* Puedes agregar onClick aquí si quieres ir a otra sección */}
                </div>
               
            </div>

            {/* Añade más tarjetas con sus refs correspondientes */}
        </div>
    );
}

export default ExperiencesPage;