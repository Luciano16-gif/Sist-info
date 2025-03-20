/**
 * Validate image requirement for edit mode
 * @param {Object} formState - Current form state
 * @param {Object} originalExperience - Original experience data
 * @param {Object} errors - Current validation errors object to modify
 * @returns {boolean} Is image valid
 */
export const validateImageForEditMode = (formState, originalExperience, errors) => {
    console.log("Validating image for edit mode");
    console.log("Original experience image URL:", originalExperience?.imageUrl);
    console.log("Current form state image:", formState.imageFile ? "Has new image" : "No new image");
    
    // If we already have an image URL from the original experience and no new image file
    // was selected, then we should not require a new image upload
    if (!formState.imageFile && originalExperience && originalExperience.imageUrl) {
      // Remove the image error if it exists
      if (errors.imagen) {
        console.log("Removing imagen error because we're using the existing image");
        delete errors.imagen;
      }
      return true;
    }
    
    // If no original image and no new image, then an image is required
    if (!formState.imageFile && (!originalExperience || !originalExperience.imageUrl)) {
      errors.imagen = 'Debe seleccionar una imagen para la experiencia.';
      return false;
    }
    
    return !errors.imagen;
  };
  
  /**
   * Validate guides match requirements
   * @param {Object} formState - Current form state
   * @param {Object} errors - Current validation errors object to modify
   * @returns {boolean} Are guides valid
   */
  export const validateGuidesMatch = (formState, errors) => {
    const requiredGuides = parseInt(formState.guiasRequeridos || '0', 10);
    const selectedGuides = formState.guiasSeleccionados ? formState.guiasSeleccionados.length : 0;
    
    if (requiredGuides !== selectedGuides) {
      errors.guias = `La cantidad de guías seleccionados (${selectedGuides}) debe ser igual a la cantidad requerida (${requiredGuides}).`;
      return false;
    }
    
    // Remove the error if it exists and validation passes
    if (errors.guias) {
      delete errors.guias;
    }
    
    return true;
  };
  
  /**
   * Validate that at least one date is selected
   * @param {Array} dates - Selected dates array
   * @param {Object} errors - Current validation errors object to modify
   * @returns {boolean} Are dates valid
   */
  export const validateDatesNotEmpty = (dates, errors) => {
    if (!dates || dates.length === 0) {
      errors.fechas = 'Se requiere al menos una fecha para la experiencia.';
      return false;
    }
    
    // Remove the error if it exists and validation passes
    if (errors.fechas) {
      delete errors.fechas;
    }
    
    return true;
  };
  
  /**
   * Custom validation for edit mode that handles special cases like existing images
   * @param {Object} formState - Current form state
   * @param {Object} originalExperience - Original experience data
   * @param {Object} originalErrors - Original validation errors from standard validation
   * @returns {Object} Updated errors and isValid flag
   */
  export const validateExperienceEditForm = (formState, originalExperience, originalErrors) => {
    const errors = { ...originalErrors };
    
    // Validate image (skip requirement if using existing image)
    validateImageForEditMode(formState, originalExperience, errors);
    
    // Validate guides match requirements
    validateGuidesMatch(formState, errors);
    
    // Validate dates
    validateDatesNotEmpty(formState.fechas, errors);
    
    // Check if there are any remaining errors
    const hasErrors = Object.keys(errors).length > 0;
    
    return {
      isValid: !hasErrors,
      errors
    };
  };
  
  /**
   * Prepare experience data for update by handling image URLs correctly
   * @param {Object} formState - Current form state
   * @param {Object} originalExperience - Original experience data
   * @returns {Object} Data ready for update
   */
  export const prepareExperienceUpdateData = (formState, originalExperience) => {
    return {
      nombre: formState.nombre,
      precio: parseFloat(formState.precio) || 0,
      fechas: formState.fechas || [],
      descripcion: formState.descripcion,
      horarioInicio: formState.horarioInicio,
      horarioFin: formState.horarioFin,
      puntoSalida: formState.puntoSalida,
      longitudRecorrido: parseFloat(formState.longitudRecorrido) || 0,
      duracionRecorrido: parseInt(formState.duracionRecorrido, 10) || 0,
      guiasRequeridos: parseInt(formState.guiasRequeridos, 10) || 0,
      guias: formState.guiasSeleccionados || [],
      minimoUsuarios: parseInt(formState.minimoUsuarios, 10) || 0,
      maximoUsuarios: parseInt(formState.maximoUsuarios, 10) || 0,
      incluidosExperiencia: formState.incluidosExperiencia || [],
      tipoActividad: formState.tipoActividad,
      dificultad: formState.dificultad || 0,
      status: 'accepted', // Always accepted when admin edits
      imageUrl: originalExperience.imageUrl, // Preserve original image URL
      // Only include imageFile if user uploaded a new image
      ...(formState.imageFile ? { imageFile: formState.imageFile } : {})
    };
  };