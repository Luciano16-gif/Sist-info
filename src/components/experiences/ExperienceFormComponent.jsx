import { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './DatePicker.css';

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
 * Updated DateSelector component with specific date selection
 */
export const DateSelector = ({ selectedDates = [], onDateChange, error }) => {
  const [mainDate, setMainDate] = useState(null);
  const [repetitionWeeks, setRepetitionWeeks] = useState(0);
  const [customDate, setCustomDate] = useState(null);
  const [customDates, setCustomDates] = useState([]);
  
  // Separate main/recurring dates from custom dates when component mounts or selectedDates changes
  useEffect(() => {
    // If we don't have a mainDate yet but have selectedDates, try to set the main date
    if (!mainDate && selectedDates.length > 0) {
      const firstDate = new Date(selectedDates[0]);
      if (!isNaN(firstDate.getTime())) {
        setMainDate(firstDate);
        
        // Try to determine repetition by looking at intervals between dates
        // This is a simplified approach - might not be perfect
        if (selectedDates.length > 1) {
          const weekDates = selectedDates.filter((_, index) => index > 0 && index <= 12);
          setRepetitionWeeks(weekDates.length);
        }
      }
    }
  }, []);
  
  // Generate recurring dates based on main date and repetition weeks
  const generateDates = (baseDate, weeks) => {
    if (!baseDate) return [];
    
    const dates = [];
    const baseDateObj = new Date(baseDate);
    
    // Add the main date
    dates.push(baseDateObj.toISOString());
    
    // Add recurring dates if weeks > 0
    for (let i = 1; i <= weeks; i++) {
      const nextDate = new Date(baseDateObj);
      nextDate.setDate(baseDateObj.getDate() + (i * 7));
      dates.push(nextDate.toISOString());
    }
    
    return dates;
  };
  
  // Handle when repetition is changed
  const handleRepetitionChange = (weeks) => {
    if (!mainDate) return;
    
    setRepetitionWeeks(weeks);
    
    // Generate new dates based on main date and repetition
    const newRecurringDates = generateDates(mainDate, weeks);
    
    // Combine with custom dates and update
    onDateChange([...newRecurringDates, ...customDates]);
  };
  
  // Handle main date selection
  const handleDateSelect = (date) => {
    if (!date) return;
    
    setMainDate(date);
    
    // Generate dates based on the current repetition setting
    const newRecurringDates = generateDates(date, repetitionWeeks);
    
    // Combine with custom dates and update
    onDateChange([...newRecurringDates, ...customDates]);
  };
  
  // Handle adding a custom date
  const handleAddCustomDate = () => {
    if (!customDate) return;
    
    const dateStr = customDate.toISOString();
    
    // Add to custom dates list
    const newCustomDates = [...customDates, dateStr];
    setCustomDates(newCustomDates);
    
    // Add to selected dates
    const recurringDates = mainDate ? generateDates(mainDate, repetitionWeeks) : [];
    onDateChange([...recurringDates, ...newCustomDates]);
    
    // Reset custom date picker
    setCustomDate(null);
  };
  
  // Handle removing a date
  const handleRemoveDate = (dateToRemove) => {
    // Check if it's the main date
    if (mainDate && mainDate.toISOString() === dateToRemove) {
      // If removing main date, clear main date and all recurring dates
      setMainDate(null);
      setRepetitionWeeks(0);
      
      // Keep only custom dates
      onDateChange([...customDates.filter(d => d !== dateToRemove)]);
      return;
    }
    
    // Check if it's a recurring date (not the main date)
    const isRecurringDate = mainDate && 
      repetitionWeeks > 0 && 
      generateDates(mainDate, repetitionWeeks).includes(dateToRemove);
      
    if (isRecurringDate) {
      // If removing a recurring date, remove all recurring dates and reset repetition
      setRepetitionWeeks(0);
      
      // Keep only main date and custom dates
      const mainDateStr = mainDate ? mainDate.toISOString() : null;
      const updatedDates = [
        ...(mainDateStr ? [mainDateStr] : []),
        ...customDates.filter(d => d !== dateToRemove)
      ];
      onDateChange(updatedDates);
      return;
    }
    
    // Otherwise it's a custom date
    const newCustomDates = customDates.filter(d => d !== dateToRemove);
    setCustomDates(newCustomDates);
    
    // Update selected dates
    const recurringDates = mainDate ? generateDates(mainDate, repetitionWeeks) : [];
    onDateChange([...recurringDates, ...newCustomDates]);
  };
  
  // Format a date for display
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "Fecha inválida";
      
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return "Fecha inválida";
    }
  };
  
  // Remove duplicate dates
  const uniqueDates = Array.from(new Set(selectedDates));
  
  return (
    <div className="campo-crear-experiencia">
      <label>Fecha Inicial</label>
      
      {/* Main date picker */}
      <div className="date-select-container">
        <DatePicker
          selected={mainDate}
          onChange={handleDateSelect}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          placeholderText="Seleccione fecha inicial"
          className={error ? 'input-error' : ''}
        />
      </div>
      
      {/* Repetition options - only show if main date is selected */}
      {mainDate && (
        <div className="repetition-container">
          <label>Repetir semanalmente por:</label>
          <div className="date-buttons-container">
            {[0, 1, 2, 3, 4, 8, 12].map((weeks) => (
              <button
                key={weeks}
                type="button"
                className={`date-button ${repetitionWeeks === weeks ? 'selected' : ''}`}
                onClick={() => handleRepetitionChange(weeks)}
              >
                {weeks === 0 ? 'Sin repetición' : `${weeks} semanas`}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Custom date selection */}
      <div className="custom-date-container">
        <label>Agregar fecha adicional:</label>
        <div className="add-activity-container">
          <DatePicker
            selected={customDate}
            onChange={setCustomDate}
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            placeholderText="Fecha adicional"
            className="nuevo-tipo-input"
          />
          <button
            type="button"
            onClick={handleAddCustomDate}
            disabled={!customDate}
            className="add-activity-button"
          >
            Agregar
          </button>
        </div>
      </div>
      
      {/* Display selected dates */}
      {uniqueDates.length > 0 && (
        <div className="selected-dates-container">
          <label>Fechas seleccionadas:</label>
          <div className="incluidos-options-container">
            {uniqueDates.map((dateStr, index) => (
              <div key={index} className="incluido-option">
                <span>{formatDate(dateStr)}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveDate(dateStr)}
                  className="remove-date-button"
                  aria-label="Eliminar fecha"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {error && <div className="form-error">{error}</div>}
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