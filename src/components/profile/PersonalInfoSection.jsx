import React from 'react';
import { FormField } from '../Auth/AuthComponents';

/**
 * Component for displaying and editing personal information
 */
const PersonalInfoSection = ({ 
  formData, 
  handleInputChange, 
  handleBlur, 
  formErrors, 
  isEditing, 
  fechaRegistro 
}) => (
  <div className="info-section">
    <h2 className="section-title">Información Personal</h2>
    
    <div className="info-item">
      <label className="info-label">NOMBRE COMPLETO</label>
      {isEditing ? (
        <FormField
          type="text"
          value={formData.nombreCompleto}
          onChange={handleInputChange('nombreCompleto')}
          onBlur={handleBlur('nombreCompleto')}
          placeholder="Nombre Completo"
          error={formErrors.nombreCompleto}
          className="info-input"
        />
      ) : (
        <p className="info-value">{formData.nombreCompleto || 'No disponible'}</p>
      )}
    </div>
    
    <div className="info-item">
      <label className="info-label">CORREO ELECTRÓNICO</label>
      <p className="info-value">{formData.correoElectronico || 'No disponible'}</p>
    </div>
    
    <div className="info-item">
      <label className="info-label">NÚMERO TELEFÓNICO</label>
      {isEditing ? (
        <FormField
          type="tel"
          value={formData.numeroTelefonico}
          onChange={handleInputChange('numeroTelefonico')}
          onBlur={handleBlur('numeroTelefonico')}
          placeholder="Número Telefónico (11 dígitos)"
          error={formErrors.numeroTelefonico}
          className="info-input"
        />
      ) : (
        <p className="info-value">{formData.numeroTelefonico || 'No disponible'}</p>
      )}
    </div>
    
    <div className="info-item">
      <label className="info-label">FECHA DE REGISTRO</label>
      <p className="info-value">{fechaRegistro || 'No disponible'}</p>
    </div>
  </div>
);

export default PersonalInfoSection;