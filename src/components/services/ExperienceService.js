import { db } from '../../firebase-config';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

// Import the storageService
import storageService from '../../cloudinary-services/storage-service';

class ExperienceService {
  /**
   * Fetch all experiences with optional filtering
   * @param {Object} options - Filtering options
   * @returns {Promise<Array>} - Array of experiences
   */
  async getExperiences(options = {}) {
    try {
      const { status, limit, sortBy, sortDirection } = options;
      
      let experiencesRef = collection(db, "Experiencias");
      let q = experiencesRef;
      
      // Apply filters if provided
      if (status) {
        q = query(experiencesRef, where("status", "==", status));
      }
      
      const experiencesSnapshot = await getDocs(q);
      const experiencesList = [];

      for (const docSnapshot of experiencesSnapshot.docs) {
        const data = docSnapshot.data();
        
        // Get image URL
        let imageUrl = '';
        try {
          if (data.imageUrl) {
            imageUrl = await storageService.getDownloadURL(data.imageUrl);
          } else {
            imageUrl = '../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png';
          }
        } catch (imageError) {
          console.error("Error getting image URL:", imageError);
          imageUrl = '../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png';
        }

        // Format the experience data
        const experience = {
          id: docSnapshot.id,
          name: data.nombre || 'Sin nombre',
          description: data.descripcion || 'Sin descripción',
          difficulty: data.dificultad || 0,
          price: data.precio || 0,
          distance: `${data.longitudRecorrido || 0} km`,
          duracion: data.duracionRecorrido || 0,
          time: `${data.horarioInicio || '--:--'} - ${data.horarioFin || '--:--'}`,
          days: Array.isArray(data.fechas) ? data.fechas.join(', ') : '',
          maxPeople: data.maximoUsuarios || 0,
          minPeople: data.minimoUsuarios || 0,
          availableSlots: data.cuposDisponibles || 0,
          imageUrl: imageUrl,
          rating: data.puntuacion || 0,
          totalReviews: data.totalReviews || 0,
          registeredUsers: data.usuariosInscritos || 0,
          incluidos: Array.isArray(data.incluidosExperiencia) ? data.incluidosExperiencia : [],
          puntoDeSalida: data.puntoSalida || '',
          rawData: data
        };
        
        experiencesList.push(experience);
      }
      
      return experiencesList;
    } catch (error) {
      console.error("Error fetching experiences:", error);
      throw new Error("No se pudieron cargar las experiencias");
    }
  }

  /**
   * Get a single experience by ID
   * @param {string} id - Experience ID
   * @returns {Promise<Object>} - Experience data
   */
  async getExperienceById(id) {
    try {
      const experienceRef = doc(db, "Experiencias", id);
      const experienceSnap = await getDoc(experienceRef);
      
      if (!experienceSnap.exists()) {
        throw new Error("Experiencia no encontrada");
      }
      
      const data = experienceSnap.data();
      
      // Get image URL
      let imageUrl = '';
      try {
        if (data.imageUrl) {
          imageUrl = await storageService.getDownloadURL(data.imageUrl);
        } else {
          imageUrl = '../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png';
        }
      } catch (imageError) {
        console.error("Error getting image URL:", imageError);
        imageUrl = '../../src/assets/images/landing-page/profile_managemente/profile_picture_1.png';
      }

      // Format the experience data
      return {
        id: experienceSnap.id,
        name: data.nombre || 'Sin nombre',
        description: data.descripcion || 'Sin descripción',
        difficulty: data.dificultad || 0,
        price: data.precio || 0,
        distance: `${data.longitudRecorrido || 0} km`,
        duracion: data.duracionRecorrido || 0,
        time: `${data.horarioInicio || '--:--'} - ${data.horarioFin || '--:--'}`,
        days: Array.isArray(data.fechas) ? data.fechas.join(', ') : '',
        maxPeople: data.maximoUsuarios || 0,
        minPeople: data.minimoUsuarios || 0,
        availableSlots: data.cuposDisponibles || 0,
        imageUrl: imageUrl,
        rating: data.puntuacion || 0,
        registeredUsers: data.usuariosInscritos || 0,
        incluidos: Array.isArray(data.incluidosExperiencia) ? data.incluidosExperiencia : [],
        puntoDeSalida: data.puntoSalida || '',
        rawData: data
      };
    } catch (error) {
      console.error("Error fetching experience:", error);
      throw new Error(error.message || "Error al obtener la experiencia");
    }
  }

  /**
   * Update an existing experience
   * @param {string} id - ID of the experience to update
   * @param {Object} updateData - Updated experience data
   * @returns {Promise<Object>} - Updated experience data
   */
  async updateExperience(id, updateData) {
    try {
      console.log(`Updating experience ${id} with data:`, updateData);
      
      const experienceRef = doc(db, "Experiencias", id);
      const experienceDoc = await getDoc(experienceRef);
      
      if (!experienceDoc.exists()) {
        throw new Error("La experiencia no existe");
      }
      
      // Get current data to merge with updates
      const currentData = experienceDoc.data();
      
      // Handle image upload if there's a new image
      let imageUpdate = {};
      if (updateData.imageFile) {
        try {
          console.log("Uploading new image...");
          
          // Use storageService to upload the image
          const uploadResult = await storageService.uploadFile("experiences", updateData.imageFile);
          
          if (uploadResult && uploadResult.downloadURL) {
            imageUpdate = {
              imageUrl: uploadResult.publicId,
              imageFullUrl: uploadResult.downloadURL
            };
          } else {
            throw new Error("Error uploading image: No download URL received");
          }
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          throw new Error(`Error al subir la imagen: ${uploadError.message}`);
        }
      }
      
      // Prepare update data
      const dataToUpdate = {
        nombre: updateData.nombre,
        precio: parseFloat(updateData.precio) || currentData.precio,
        fechas: updateData.fechas || currentData.fechas, 
        descripcion: updateData.descripcion,
        horarioInicio: updateData.horarioInicio,
        horarioFin: updateData.horarioFin,
        puntoSalida: updateData.puntoSalida,
        longitudRecorrido: parseFloat(updateData.longitudRecorrido) || currentData.longitudRecorrido,
        duracionRecorrido: parseInt(updateData.duracionRecorrido, 10) || currentData.duracionRecorrido,
        guiasRequeridos: parseInt(updateData.guiasRequeridos, 10) || currentData.guiasRequeridos,
        guias: updateData.guias || currentData.guias,
        minimoUsuarios: parseInt(updateData.minimoUsuarios, 10) || currentData.minimoUsuarios,
        maximoUsuarios: parseInt(updateData.maximoUsuarios, 10) || currentData.maximoUsuarios,
        incluidosExperiencia: updateData.incluidosExperiencia || currentData.incluidosExperiencia,
        tipoActividad: updateData.tipoActividad || currentData.tipoActividad,
        dificultad: updateData.dificultad || currentData.dificultad,
        status: updateData.status || currentData.status,
        updatedAt: new Date().toISOString(),
        ...imageUpdate
      };
      
      // Update the document
      await updateDoc(experienceRef, dataToUpdate);
      
      console.log(`Experience ${id} updated successfully`);
      
      return {
        id,
        ...dataToUpdate
      };
    } catch (error) {
      console.error("Error updating experience:", error);
      throw new Error(error.message || "Error al actualizar la experiencia");
    }
  }

  /**
   * Create a new experience
   * @param {Object} experienceData - Experience data to create
   * @returns {Promise<Object>} - Created experience data with ID
   */
  async createExperience(experienceData) {
    try {
      // Add timestamp
      const dataWithTimestamp = {
        ...experienceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Handle image upload
      if (experienceData.imageFile) {
        try {
          // Use storageService instead of cloudinaryService directly
          const uploadResult = await storageService.uploadFile(
            "experiences", 
            experienceData.imageFile
          );
          
          if (uploadResult && uploadResult.downloadURL) {
            dataWithTimestamp.imageUrl = uploadResult.publicId;
            dataWithTimestamp.imageFullUrl = uploadResult.downloadURL;
          } else {
            throw new Error("Error uploading image: No download URL received");
          }
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          throw new Error(`Error al subir la imagen: ${uploadError.message}`);
        }
      }
      
      // Add to Firestore
      const experiencesRef = collection(db, "Experiencias");
      const docRef = await addDoc(experiencesRef, dataWithTimestamp);
      
      // Get the created document ID
      const experienceId = docRef.id;
      
      return {
        id: experienceId,
        ...dataWithTimestamp
      };
    } catch (error) {
      console.error("Error creating experience:", error);
      throw new Error(error.message || "No se pudo crear la experiencia");
    }
  }
}

// Export a singleton instance
export default new ExperienceService();