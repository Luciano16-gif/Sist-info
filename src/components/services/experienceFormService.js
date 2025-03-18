import { db } from '../../firebase-config';
import { doc, getDoc, updateDoc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import cloudinaryService from '../../cloudinary-services/cloudinary-service';

/**
 * Service for handling form-related operations for experiences
 */
const experienceFormService = {
  /**
   * Fetch configuration data needed for the experience form
   * @returns {Promise<Object>} Configuration data
   */
  async fetchConfigData() {
    try {
      const config = {
        tiposActividad: [],
        opcionesIncluidos: [],
        puntosSalida: [],
        guiasDisponibles: []
      };
      
      // Fetch activity types
      const tiposDoc = await getDoc(doc(db, "Configuraciones de Experiencias", "Tipo de actividad"));
      if (tiposDoc.exists()) {
        config.tiposActividad = tiposDoc.data().tipos;
      } else {
        await setDoc(doc(db, "Configuraciones de Experiencias", "Tipo de actividad"), { tipos: [] });
      }
      
      // Fetch incluidos options
      const incluidosDoc = await getDoc(doc(db, "Configuraciones de Experiencias", "Incluidos de la Experiencia"));
      if (incluidosDoc.exists()) {
        config.opcionesIncluidos = incluidosDoc.data().incluidos;
      } else {
        await setDoc(doc(db, "Configuraciones de Experiencias", "Incluidos de la Experiencia"), { incluidos: [] });
      }
      
      // Fetch puntos de salida
      const puntosDoc = await getDoc(doc(db, "Configuraciones de Experiencias", "Puntos de Salida"));
      if (puntosDoc.exists()) {
        config.puntosSalida = puntosDoc.data().puntos;
      } else {
        await setDoc(doc(db, "Configuraciones de Experiencias", "Puntos de Salida"), { puntos: [] });
      }
      
      // Fetch available guides
      const guiasQuery = query(collection(db, "lista-de-usuarios"), where("userType", "==", "guia"));
      const guiasSnapshot = await getDocs(guiasQuery);
      const guiasData = [];
      guiasSnapshot.forEach((doc) => {
        guiasData.push({ id: doc.id, ...doc.data() });
      });
      config.guiasDisponibles = guiasData;
      
      return config;
    } catch (error) {
      console.error("Error fetching configuration data:", error);
      throw new Error("Error cargando configuraciones. Por favor, recargue la página.");
    }
  },
  
  /**
   * Add a new activity type
   * @param {string} nuevoTipo - New activity type to add
   * @param {Array} currentTypes - Current activity types
   * @returns {Promise<Array>} Updated activity types
   */
  async addActivityType(nuevoTipo, currentTypes) {
    if (!nuevoTipo.trim()) {
      throw new Error("Por favor, ingrese un tipo de actividad.");
    }
    
    const nuevoTipoLower = nuevoTipo.trim().toLowerCase();
    if (currentTypes.map(tipo => tipo.toLowerCase()).includes(nuevoTipoLower)) {
      throw new Error("Este tipo de actividad ya existe.");
    }
    
    try {
      const docRef = doc(db, "Configuraciones de Experiencias", "Tipo de actividad");
      const updatedTipos = [...currentTypes, nuevoTipo.trim()];
      await updateDoc(docRef, { tipos: updatedTipos });
      return updatedTipos;
    } catch (error) {
      console.error("Error adding activity type:", error);
      throw new Error("Error al agregar el tipo de actividad.");
    }
  },
  
  /**
   * Add a new included item
   * @param {string} nuevoIncluido - New included item to add
   * @param {Array} currentIncluidos - Current included items
   * @returns {Promise<Array>} Updated included items
   */
  async addIncludedItem(nuevoIncluido, currentIncluidos) {
    if (!nuevoIncluido.trim()) {
      throw new Error("Por favor, ingrese un elemento a incluir.");
    }
    
    const nuevoIncluidoLower = nuevoIncluido.trim().toLowerCase();
    if (currentIncluidos.map(inc => inc.toLowerCase()).includes(nuevoIncluidoLower)) {
      throw new Error("Este elemento ya existe en la lista de incluidos.");
    }
    
    try {
      const docRef = doc(db, "Configuraciones de Experiencias", "Incluidos de la Experiencia");
      const updatedIncluidos = [...currentIncluidos, nuevoIncluido.trim()];
      await updateDoc(docRef, { incluidos: updatedIncluidos });
      return updatedIncluidos;
    } catch (error) {
      console.error("Error adding 'Incluido':", error);
      throw new Error("Error al agregar el elemento incluido.");
    }
  },
  
  /**
   * Add a new departure point
   * @param {string} nuevoPunto - New departure point to add
   * @param {Array} currentPuntos - Current departure points
   * @returns {Promise<Array>} Updated departure points
   */
  async addDeparturePoint(nuevoPunto, currentPuntos) {
    if (!nuevoPunto.trim()) {
      throw new Error("Por favor, ingrese un punto de salida.");
    }
    
    const nuevoPuntoLower = nuevoPunto.trim().toLowerCase();
    if (currentPuntos.map(punto => punto.toLowerCase()).includes(nuevoPuntoLower)) {
      throw new Error("Este punto de salida ya existe.");
    }
    
    try {
      const docRef = doc(db, "Configuraciones de Experiencias", "Puntos de Salida");
      const updatedPuntos = [...currentPuntos, nuevoPunto.trim()];
      await updateDoc(docRef, { puntos: updatedPuntos });
      return updatedPuntos;
    } catch (error) {
      console.error("Error adding 'Punto de Salida':", error);
      throw new Error("Error al agregar el punto de salida.");
    }
  },
  
  /**
   * Check if experience name already exists
   * @param {string} nombre - Experience name to check
   * @returns {Promise<boolean>} Whether the name exists
   */
  async checkExperienceNameExists(nombre) {
    try {
      const experienciasRef = collection(db, "Experiencias");
      const q = query(experienciasRef, where("nombre", "==", nombre));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking experience name:", error);
      throw new Error("Error verificando el nombre de la experiencia.");
    }
  },
  
  /**
   * Submit a new experience
   * @param {Object} formData - Experience data to submit
   * @returns {Promise<Object>} Created experience
   */
  async submitExperience(formData) {
    try {
      console.log("submitExperience called with formData:", JSON.stringify(formData, null, 2));
      
      // Enhanced createdBy validation
      let createdBy = formData.createdBy;
      
      // If createdBy is missing, try to recover it
      if (!createdBy) {
        console.warn("Missing createdBy in form submission - attempting recovery");
        
        // Try to get from localStorage as last resort
        try {
          createdBy = localStorage.getItem('tempUserEmail');
          console.log("Recovered createdBy from localStorage:", createdBy);
        } catch (e) {
          console.error("Failed to retrieve from localStorage:", e);
        }
        
        // If still missing, throw an error
        if (!createdBy) {
          throw new Error("No se pudo identificar al creador de la experiencia. Por favor, inténtelo de nuevo.");
        }
      }
      
      // Check for duplicate experience name
      const nameExists = await this.checkExperienceNameExists(formData.nombre);
      if (nameExists) {
        throw new Error("El nombre de la experiencia ya existe, intente con otro");
      }
      
      // Upload image to Cloudinary
      let imageUrl = null;
      let publicId = null;
      
      if (formData.imageFile) {
        try {
          console.log("Iniciando subida de imagen a Cloudinary...");
          const uploadResult = await cloudinaryService.uploadFile(formData.imageFile, `experiences`);
          
          console.log("Resultado de subida:", uploadResult);
          
          if (!uploadResult || !uploadResult.url) {
            throw new Error("Error al subir la imagen: no se recibió una URL");
          }
          
          imageUrl = uploadResult.url;
          publicId = uploadResult.publicId;
        } catch (uploadError) {
          console.error("Error durante la subida de imagen:", uploadError);
          throw new Error(`Error al subir la imagen: ${uploadError.message}`);
        }
      } else {
        throw new Error("Por favor, seleccione una imagen para la experiencia");
      }
      
      // Set default status if not provided
      const status = formData.status || 'pending';
      
      // Prepare data object with guaranteed createdBy
      const experienciaData = {
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        fechas: formData.fechas,
        descripcion: formData.descripcion,
        horarioInicio: formData.horarioInicio,
        horarioFin: formData.horarioFin,
        puntoSalida: formData.puntoSalida,
        longitudRecorrido: parseFloat(formData.longitudRecorrido),
        duracionRecorrido: parseInt(formData.duracionRecorrido),
        guiasRequeridos: parseInt(formData.guiasRequeridos),
        guias: formData.guiasSeleccionados,
        minimoUsuarios: parseInt(formData.minimoUsuarios),
        maximoUsuarios: parseInt(formData.maximoUsuarios),
        incluidosExperiencia: formData.incluidosExperiencia,
        tipoActividad: formData.tipoActividad,
        imageUrl,
        publicId,
        dificultad: formData.dificultad,
        status: status,
        createdBy: createdBy, // Use the validated/recovered email
        fechaCreacion: new Date().toISOString(),
        puntuacion: 0,
        usuariosInscritos: 0,
        cuposDisponibles: parseInt(formData.maximoUsuarios)
      };
      
      console.log("Final experiencia data to be saved:", {
        ...experienciaData,
        imageFile: formData.imageFile ? "Image file present" : "No image file" 
      });
      
      // Save to Firestore
      const docRef = doc(db, "Experiencias", formData.nombre);
      await setDoc(docRef, experienciaData);
      
      return { ...experienciaData, id: formData.nombre };
    } catch (error) {
      console.error("Error creating experience:", error);
      throw error;
    }
  },

  /**
   * Fetch all pending experience requests
   * @returns {Promise<Array>} Array of pending experiences
   */
  async fetchPendingExperiences() {
    try {
      const experienciasRef = collection(db, "Experiencias");
      const q = query(experienciasRef, where("status", "==", "pending"));
      const querySnapshot = await getDocs(q);
      
      const pendingExperiences = [];
      querySnapshot.forEach((doc) => {
        pendingExperiences.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return pendingExperiences;
    } catch (error) {
      console.error("Error fetching pending experiences:", error);
      throw new Error("Error al obtener las solicitudes pendientes.");
    }
  },

  /**
   * Update experience status (approve or reject)
   * @param {string} experienceId - ID of the experience to update
   * @param {string} status - New status ('accepted' or 'rejected')
   * @param {string} feedback - Optional feedback for rejection
   * @returns {Promise<void>}
   */
  async updateExperienceStatus(experienceId, status, feedback = null) {
    try {
      const experienceRef = doc(db, "Experiencias", experienceId);
      const experienceDoc = await getDoc(experienceRef);
      
      if (!experienceDoc.exists()) {
        throw new Error("La experiencia no existe");
      }
      
      const updateData = { status };
      
      // Add feedback for rejections
      if (status === 'rejected' && feedback) {
        updateData.feedback = feedback;
      }
      
      await updateDoc(experienceRef, updateData);
    } catch (error) {
      console.error(`Error updating experience status to ${status}:`, error);
      throw new Error(`Error al ${status === 'accepted' ? 'aprobar' : 'rechazar'} la experiencia.`);
    }
  }
};

export default experienceFormService;