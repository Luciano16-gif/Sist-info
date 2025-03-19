import { ACTION_TYPES } from './actions';
import subirImagen from '../../../../assets/images/AdminLandingPage/CrearExperiencias/SubirImagen.png'

/**
 * Helper function to generate recurring dates
 * @param {string} initialDateStr - ISO string of initial date
 * @param {number} weeks - Number of weeks to repeat
 * @returns {Array} - Array of ISO date strings
 */
const generateDates = (initialDateStr, weeks) => {
  if (!initialDateStr || weeks <= 0) {
    return [initialDateStr];
  }
  
  const initialDate = new Date(initialDateStr);
  const dates = [initialDateStr];
  
  // Generate weekly recurring dates
  for (let i = 1; i <= weeks; i++) {
    const nextDate = new Date(initialDate);
    nextDate.setDate(initialDate.getDate() + (i * 7));
    dates.push(nextDate.toISOString());
  }
  
  return dates;
};

/**
 * Initial state for the form reducer
 */
export const initialState = {
  // Form field states
  formFields: {
    nombre: '',
    precio: '',
    fechas: [], // Will now contain ISO date strings instead of day names
    fechaInicial: null, // Store the initial date
    repeticionSemanal: 0, // Number of weeks to repeat (0 means no repetition)
    descripcion: '',
    horarioInicio: '',
    horarioFin: '',
    puntoSalida: '',
    longitudRecorrido: '',
    duracionRecorrido: '',
    guiasRequeridos: '',
    minimoUsuarios: '',
    maximoUsuarios: '',
    incluidosExperiencia: [],
    tipoActividad: '',
    imageFile: null,
    imagePreview: subirImagen,
    dificultad: 0,
    guiasSeleccionados: [],
    status: 'pending', // Default to pending, will be changed to 'accepted' for admins
  },
  
  // Configuration states
  configData: {
    tiposActividad: [],
    opcionesIncluidos: [],
    puntosSalida: [],
    guiasDisponibles: [],
  },
  
  // Form handling states
  formHandling: {
    errors: {},
    isSubmitting: false,
    submitSuccess: false,
  }
};

/**
 * Reducer function for form state management
 * @param {Object} state - Current state
 * @param {Object} action - Action to perform
 * @returns {Object} New state
 */
export function formReducer(state, action) {
  switch (action.type) {
    // Handle simple field updates
    case ACTION_TYPES.UPDATE_FIELD:
      return {
        ...state,
        formFields: {
          ...state.formFields,
          [action.field]: action.value
        }
      };
      
    // Handle array field updates (replace entire array)
    case ACTION_TYPES.UPDATE_ARRAY_FIELD:
      return {
        ...state,
        formFields: {
          ...state.formFields,
          [action.field]: action.value
        }
      };
      
    // Handle toggling an item in an array (add/remove)
    case ACTION_TYPES.TOGGLE_ARRAY_ITEM: {
      const currentArray = state.formFields[action.field] || [];
      let newArray;
      
      if (currentArray.includes(action.item)) {
        // Remove item if it exists
        newArray = currentArray.filter(item => item !== action.item);
      } else {
        // Add item if it doesn't exist
        newArray = [...currentArray, action.item];
      }
      
      return {
        ...state,
        formFields: {
          ...state.formFields,
          [action.field]: newArray
        }
      };
    }
    
    // Handle toggling an object in an array (based on id field)
    case ACTION_TYPES.TOGGLE_OBJECT_ITEM: {
      const currentArray = state.formFields[action.field] || [];
      let newArray;
      
      if (currentArray.some(item => item.id === action.item.id)) {
        // Remove item if it exists
        newArray = currentArray.filter(item => item.id !== action.item.id);
      } else {
        // Add item if it doesn't exist
        newArray = [...currentArray, action.item];
      }
      
      return {
        ...state,
        formFields: {
          ...state.formFields,
          [action.field]: newArray
        }
      };
    }
    
    // Add a date to the fechas array
    case ACTION_TYPES.ADD_DATE: {
      // Skip if date already exists
      if (state.formFields.fechas.includes(action.date)) {
        return state;
      }
      
      // Update fechaInicial if this is the initial date
      const newState = {
        ...state,
        formFields: {
          ...state.formFields,
          fechas: [...state.formFields.fechas, action.date]
        }
      };
      
      // If this is the initial date, also update fechaInicial
      if (action.dateType === 'initial') {
        newState.formFields.fechaInicial = action.date;
      }
      
      return newState;
    }
    
    // Remove a date from the fechas array
    case ACTION_TYPES.REMOVE_DATE: {
      const isInitialDate = state.formFields.fechaInicial === action.date;
      const newFechas = state.formFields.fechas.filter(date => date !== action.date);
      
      // Update state with the new dates array
      const newState = {
        ...state,
        formFields: {
          ...state.formFields,
          fechas: newFechas
        }
      };
      
      // If we're removing the initial date, reset fechaInicial and repetition
      if (isInitialDate) {
        newState.formFields.fechaInicial = null;
        newState.formFields.repeticionSemanal = 0;
      }
      
      return newState;
    }
    
    // Set repetition weeks
    case ACTION_TYPES.SET_REPETITION_WEEKS: {
      return {
        ...state,
        formFields: {
          ...state.formFields,
          repeticionSemanal: action.weeks
        }
      };
    }
    
    // Generate recurring dates based on initial date and repetition weeks
    case ACTION_TYPES.GENERATE_RECURRING_DATES: {
      // If no initial date, don't do anything
      if (!action.initialDate) {
        return state;
      }
      
      // First, filter out any previously generated recurring dates but keep custom dates
      // This is a bit complex - we need to know which dates were from previous generations
      // For simplicity, let's just keep the initial date and any dates not generated from the repeat pattern
      
      // Generate new dates based on initial date and repetition weeks
      const generatedDates = generateDates(action.initialDate, action.weeks);
      
      // Filter out any dates that might be already in the array (to avoid duplicates)
      const existingDates = new Set(state.formFields.fechas);
      const newDates = generatedDates.filter(date => !existingDates.has(date));
      
      // Keep custom dates and add newly generated dates
      const customDates = state.formFields.fechas.filter(date => 
        date !== action.initialDate && 
        // Exclude dates that fall on the same weekday and are multiple of 7 days after the initial date
        !generatedDates.includes(date)
      );
      
      return {
        ...state,
        formFields: {
          ...state.formFields,
          fechas: [...generatedDates, ...customDates]
        }
      };
    }
    
    // Set configuration data
    case ACTION_TYPES.SET_CONFIG:
      return {
        ...state,
        configData: {
          ...state.configData,
          [action.configType]: action.data
        }
      };
      
    // Set form errors
    case ACTION_TYPES.SET_ERRORS:
      return {
        ...state,
        formHandling: {
          ...state.formHandling,
          errors: action.errors
        }
      };
      
    // Clear a specific error
    case ACTION_TYPES.CLEAR_ERROR: {
      const newErrors = { ...state.formHandling.errors };
      delete newErrors[action.field];
      
      return {
        ...state,
        formHandling: {
          ...state.formHandling,
          errors: newErrors
        }
      };
    }
    
    // Set submitting state
    case ACTION_TYPES.SET_SUBMITTING:
      return {
        ...state,
        formHandling: {
          ...state.formHandling,
          isSubmitting: action.isSubmitting
        }
      };
      
    // Set submit success state
    case ACTION_TYPES.SET_SUBMIT_SUCCESS:
      return {
        ...state,
        formHandling: {
          ...state.formHandling,
          submitSuccess: action.success
        }
      };
      
    // Reset form to initial state
    case ACTION_TYPES.RESET_FORM:
      return {
        ...state,
        formFields: { ...initialState.formFields },
        formHandling: { ...initialState.formHandling }
      };
      
    // Handle image upload
    case ACTION_TYPES.UPLOAD_IMAGE:
      return {
        ...state,
        formFields: {
          ...state.formFields,
          imageFile: action.file,
          imagePreview: action.preview || state.formFields.imagePreview
        }
      };
      
    default:
      return state;
  }
}