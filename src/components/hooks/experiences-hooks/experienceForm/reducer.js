// src/components/hooks/experiences-hooks/experienceForm/reducer.js
import { ACTION_TYPES } from './actions';
import subirImagen from '../../../../assets/images/AdminLandingPage/CrearExperiencias/SubirImagen.png'

/**
 * Initial state for the form reducer
 */
export const initialState = {
  // Form field states
  formFields: {
    nombre: '',
    precio: '',
    fechas: [],
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