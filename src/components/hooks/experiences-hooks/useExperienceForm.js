import { useReducer, useEffect } from 'react';

// Import reducer components
import { formReducer, initialState } from './experienceForm/reducer';
import { createFieldHandlers, createConfigHandlers, createFormOperations } from './experienceForm/handlers';
import * as actions from './experienceForm/actions';

// Import form services
import experienceFormService from '../../services/experienceFormService';

/**
 * Main hook for managing experience form state and operations
 * This is the public API that other components will use
 * @returns {Object} Form state, handlers, and operations
 */
export const useExperienceForm = () => {
  // Initialize reducer
  const [state, dispatch] = useReducer(formReducer, initialState);
  
  // Destructure state for easier access
  const { formFields, configData, formHandling } = state;
  
  // Load configuration data on mount
  useEffect(() => {
    const loadConfigData = async () => {
      try {
        const config = await experienceFormService.fetchConfigData();
        
        // Update each config type in the state
        Object.entries(config).forEach(([key, value]) => {
          dispatch(actions.setConfig(key, value));
        });
      } catch (error) {
        dispatch(actions.setErrors({ 
          config: error.message || "Error cargando configuraciones. Por favor, recargue la página." 
        }));
      }
    };
    
    loadConfigData();
  }, []);
  
  // Create handlers with current dispatch and state
  const handlers = createFieldHandlers(dispatch);
  const configHandlers = createConfigHandlers(dispatch, configData);
  const formOperations = createFormOperations(dispatch, formFields);
  
  // Expose dispatch function for direct access
  formOperations.dispatch = dispatch;
  
  // Returning the public API with the same structure as the original hook (i did it like this maintain compatibility)
  return {
    // Form state
    formState: formFields,
    
    // Configuration state
    configState: configData,
    
    // Form handling state
    formHandling: {
      errors: formHandling.errors,
      isSubmitting: formHandling.isSubmitting,
      submitSuccess: formHandling.submitSuccess,
      validateForm: formOperations.validateForm,
    },
    
    // Form field handlers
    handlers,
    
    // Configuration handlers
    configHandlers,
    
    // Form operations
    formOperations,
  };
};