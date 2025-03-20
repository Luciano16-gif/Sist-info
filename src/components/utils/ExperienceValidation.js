/**
 * Utility functions for validating experience form data
 */

/**
 * Validates text input fields requiring non-empty strings
 * @param {string} value - The string to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} Validation result with isValid and error message
 */
export const validateRequiredField = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `El campo ${fieldName} es obligatorio.` };
  }
  return { isValid: true, error: null };
};

/**
 * Validates numeric price input
 * @param {string} price - Price value to validate
 * @returns {Object} Validation result with isValid and error message
 */
export const validatePrice = (price) => {
  if (!price || price.trim() === '') {
    return { isValid: false, error: 'El precio es obligatorio.' };
  }
  
  if (!/^\d+(\.\d{0,2})?$/.test(price)) {
    return { isValid: false, error: 'Por favor ingrese un número válido para el precio.' };
  }
  
  const priceValue = parseFloat(price);
  if (priceValue <= 0) {
    return { isValid: false, error: 'El precio debe ser mayor que cero.' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates time format (HH:MM)
 * @param {string} time - Time string to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} Validation result with isValid and error message
 */
export const validateTime = (time, fieldName) => {
  if (!time || time.trim() === '') {
    return { isValid: false, error: `El horario de ${fieldName} es obligatorio.` };
  }
  
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return { isValid: false, error: `Por favor, ingrese un horario válido en formato HH:MM para ${fieldName}.` };
  }
  
  const [hours, minutes] = time.split(':').map(Number);
  
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return { isValid: false, error: `Por favor, ingrese horas y minutos válidos (horas 0-23, minutos 0-59) para ${fieldName}.` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates time range (end time comes after start time)
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {Object} Validation result with isValid and error message
 */
export const validateTimeRange = (startTime, endTime) => {
  // First ensure both times are valid
  const startValid = validateTime(startTime, 'inicio');
  const endValid = validateTime(endTime, 'fin');
  
  if (!startValid.isValid) return startValid;
  if (!endValid.isValid) return endValid;
  
  // Parse times to compare
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  if (startHours > endHours || (startHours === endHours && startMinutes >= endMinutes)) {
    return { isValid: false, error: 'La hora de finalización debe ser posterior a la hora de inicio.' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates integers (must be positive)
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @param {boolean} allowZero - Whether to allow zero as a valid value
 * @returns {Object} Validation result with isValid and error message
 */
export const validatePositiveInteger = (value, fieldName, allowZero = false) => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `El campo ${fieldName} es obligatorio.` };
  }
  
  if (!/^\d+$/.test(value)) {
    return { isValid: false, error: `Por favor, ingrese un número entero válido para ${fieldName}.` };
  }
  
  const numValue = parseInt(value, 10);
  
  if (allowZero) {
    if (numValue < 0) {
      return { isValid: false, error: `El valor de ${fieldName} no puede ser negativo.` };
    }
  } else {
    if (numValue <= 0) {
      return { isValid: false, error: `El valor de ${fieldName} debe ser mayor que cero.` };
    }
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates numeric values (can have decimals)
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} Validation result with isValid and error message
 */
export const validateNumeric = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `El campo ${fieldName} es obligatorio.` };
  }
  
  if (!/^\d+(\.\d*)?$/.test(value)) {
    return { isValid: false, error: `Por favor, ingrese un número válido para ${fieldName}.` };
  }
  
  const numValue = parseFloat(value);
  
  if (numValue <= 0) {
    return { isValid: false, error: `El valor de ${fieldName} debe ser mayor que cero.` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates min and max user counts
 * @param {string} min - Minimum user count
 * @param {string} max - Maximum user count
 * @returns {Object} Validation result with isValid and error message
 */
export const validateUserLimits = (min, max) => {
  const minValid = validatePositiveInteger(min, 'mínimo de usuarios');
  const maxValid = validatePositiveInteger(max, 'máximo de usuarios');
  
  if (!minValid.isValid) return minValid;
  if (!maxValid.isValid) return maxValid;
  
  const minUsers = parseInt(min, 10);
  const maxUsers = parseInt(max, 10);
  
  if (minUsers > maxUsers) {
    return { isValid: false, error: 'El mínimo de usuarios no puede ser mayor que el máximo de usuarios.' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates array fields that should not be empty
 * @param {Array} array - Array to check if empty
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} Validation result with isValid and error message
 */
export const validateArrayNotEmpty = (array, fieldName) => {
  if (!array || array.length === 0) {
    return { isValid: false, error: `Debe seleccionar al menos un(a) ${fieldName}.` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates dates array to ensure it has at least one date
 * @param {Array} dates - Array of date strings
 * @returns {Object} Validation result with isValid and error message
 */
export const validateDates = (dates) => {
  if (!dates || dates.length === 0) {
    return { isValid: false, error: 'Debe seleccionar al menos una fecha para la experiencia.' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates difficulty level (must be 1-5)
 * @param {number} difficulty - Difficulty level
 * @returns {Object} Validation result with isValid and error message
 */
export const validateDifficulty = (difficulty) => {
  if (!difficulty || difficulty < 1 || difficulty > 5) {
    return { isValid: false, error: 'Debe seleccionar un nivel de dificultad (1-5).' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates that selected guides match required guides count
 * @param {Array} selectedGuides - Array of selected guides
 * @param {string} requiredGuides - Number of guides required as string
 * @returns {Object} Validation result with isValid and error message
 */
export const validateGuidesSelection = (selectedGuides, requiredGuides) => {
  const guidesValid = validatePositiveInteger(requiredGuides, 'guías requeridos', true);
  
  if (!guidesValid.isValid) return guidesValid;
  
  const requiredCount = parseInt(requiredGuides, 10);
  
  if (selectedGuides.length !== requiredCount) {
    return { 
      isValid: false, 
      error: `La cantidad de guías seleccionados (${selectedGuides.length}) debe ser igual a la cantidad requerida (${requiredCount}).` 
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates the complete experience form data
 * @param {Object} formData - Complete form data object
 * @returns {Object} Validation result with isValid, errors object, and firstError
 */
export const validateExperienceForm = (formData) => {
  const errors = {};
  let isValid = true;
  
  // Required text fields
  const requiredFields = [
    { field: 'nombre', label: 'nombre de la experiencia' },
    { field: 'descripcion', label: 'descripción' },
    { field: 'puntoSalida', label: 'punto de salida' },
  ];
  
  requiredFields.forEach(({ field, label }) => {
    const validation = validateRequiredField(formData[field], label);
    if (!validation.isValid) {
      errors[field] = validation.error;
      isValid = false;
    }
  });
  
  // Price validation
  const priceValidation = validatePrice(formData.precio);
  if (!priceValidation.isValid) {
    errors.precio = priceValidation.error;
    isValid = false;
  }
  
  // Time validations
  const timeRangeValidation = validateTimeRange(formData.horarioInicio, formData.horarioFin);
  if (!timeRangeValidation.isValid) {
    errors.horario = timeRangeValidation.error;
    isValid = false;
  }
  
  // Numeric validations
  const numericFields = [
    { field: 'longitudRecorrido', label: 'longitud del recorrido' },
    { field: 'duracionRecorrido', label: 'duración del recorrido' },
  ];
  
  numericFields.forEach(({ field, label }) => {
    const validation = validateNumeric(formData[field], label);
    if (!validation.isValid) {
      errors[field] = validation.error;
      isValid = false;
    }
  });
  
  // User limits validation
  const userLimitsValidation = validateUserLimits(formData.minimoUsuarios, formData.maximoUsuarios);
  if (!userLimitsValidation.isValid) {
    errors.usuarios = userLimitsValidation.error;
    isValid = false;
  }
  
  // Updated: Dates validation (now check for specific dates)
  const datesValidation = validateDates(formData.fechas);
  if (!datesValidation.isValid) {
    errors.fechas = datesValidation.error;
    isValid = false;
  }
  
  // Array validations for included items
  const includedValidation = validateArrayNotEmpty(formData.incluidosExperiencia, 'elemento incluido');
  if (!includedValidation.isValid) {
    errors.incluidosExperiencia = includedValidation.error;
    isValid = false;
  }
  
  // Difficulty validation
  const difficultyValidation = validateDifficulty(formData.dificultad);
  if (!difficultyValidation.isValid) {
    errors.dificultad = difficultyValidation.error;
    isValid = false;
  }
  
  // Activity type validation
  const activityValidation = validateRequiredField(formData.tipoActividad, 'tipo de actividad');
  if (!activityValidation.isValid) {
    errors.tipoActividad = activityValidation.error;
    isValid = false;
  }
  
  // Guides validation
  const guidesValidation = validateGuidesSelection(formData.guiasSeleccionados, formData.guiasRequeridos);
  if (!guidesValidation.isValid) {
    errors.guias = guidesValidation.error;
    isValid = false;
  }
  
  // Image validation
  if (!formData.imageFile) {
    errors.imagen = 'Debe seleccionar una imagen para la experiencia.';
    isValid = false;
  }
  
  // Find the first error for focusing
  const firstError = Object.keys(errors)[0] || null;
  
  return { isValid, errors, firstError };
};