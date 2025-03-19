/**
 * Action types for Experience Form reducer
 */
export const ACTION_TYPES = {
  // Form field updates
  UPDATE_FIELD: 'UPDATE_FIELD',
  UPDATE_ARRAY_FIELD: 'UPDATE_ARRAY_FIELD',
  TOGGLE_ARRAY_ITEM: 'TOGGLE_ARRAY_ITEM',
  TOGGLE_OBJECT_ITEM: 'TOGGLE_OBJECT_ITEM',
  
  // Date-specific actions
  ADD_DATE: 'ADD_DATE',
  REMOVE_DATE: 'REMOVE_DATE',
  SET_REPETITION_WEEKS: 'SET_REPETITION_WEEKS',
  GENERATE_RECURRING_DATES: 'GENERATE_RECURRING_DATES',
  
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

// Add a specific date to the dates array
export const addDate = (date, type = 'custom') => ({
  type: ACTION_TYPES.ADD_DATE,
  date: date instanceof Date ? date.toISOString() : date,
  dateType: type
});

// Remove a specific date from the dates array
export const removeDate = (date) => ({
  type: ACTION_TYPES.REMOVE_DATE,
  date
});

// Set the number of weeks to repeat the experience
export const setRepetitionWeeks = (weeks) => ({
  type: ACTION_TYPES.SET_REPETITION_WEEKS,
  weeks
});

// Generate recurring dates based on initial date and repetition weeks
export const generateRecurringDates = (initialDate, weeks) => ({
  type: ACTION_TYPES.GENERATE_RECURRING_DATES,
  initialDate: initialDate instanceof Date ? initialDate.toISOString() : initialDate,
  weeks
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