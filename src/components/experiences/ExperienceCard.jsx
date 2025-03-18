import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LazyImage from '../common/LazyImage/LazyImage';
import './ExperienceCard.css';

// Import all images as constants
import caminoIcon from '../../assets/images/ExperiencesPage/camino.png';
import calendarioIcon from '../../assets/images/ExperiencesPage/calendario.png';
import participantesIcon from '../../assets/images/ExperiencesPage/participantes.png';
import profileFallbackImage from '../../assets/images/landing-page/profile_managemente/profile_picture_1.png';

/**
 * RatingDisplay component
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
 * DifficultyDisplay component
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
 * ExperienceStats component
 */
export const ExperienceStats = ({ distance, time, minPeople, maxPeople }) => {
  return (
    <div className="data-container-experiences">
      <p className="data-text-experiences">
        <img src={caminoIcon} alt="Camino" className="camino-icon-experiences" />
        {distance}
      </p>
      <p className="data-text-experiences">
        <img src={calendarioIcon} alt="Calendario" className="calendar-icon-experiences" />
        {time}
      </p>
      <p className="data-text-experiences">
        <img src={participantesIcon} alt="Participantes" className="participantes-icon-experiences" />
        {minPeople} - {maxPeople} Cupos
      </p>
    </div>
  );
};

ExperienceStats.propTypes = {
  distance: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  minPeople: PropTypes.number.isRequired,
  maxPeople: PropTypes.number.isRequired
};

/**
 * ExperienceImage component with improved image handling
 */
// Update the ExperienceImage component in ExperienceCard.jsx

export const ExperienceImage = ({ imageUrl, price, alt }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  // Detect device type for optimal image positioning
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };
    
    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
    
    return () => {
      window.removeEventListener('resize', checkDeviceType);
    };
  }, []);

  // Changed to cover to fill the space completely
  const imageStyle = {
    objectFit: 'cover',
    height: '100%',
    width: '100%',
    borderRadius: isMobile ? '8px 8px 0 0' : '8px 0 0 8px'
  };

  return (
    <div className="image-container-experiences">
      <LazyImage
        src={imageUrl}
        alt={alt || 'Experience image'}
        className="image-experiences"
        fallbackSrc={profileFallbackImage}
        placeholderColor='#2a3a2a'
        threshold={0.2}
        style={imageStyle}
        onError={() => setImageFailed(true)}
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
 * Formats the review date consistently.
 */
const formatReviewDate = (date) => {
    if (!date) {
        return 'Fecha no disponible';
    }

    try {
        let jsDate;
        if (typeof date === 'string') {
          jsDate = new Date(date);
        } else if (date.toDate) {
            // It's a Firestore Timestamp
            jsDate = date.toDate();
        } else if (date instanceof Date) {
            jsDate = date;
        } else {
          return 'Formato de fecha incorrecto';
        }

        // Check if jsDate is valid
        if (isNaN(jsDate.getTime())) {
            return 'Fecha inválida';
        }

        return jsDate.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (error) {
        console.error("Error formatting date:", error);
        return 'Error al formatear fecha';
    }
};

/**
 * Calculates the average rating for an experience.
 */
export const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) {
        return 0;
    }

    let totalRating = 0;
    for (const review of reviews) {
        if (review && typeof review.rating === 'number') {
            totalRating += review.rating;
        } else {
            console.warn("Invalid review format:", review);
        }
    }

    return Math.round(totalRating / reviews.length);
};

/**
 * Main ExperienceCard component
 */
const ExperienceCard = ({ experience, onViewMore, forwardedRef, isReviewsPage = false, isExpanded = false }) => {
  const textStyle = isExpanded ? "review-text-no-fade" : "review-text";
  
  // Add window width tracking for responsive behavior
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate average rating ONLY IF reviews exist.
  const averageRating = experience.reviews ? calculateAverageRating(experience.reviews) : 0;

  return (
    <div className={`experience-card-experiences ${isReviewsPage ? 'review-card' : ''}`} ref={forwardedRef}>
      <ExperienceImage
        imageUrl={experience.imageUrl}
        price={experience.price}
        alt={experience.name}
      />

      <div className="experience-info-experiences">
        {/* Use the calculated averageRating */}
        <RatingDisplay rating={averageRating} />
        <DifficultyDisplay difficulty={experience.difficulty} />
        <h2 className="subtitle-experiences">{experience.name}</h2>
        <ExperienceStats
            distance={experience.distance}
            time={experience.time}
            minPeople={experience.minPeople}
            maxPeople={experience.maxPeople}
        />
        
        {/* Conditionally render shorter description on mobile */}
        <p className="description-experiences">
          {isMobile && !isExpanded && experience.description.length > 100 
            ? `${experience.description.substring(0, 100)}...` 
            : experience.description}
        </p>

        {/* Button (ONLY show when NOT isReviewsPage) */}
        {!isReviewsPage && (
          <button className="button-experiences" onClick={() => onViewMore(experience)}>
             Ver más
          </button>
        )}
        
        {/* Button for Reviews Page(ONLY show when isReviewsPage) */}
        {isReviewsPage && !isExpanded && (
          <button className="button-experiences" onClick={() => onViewMore(experience)}>
            Ver Reseñas
          </button>
        )}
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
    minPeople: PropTypes.number.isRequired,
    maxPeople: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    reviews: PropTypes.arrayOf(PropTypes.shape({
      user: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      userEmail: PropTypes.string,
      profileImage: PropTypes.string,
      rating: PropTypes.number,
    })),
  }).isRequired,
  onViewMore: PropTypes.func.isRequired,
  forwardedRef: PropTypes.object,
  isReviewsPage: PropTypes.bool,
  isExpanded: PropTypes.bool,
};

export default ExperienceCard;