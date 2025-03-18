import React, { useRef } from 'react';

/**
 * Error message component for form fields
 */
export const FormError = ({ error }) => {
  if (!error) return null;
  return <div className="form-error">{error}</div>;
};

/**
 * Image uploader component with preview
 */
export const ImageUploader = ({ imagePreview, onImageChange, error }) => {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    onImageChange(file);
  };

  return (
    <div className="imagen-experiencia-container-crear-experiencia">
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleImageChange}
      />
      <div 
        className={`imagen-placeholder-crear-experiencia ${error ? 'error' : ''}`} 
        onClick={handleImageClick} 
        role="button" 
        aria-label="Upload image"
      >
        <img 
          src={imagePreview} 
          alt="Preview" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>
      <FormError error={error} />
    </div>
  );
};

/**
 * Text input field component
 */
export const TextInput = ({ id, label, value, onChange, error, placeholder }) => {
  return (
    <div className="campo-crear-experiencia">
      <label htmlFor={id}>{label}</label>
      <input 
        type="text" 
        id={id} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
        className={error ? 'input-error' : ''}
      />
      <FormError error={error} />
    </div>
  );
};

/**
 * Text area component
 */
export const TextArea = ({ id, label, value, onChange, error, rows = 3 }) => {
  return (
    <div className="campo-crear-experiencia">
      <label htmlFor={id}>{label}</label>
      <textarea 
        id={id} 
        className={`descripcion-input-crear-experiencia ${error ? 'input-error' : ''}`} 
        value={value} 
        onChange={onChange}
        rows={rows}
      />
      <FormError error={error} />
    </div>
  );
};

/**
 * Time input component with HH:MM format
 */
export const TimeInput = ({ id, label, value, onChange, error }) => {
  return (
    <div className="campo-crear-experiencia">
      <label htmlFor={id}>{label}</label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        maxLength="5"
        placeholder="HH:MM"
        className={error ? 'input-error' : ''}
      />
      <FormError error={error} />
    </div>
  );
};

/**
 * Date selector component for weekdays
 */
export const DateSelector = ({ selectedDates, onDateChange, error }) => {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  return (
    <div className="campo-crear-experiencia">
      <label>Día de la semana</label>
      <div className="date-buttons-container">
        {days.map((day) => (
          <button
            key={day}
            type="button"
            className={`date-button ${selectedDates.includes(day) ? 'selected' : ''}`}
            onClick={() => onDateChange(day)}
          >
            {day}
          </button>
        ))}
      </div>
      <FormError error={error} />
    </div>
  );
};

/**
 * Difficulty selector component with dots
 */
export const DifficultySelector = ({ difficulty, onDifficultyChange, error }) => {
  const renderDifficultyCircles = () => {
    const circles = [];
    for (let i = 1; i <= 5; i++) {
      circles.push(
        <div
          key={i}
          className={`difficulty-circle ${i <= difficulty ? 'selected' : ''}`}
          onClick={() => onDifficultyChange(i)}
        ></div>
      );
    }
    return circles;
  };

  return (
    <div className="campo-crear-experiencia campo-crear-experiencia-dificultad">
      <label>Dificultad</label>
      <div className="difficulty-container">
        {renderDifficultyCircles()}
      </div>
      <FormError error={error} />
    </div>
  );
};

/**
 * Dropdown select component with add new option
 */
export const OptionSelector = ({ 
  id, 
  label, 
  value, 
  onChange, 
  options, 
  onAddNew, 
  error,
  newValueState,
  onNewValueChange,
  newValueError,
  placeholder = "Seleccione..."
}) => {
  const [newValue, setNewValue] = newValueState || useState('');
  const handleNewValueChange = onNewValueChange || ((e) => setNewValue(e.target.value));
  
  const handleAddClick = async () => {
    if (onAddNew && await onAddNew(newValue)) {
      setNewValue('');  // Only clear if using internal state
    }
  };

  return (
    <div className="campo-crear-experiencia">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={error ? 'input-error' : ''}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="add-activity-container">
        <input
          type="text"
          placeholder={`Nuevo ${label.toLowerCase()}...`}
          value={newValue}
          onChange={handleNewValueChange}
          className={`nuevo-tipo-input ${newValueError ? 'input-error' : ''}`}
        />
        <button 
          type="button" 
          onClick={handleAddClick} 
          className="add-activity-button"
        >
          Agregar
        </button>
      </div>
      <FormError error={error || newValueError} />
    </div>
  );
};

/**
 * Checkbox group component for multiple selections
 */
export const CheckboxGroup = ({ 
  label, 
  options, 
  selectedValues, 
  onChange, 
  onAddNew,
  error,
  newValueState,
  onNewValueChange,
  newValueError,
  containerClassName,
  itemClassName,
  idPrefix
}) => {
  const [newValue, setNewValue] = newValueState || useState('');
  const handleNewValueChange = onNewValueChange || ((e) => setNewValue(e.target.value));
  
  const handleAddClick = async () => {
    if (onAddNew && await onAddNew(newValue)) {
      setNewValue('');  // Only clear if using internal state
    }
  };

  return (
    <div className={`campo-crear-experiencia ${containerClassName || ''}`}>
      <label>{label}</label>
      <div className="incluidos-options-container">
        {options.map((option) => (
          <div key={option} className={itemClassName || "incluido-option"}>
            <input
              type="checkbox"
              id={`${idPrefix || 'item'}-${option}`}
              value={option}
              checked={selectedValues.includes(option)}
              onChange={() => onChange(option)}
            />
            <label htmlFor={`${idPrefix || 'item'}-${option}`}>{option}</label>
          </div>
        ))}
      </div>
      
      {onAddNew && (
        <div className="add-activity-container">
          <input
            type="text"
            placeholder={`Nuevo ${label.toLowerCase()}...`}
            value={newValue}
            onChange={handleNewValueChange}
            className={`nuevo-tipo-input ${newValueError ? 'input-error' : ''}`}
          />
          <button 
            type="button" 
            onClick={handleAddClick} 
            className="add-activity-button"
          >
            Agregar
          </button>
        </div>
      )}
      <FormError error={error || newValueError} />
    </div>
  );
};

/**
 * Guide selector component
 */
export const GuideSelector = ({ guiasDisponibles, guiasSeleccionados, onChange, error }) => {
  return (
    <div className="campo-crear-experiencia">
      <label>Seleccionar Guías:</label>
      <div className="guias-seleccion-container">
        {guiasDisponibles.map((guia) => (
          <div key={guia.id} className="guia-item">
            <input
              type="checkbox"
              id={`guia-${guia.id}`}
              checked={guiasSeleccionados.some((g) => g.id === guia.id)}
              onChange={() => onChange(guia)}
            />
            <label htmlFor={`guia-${guia.id}`}>
              {guia.name || guia.email || guia.id}
            </label>
          </div>
        ))}
      </div>
      <FormError error={error} />
    </div>
  );
};

/**
 * Submit button component
 */
export const SubmitButton = ({ onClick, isSubmitting, text = "Agregar" }) => {
  return (
    <button 
      className="boton-agregar-crear-experiencia" 
      onClick={onClick}
      disabled={isSubmitting}
    >
      {isSubmitting ? "Procesando..." : text}
    </button>
  );
};