/**
 * Action types for Experience Form reducer
 */
export const ACTION_TYPES = {
    // Form field updates
    UPDATE_FIELD: 'UPDATE_FIELD',
    UPDATE_ARRAY_FIELD: 'UPDATE_ARRAY_FIELD',
    TOGGLE_ARRAY_ITEM: 'TOGGLE_ARRAY_ITEM',
    TOGGLE_OBJECT_ITEM: 'TOGGLE_OBJECT_ITEM',
    
    // Configuration updates
    SET_CONFIG: 'SET_CONFIG',
    
    // Form handling
    SET_ERRORS: 'SET_ERRORS',
    CLEAR_ERROR: 'CLEAR_ERROR',
    SET_SUBMITTING: 'SET_SUBMITTING',
    SET_SUBMIT_SUCCESS: 'SET_SUBMIT_SUCCESS',
    
    // Misc
    RESET_FORM: 'RESET_FORM',
    UPLOAD_IMAGE: 'UPLOAD_IMAGE'
  };
  
  /**
   * Action Creators
   */
  
  // Update a single form field
  export const updateField = (field, value) => ({
    type: ACTION_TYPES.UPDATE_FIELD,
    field,
    value
  });
  
  // Update an array field by replacing the entire array
  export const updateArrayField = (field, value) => ({
    type: ACTION_TYPES.UPDATE_ARRAY_FIELD,
    field,
    value
  });
  
  // Toggle an item in an array (add if not present, remove if present)
  export const toggleArrayItem = (field, item) => ({
    type: ACTION_TYPES.TOGGLE_ARRAY_ITEM,
    field,
    item
  });
  
  // Toggle an object in an array (add if not present, remove if present, based on id)
  export const toggleObjectItem = (field, item) => ({
    type: ACTION_TYPES.TOGGLE_OBJECT_ITEM,
    field,
    item
  });
  
  // Set configuration data
  export const setConfig = (configType, data) => ({
    type: ACTION_TYPES.SET_CONFIG,
    configType,
    data
  });
  
  // Set form errors
  export const setErrors = (errors) => ({
    type: ACTION_TYPES.SET_ERRORS,
    errors
  });
  
  // Clear a specific error
  export const clearError = (field) => ({
    type: ACTION_TYPES.CLEAR_ERROR,
    field
  });
  
  // Set submitting state
  export const setSubmitting = (isSubmitting) => ({
    type: ACTION_TYPES.SET_SUBMITTING,
    isSubmitting
  });
  
  // Set submit success state
  export const setSubmitSuccess = (success) => ({
    type: ACTION_TYPES.SET_SUBMIT_SUCCESS,
    success
  });
  
  // Reset form to initial state
  export const resetForm = () => ({
    type: ACTION_TYPES.RESET_FORM
  });
  
  // Upload and display an image
  export const uploadImage = (file, preview) => ({
    type: ACTION_TYPES.UPLOAD_IMAGE,
    file,
    preview
  });