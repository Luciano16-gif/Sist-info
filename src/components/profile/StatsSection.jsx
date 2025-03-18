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
    
    {tipoUsuario === 'admin' ? (
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
        <div className="stat-item">
          <label className="stat-label">EXPERIENCIA MÁS REALIZADA</label>
          <p className="stat-value">
            {mostPerformedActivity.Actividad 
              ? `${mostPerformedActivity.Actividad} = ${mostPerformedActivity.timesPerformed} veces completada` 
              : 'No hay datos disponibles'}
          </p>
        </div>
      </>
    )}

    {tipoUsuario === 'Guia' && (
      <div className="stat-item">
        <label className="stat-label">EXPERIENCIAS ACTUALES</label>
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <p key={index} className="stat-value">
              {activity.route} - {activity.days} [{activity.schedule}]
            </p>
          ))
        ) : (
          <p className="stat-value">No hay experiencias actuales</p>
        )}
      </div>
    )}
  </div>
);

export default StatsSection;