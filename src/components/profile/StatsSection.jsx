import React from 'react';

/**
 * Component for displaying user statistics and activities
 */

const StatsSection = ({ 
  tipoUsuario, 
  activitiesCreatedCount, 
  activitiesPerformed, 
  mostPerformedActivity, 
  activities 
}) => (
  <div className="stats-section">
    <h2 className="section-title">Estadísticas y Actividad</h2>
    {tipoUsuario === 'admin' || tipoUsuario === 'guia' ? (
      <div className="stat-item">
        <label className="stat-label">EXPERIENCIAS CREADAS</label>
        <p className="stat-value">{activitiesCreatedCount} experiencias creadas</p>
      </div>
    ) : (
      <>
        <div className="stat-item">
          <label className="stat-label">EXPERIENCIAS COMPLETADAS</label>
          <p className="stat-value">
            {activitiesPerformed.length > 0 
              ? activitiesPerformed.join(', ') 
              : 'No hay experiencias completadas'}
          </p>
        </div>
      </>
    )}
  </div>
);

export default StatsSection;