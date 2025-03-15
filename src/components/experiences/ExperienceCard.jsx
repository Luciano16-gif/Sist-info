import React from 'react';
import PropTypes from 'prop-types';
import LazyImage from '../common/LazyImage/LazyImage';

// Import all images as constants
import caminoIcon from '../../assets/images/ExperiencesPage/camino.png';
import calendarioIcon from '../../assets/images/ExperiencesPage/calendario.png';
import participantesIcon from '../../assets/images/ExperiencesPage/participantes.png';
import profileFallbackImage from '../../assets/images/landing-page/profile_managemente/profile_picture_1.png';

/**
 * RatingDisplay component for showing star/dot ratings
 */
export const RatingDisplay = ({ rating, maxRating = 5 }) => {
  const renderRatingDots = () => {
    const fullDots = Math.floor(rating);
    const dots = [];
    
    for (let i = 0; i < fullDots; i++) {
      dots.push(<span key={`full-${i}`} className='dot-experiences'></span>);
    }
    
    for (let i = fullDots; i < maxRating; i++) {
      dots.push(<span key={`gray-${i}`} className='dot-gray-experiences'></span>);
    }
    
    return dots;
  };

  return (
    <div className="rating-box-experiences">
      <span>Puntuación: </span>
      {renderRatingDots()}
    </div>
  );
};

RatingDisplay.propTypes = {
  rating: PropTypes.number.isRequired,
  maxRating: PropTypes.number
};

/**
 * DifficultyDisplay component for showing difficulty level
 */
export const DifficultyDisplay = ({ difficulty, maxDifficulty = 5 }) => {
  const renderDifficultyDots = () => {
    const difficultyLevel = parseInt(difficulty, 10);
    const dots = [];
    
    if (isNaN(difficultyLevel)) {
      return <span>Invalid difficulty</span>;
    }
    
    for (let i = 0; i < difficultyLevel; i++) {
      dots.push(<span key={`diff-full-${i}`} className='dot-experiences'></span>);
    }
    
    for (let i = difficultyLevel; i < maxDifficulty; i++) {
      dots.push(<span key={`diff-gray-${i}`} className='dot-gray-experiences'></span>);
    }
    
    return dots;
  };

  return (
    <div className="rating-box-experiences">
      <span>Dificultad: </span>
      {renderDifficultyDots()}
    </div>
  );
};

DifficultyDisplay.propTypes = {
  difficulty: PropTypes.number.isRequired,
  maxDifficulty: PropTypes.number
};

/**
 * ExperienceStats component for showing distance, time, and slots
 */
export const ExperienceStats = ({ distance, time, registeredUsers, maxPeople }) => {
  return (
    <div className="data-container-experiences">
      <p className="data-text-experiences">
        <img src={caminoIcon} alt="Camino" className="camino-icon-experiences" />
        {distance}
      </p>
      <p className="data-text-experiences">
        <img src={calendarioIcon} alt="Calendario" className="calendar-icon-experiences" />
        <i className="far fa-clock"></i> {time}
      </p>
      <p className="data-text-experiences">
        <img src={participantesIcon} alt="Participantes" className="participantes-icon-experiences" />
        {registeredUsers} / {maxPeople} Cupos
      </p>
    </div>
  );
};

ExperienceStats.propTypes = {
  distance: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  registeredUsers: PropTypes.number.isRequired,
  maxPeople: PropTypes.number.isRequired
};

/**
 * ExperienceImage component for showing the experience image with price overlay
 * Now using LazyImage for optimized loading
 */
export const ExperienceImage = ({ imageUrl, price, alt }) => {
  return (
    <div className="image-container-experiences">
      <LazyImage 
        src={imageUrl} 
        alt={alt || 'Experience image'} 
        className="image-experiences"
        fallbackSrc={profileFallbackImage}
        placeholderColor='#2a3a2a'
        threshold={0.2}
      />
      <div className="price-overlay-experiences">{price} $</div>
    </div>
  );
};

ExperienceImage.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  alt: PropTypes.string
};

/**
 * Main ExperienceCard component that combines all elements
 */
const ExperienceCard = ({ experience, onViewMore, forwardedRef }) => {
  return (
    <div className="experience-card-experiences" ref={forwardedRef}>
      <ExperienceImage 
        imageUrl={experience.imageUrl} 
        price={experience.price} 
        alt={experience.name} 
      />
      
      <div className="experience-info-experiences">
        <RatingDisplay rating={experience.rating} />
        <DifficultyDisplay difficulty={experience.difficulty} />
        
        <h2 className="subtitle-experiences">{experience.name}</h2>
        <p className="description-experiences">{experience.description}</p>
        
        <ExperienceStats 
          distance={experience.distance}
          time={experience.time}
          registeredUsers={experience.registeredUsers}
          maxPeople={experience.maxPeople}
        />
        
        <button className="button-experiences" onClick={() => onViewMore(experience)}>
          Ver más
        </button>
      </div>
    </div>
  );
};

ExperienceCard.propTypes = {
  experience: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    difficulty: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    distance: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    registeredUsers: PropTypes.number.isRequired,
    maxPeople: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
  }).isRequired,
  onViewMore: PropTypes.func.isRequired,
  forwardedRef: PropTypes.object
};

export default ExperienceCard;