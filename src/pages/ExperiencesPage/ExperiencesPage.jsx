import React, { useRef } from 'react';
import './ExperiencesPage.css';
import { useNavigate } from 'react-router-dom';

// Custom hook for fetching experiences
import { useExperiences } from '../../components/hooks/experiences-hooks/useExperiences';

// Components
import ExperienceCard from '../../components/experiences/ExperienceCard';

/**
 * LoadingState component for displaying during data loading
 */
const LoadingState = () => (
  <div className="loading-container">
    <p>Cargando experiencias...</p>
    <div className="loading-spinner"></div>
  </div>
);

/**
 * ErrorState component for displaying error messages
 */
const ErrorState = ({ message }) => (
  <div className="error-container">
    <p>Error: {message}</p>
    <button onClick={() => window.location.reload()} className="retry-button">
      Reintentar
    </button>
  </div>
);

/**
 * EmptyState component when no experiences are available
 */
const EmptyState = () => (
  <div className="empty-container">
    <p>No hay experiencias disponibles en este momento.</p>
    <p>¡Vuelve pronto para descubrir nuevas aventuras!</p>
  </div>
);

/**
 * Main ExperiencesPage component
 */
function ExperiencesPage() {
  const { experiences, loading, error } = useExperiences();
  const experienceRefs = useRef([]);
  const navigate = useNavigate();

  // Scroll to a specific experience by index
  const scrollToExperience = (index) => {
    if (experienceRefs.current[index] && experienceRefs.current[index].current) {
      experienceRefs.current[index].current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Handle "View More" button click
  const handleViewMore = (experience) => {
    if (loading) {
      console.log("Data is still loading. Cannot view details yet.");
      return;
    }
    console.log("Experience ID being passed:", experience.id);
    navigate('/booking', { state: { experience } });
  };

  // Initialize refs when experiences are loaded
  if (!loading && !error && experiences.length > 0) {
    experienceRefs.current = experiences.map((_, i) => experienceRefs.current[i] || React.createRef());
  }

  // Render content based on state
  const renderContent = () => {
    if (loading) {
      return <LoadingState />;
    }
    
    if (error) {
      return <ErrorState message={error} />;
    }
    
    if (experiences.length === 0) {
      return <EmptyState />;
    }
    
    return experiences.map((experience, index) => (
      <ExperienceCard
        key={experience.id}
        experience={experience}
        onViewMore={handleViewMore}
        forwardedRef={experienceRefs.current[index]}
      />
    ));
  };

  return (
    <div className="container-experiences" style={{ marginTop: "60px" }}>
      <h1 className="title-experiences" style={{ marginTop: "40px" }}>
        ¡Todas nuestras experiencias disponibles para ti!
      </h1>
      
      {renderContent()}
    </div>
  );
}

export default ExperiencesPage;