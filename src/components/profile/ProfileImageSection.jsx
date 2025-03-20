import React from 'react';
import { AuthButton } from '../Auth/AuthComponents';

/**
 * Component for displaying and updating profile image
 */
const ProfileImageSection = ({ 
  fotoPerfilUrl, 
  isEditing, 
  handleFileChange, 
  file, 
  uploadProgress, 
  isUploading, 
  previewImageUrl 
}) => (
  <div className="profile-image-container">
    <img 
      src={isEditing && previewImageUrl ? previewImageUrl : (fotoPerfilUrl || "/profile-placeholder.png")} 
      alt="Perfil" 
      className={`profile-image ${isEditing ? 'editable' : ''}`} 
      onClick={() => isEditing && document.getElementById('file-input').click()} 
    />
    {isEditing && (
      <div className="image-upload-controls">
        <input 
          id="file-input" 
          type="file" 
          accept="image/png, image/jpeg, image/webp" 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
        />
        <AuthButton 
          className="change-photo-button"
          onClick={() => document.getElementById('file-input').click()}
        >
          Cambiar Foto
        </AuthButton>
        
        {file && (
          <div className="selected-file">
            <span>Archivo: {file.name}</span>
          </div>
        )}
        
        {isUploading && (
          <div className="upload-progress-container">
            <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }}></div>
            <span className="upload-progress-text">{uploadProgress}%</span>
          </div>
        )}
      </div>
    )}
  </div>
);

export default ProfileImageSection;