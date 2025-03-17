import React, { useRef, useState, useEffect } from 'react';
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
  <div className="loading-container min-h-screen">
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
  const [acceptedExperiences, setAcceptedExperiences] = useState([]);

  // Filter for only accepted experiences
  useEffect(() => {
    if (!loading && !error && experiences.length > 0) {
      const filtered = experiences.filter(exp => {
        // Check if rawData exists and has status
        if (exp.rawData) {
          // Include experiences with 'accepted' status or no status (for backward compatibility)
          return exp.rawData.status === 'accepted' || exp.rawData.status === undefined;
        }
        return true; // Include experiences without rawData (shouldn't happen, but just in case)
      });
      setAcceptedExperiences(filtered);
    }
  }, [experiences, loading, error]);

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

        // Construct the URL-friendly name
        const urlFriendlyName = experience.name.toLowerCase().replace(/ /g, '-');

        // Navigate to the dynamic route
        navigate(`/booking/${urlFriendlyName}`, { state: { experience } });
    };

  // Initialize refs when experiences are loaded
  if (!loading && !error && acceptedExperiences.length > 0) {
    experienceRefs.current = acceptedExperiences.map((_, i) => experienceRefs.current[i] || React.createRef());
  }

  // Render content based on state
  const renderContent = () => {
    if (loading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState message={error} />;
    }

    if (acceptedExperiences.length === 0) {
      return <EmptyState />;
    }

    return acceptedExperiences.map((experience, index) => (
      <ExperienceCard
        key={experience.id}
        experience={experience}
        onViewMore={handleViewMore}
        forwardedRef={experienceRefs.current[index]}
      />
    ));
  };

  return (
    <div className="container-experiences" style={{ backgroundColor: '#172819' }}>
      <h1 className="title-experiences">
        ¡Todas nuestras experiencias disponibles para ti!
      </h1>

      {renderContent()}
    </div>
  );
}

export default ExperiencesPage;