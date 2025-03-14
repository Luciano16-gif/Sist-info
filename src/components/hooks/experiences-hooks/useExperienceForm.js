import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase-config';
import { doc, getDoc, updateDoc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { validateExperienceForm } from '../utils/experienceValidation';
import storageService from '../cloudinary-services/storage-service';

/**
 * Custom hook for managing experience form state and operations
 * @returns {Object} Form state, handlers, and operations
 */
export const useExperienceForm = () => {
  // Form field states
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [fechas, setFechas] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [horarioInicio, setHorarioInicio] = useState('');
  const [horarioFin, setHorarioFin] = useState('');
  const [puntoSalida, setPuntoSalida] = useState('');
  const [longitudRecorrido, setLongitudRecorrido] = useState('');
  const [duracionRecorrido, setDuracionRecorrido] = useState('');
  const [guiasRequeridos, setGuiasRequeridos] = useState('');
  const [minimoUsuarios, setMinimoUsuarios] = useState('');
  const [maximoUsuarios, setMaximoUsuarios] = useState('');
  const [incluidosExperiencia, setIncluidosExperiencia] = useState([]);
  const [tipoActividad, setTipoActividad] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('../../src/assets/images/AdminLandingPage/CrearExperiencias/SubirImagen.png');
  const [dificultad, setDificultad] = useState(0);
  const [guiasSeleccionados, setGuiasSeleccionados] = useState([]);

  // Configuration states
  const [tiposActividad, setTiposActividad] = useState([]);
  const [opcionesIncluidos, setOpcionesIncluidos] = useState([]);
  const [puntosSalida, setPuntosSalida] = useState([]);
  const [guiasDisponibles, setGuiasDisponibles] = useState([]);
  
  // Form handling states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch configuration data from Firestore
  useEffect(() => {
    const fetchConfigData = async () => {
      try {
        // Fetch activity types
        const tiposDoc = await getDoc(doc(db, "Configuraciones de Experiencias", "Tipo de actividad"));
        if (tiposDoc.exists()) {
          setTiposActividad(tiposDoc.data().tipos);
        } else {
          await setDoc(doc(db, "Configuraciones de Experiencias", "Tipo de actividad"), { tipos: [] });
          setTiposActividad([]);
        }
        
        // Fetch incluidos options
        const incluidosDoc = await getDoc(doc(db, "Configuraciones de Experiencias", "Incluidos de la Experiencia"));
        if (incluidosDoc.exists()) {
          setOpcionesIncluidos(incluidosDoc.data().incluidos);
        } else {
          await setDoc(doc(db, "Configuraciones de Experiencias", "Incluidos de la Experiencia"), { incluidos: [] });
          setOpcionesIncluidos([]);
        }
        
        // Fetch puntos de salida
        const puntosDoc = await getDoc(doc(db, "Configuraciones de Experiencias", "Puntos de Salida"));
        if (puntosDoc.exists()) {
          setPuntosSalida(puntosDoc.data().puntos);
        } else {
          await setDoc(doc(db, "Configuraciones de Experiencias", "Puntos de Salida"), { puntos: [] });
          setPuntosSalida([]);
        }
        
        // Fetch available guides
        const guiasQuery = query(collection(db, "lista-de-usuarios"), where("userType", "==", "Guia"));
        const guiasSnapshot = await getDocs(guiasQuery);
        const guiasData = [];
        guiasSnapshot.forEach((doc) => {
          guiasData.push({ id: doc.id, ...doc.data() });
        });
        setGuiasDisponibles(guiasData);
      } catch (error) {
        console.error("Error fetching configuration data:", error);
        setErrors(prev => ({ ...prev, config: "Error cargando configuraciones. Por favor, recargue la página." }));
      }
    };
    
    fetchConfigData();
  }, []);

  // Form field change handlers
  const handleNombreChange = (e) => setNombre(e.target.value);
  
  const handlePrecioChange = (e) => {
    const value = e.target.value;
    if (/^(\d+)?\.?\d*$/.test(value)) {
      setPrecio(value);
    }
  };
  
  const handleDescripcionChange = (e) => setDescripcion(e.target.value);
  
  const handleTimeChange = (setter) => (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9:]/g, '');
    value = value.slice(0, 5);
    if (value.length >= 2 && value.indexOf(':') === -1) {
      value = value.slice(0, 2) + ':' + value.slice(2);
    }
    setter(value);
  };
  
  const handlePuntoSalidaChange = (e) => setPuntoSalida(e.target.value);
  
  const handleLongitudChange = (e) => {
    const value = e.target.value;
    if (/^(\d+)?\.?\d*$/.test(value)) {
      setLongitudRecorrido(value);
    }
  };
  
  const handleDuracionChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setDuracionRecorrido(value);
    }
  };
  
  const handleIntegerInputChange = (setter) => (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setter(value);
    }
  };
  
  const handleTipoActividadChange = (e) => setTipoActividad(e.target.value);
  
  const handleIncluidosChange = (option) => {
    if (incluidosExperiencia.includes(option)) {
      setIncluidosExperiencia(incluidosExperiencia.filter((item) => item !== option));
    } else {
      setIncluidosExperiencia([...incluidosExperiencia, option]);
    }
  };
  
  const handleDateChange = (date) => {
    if (fechas.includes(date)) {
      setFechas(fechas.filter(d => d !== date));
    } else {
      setFechas([...fechas, date]);
    }
  };
  
  const handleDificultadClick = (level) => {
    if (dificultad === level && dificultad === 1) {
      setDificultad(0);
    } else {
      setDificultad(level);
    }
  };
  
  const handleImageChange = (file) => {
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview('../../src/assets/images/AdminLandingPage/CrearExperiencias/SubirImagen.png');
    }
  };
  
  const handleSeleccionarGuia = (guia) => {
    if (guiasSeleccionados.some((g) => g.id === guia.id)) {
      setGuiasSeleccionados(guiasSeleccionados.filter((g) => g.id !== guia.id));
    } else {
      setGuiasSeleccionados([...guiasSeleccionados, guia]);
    }
  };

  // Configuration update handlers
  const handleAgregarNuevoTipo = async (nuevoTipo) => {
    if (!nuevoTipo.trim()) {
      setErrors(prev => ({ ...prev, nuevoTipo: "Por favor, ingrese un tipo de actividad." }));
      return false;
    }
    
    const nuevoTipoLower = nuevoTipo.trim().toLowerCase();
    if (tiposActividad.map(tipo => tipo.toLowerCase()).includes(nuevoTipoLower)) {
      setErrors(prev => ({ ...prev, nuevoTipo: "Este tipo de actividad ya existe." }));
      return false;
    }
    
    try {
      const docRef = doc(db, "Configuraciones de Experiencias", "Tipo de actividad");
      const updatedTipos = [...tiposActividad, nuevoTipo.trim()];
      await updateDoc(docRef, { tipos: updatedTipos });
      setTiposActividad(updatedTipos);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.nuevoTipo;
        return newErrors;
      });
      return true;
    } catch (error) {
      console.error("Error adding activity type:", error);
      setErrors(prev => ({ ...prev, nuevoTipo: "Error al agregar el tipo de actividad." }));
      return false;
    }
  };
  
  const handleAgregarNuevoIncluido = async (nuevoIncluido) => {
    if (!nuevoIncluido.trim()) {
      setErrors(prev => ({ ...prev, nuevoIncluido: "Por favor, ingrese un elemento a incluir." }));
      return false;
    }
    
    const nuevoIncluidoLower = nuevoIncluido.trim().toLowerCase();
    if (opcionesIncluidos.map(inc => inc.toLowerCase()).includes(nuevoIncluidoLower)) {
      setErrors(prev => ({ ...prev, nuevoIncluido: "Este elemento ya existe en la lista de incluidos." }));
      return false;
    }
    
    try {
      const docRef = doc(db, "Configuraciones de Experiencias", "Incluidos de la Experiencia");
      const updatedIncluidos = [...opcionesIncluidos, nuevoIncluido.trim()];
      await updateDoc(docRef, { incluidos: updatedIncluidos });
      setOpcionesIncluidos(updatedIncluidos);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.nuevoIncluido;
        return newErrors;
      });
      return true;
    } catch (error) {
      console.error("Error adding 'Incluido':", error);
      setErrors(prev => ({ ...prev, nuevoIncluido: "Error al agregar el elemento incluido." }));
      return false;
    }
  };
  
  const handleAgregarNuevoPuntoSalida = async (nuevoPunto) => {
    if (!nuevoPunto.trim()) {
      setErrors(prev => ({ ...prev, nuevoPunto: "Por favor, ingrese un punto de salida." }));
      return false;
    }
    
    const nuevoPuntoLower = nuevoPunto.trim().toLowerCase();
    if (puntosSalida.map(punto => punto.toLowerCase()).includes(nuevoPuntoLower)) {
      setErrors(prev => ({ ...prev, nuevoPunto: "Este punto de salida ya existe." }));
      return false;
    }
    
    try {
      const docRef = doc(db, "Configuraciones de Experiencias", "Puntos de Salida");
      const updatedPuntos = [...puntosSalida, nuevoPunto.trim()];
      await updateDoc(docRef, { puntos: updatedPuntos });
      setPuntosSalida(updatedPuntos);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.nuevoPunto;
        return newErrors;
      });
      return true;
    } catch (error) {
      console.error("Error adding 'Punto de Salida':", error);
      setErrors(prev => ({ ...prev, nuevoPunto: "Error al agregar el punto de salida." }));
      return false;
    }
  };

  // Form validation and submission
  const validateForm = useCallback(() => {
    const formData = {
      nombre,
      precio,
      fechas,
      descripcion,
      horarioInicio,
      horarioFin,
      puntoSalida,
      longitudRecorrido,
      duracionRecorrido,
      guiasRequeridos,
      guiasSeleccionados,
      minimoUsuarios,
      maximoUsuarios,
      incluidosExperiencia,
      tipoActividad,
      imageFile,
      dificultad
    };
    
    const validationResult = validateExperienceForm(formData);
    setErrors(validationResult.errors);
    return validationResult;
  }, [
    nombre, precio, fechas, descripcion, horarioInicio, horarioFin,
    puntoSalida, longitudRecorrido, duracionRecorrido, guiasRequeridos,
    guiasSeleccionados, minimoUsuarios, maximoUsuarios, incluidosExperiencia,
    tipoActividad, imageFile, dificultad
  ]);

  const handleSubmit = async () => {
    setSubmitSuccess(false);
    setIsSubmitting(true);
    
    try {
      // Validate form
      const { isValid, errors } = validateForm();
      if (!isValid) {
        setIsSubmitting(false);
        return false;
      }
      
      // Check for duplicate experience name
      const experienciasRef = collection(db, "Experiencias");
      const q = query(experienciasRef, where("nombre", "==", nombre));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setErrors({ nombre: "El nombre de la experiencia ya existe, intente con otro" });
        setIsSubmitting(false);
        return false;
      }
      
      // Upload image to Cloudinary
      let imageUrl = null;
      let publicId = null;
      
      if (imageFile) {
        const uploadResult = await storageService.uploadFile(`experiences`, imageFile);
        
        if (uploadResult.error) {
          throw new Error(uploadResult.message || "Error al subir la imagen");
        }
        
        imageUrl = uploadResult.downloadURL;
        publicId = uploadResult.publicId;
      }
      
      // Prepare data object
      const experienciaData = {
        nombre,
        precio: parseFloat(precio),
        fechas,
        descripcion,
        horarioInicio,
        horarioFin,
        puntoSalida,
        longitudRecorrido: parseFloat(longitudRecorrido),
        duracionRecorrido: parseInt(duracionRecorrido),
        guiasRequeridos: parseInt(guiasRequeridos),
        guias: guiasSeleccionados,
        minimoUsuarios: parseInt(minimoUsuarios),
        maximoUsuarios: parseInt(maximoUsuarios),
        incluidosExperiencia,
        tipoActividad,
        imageUrl,
        publicId,
        dificultad,
        // Add creation timestamp and initial values
        fechaCreacion: new Date().toISOString(),
        puntuacion: 0,
        usuariosInscritos: 0,
        cuposDisponibles: parseInt(maximoUsuarios)
      };
      
      // Save to Firestore
      const docRef = doc(db, "Experiencias", nombre);
      await setDoc(docRef, experienciaData);
      
      // Reset form
      resetForm();
      setSubmitSuccess(true);
      return true;
    } catch (error) {
      console.error("Error creating experience:", error);
      setErrors({ submit: error.message || "Error al crear la experiencia. Por favor, inténtelo de nuevo." });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setNombre('');
    setPrecio('');
    setFechas([]);
    setDescripcion('');
    setHorarioInicio('');
    setHorarioFin('');
    setPuntoSalida('');
    setLongitudRecorrido('');
    setDuracionRecorrido('');
    setGuiasRequeridos('');
    setMinimoUsuarios('');
    setMaximoUsuarios('');
    setIncluidosExperiencia([]);
    setTipoActividad('');
    setImageFile(null);
    setImagePreview('../../src/assets/images/AdminLandingPage/CrearExperiencias/SubirImagen.png');
    setDificultad(0);
    setGuiasSeleccionados([]);
    setErrors({});
  };

  return {
    // Form state
    formState: {
      nombre,
      precio,
      fechas,
      descripcion,
      horarioInicio,
      horarioFin,
      puntoSalida,
      longitudRecorrido,
      duracionRecorrido,
      guiasRequeridos,
      minimoUsuarios,
      maximoUsuarios,
      incluidosExperiencia,
      tipoActividad,
      imageFile,
      imagePreview,
      dificultad,
      guiasSeleccionados,
    },
    
    // Configuration state
    configState: {
      tiposActividad,
      opcionesIncluidos,
      puntosSalida,
      guiasDisponibles,
    },
    
    // Form handling state
    formHandling: {
      errors,
      isSubmitting,
      submitSuccess,
      validateForm,
    },
    
    // Form field handlers
    handlers: {
      handleNombreChange,
      handlePrecioChange,
      handleDescripcionChange,
      handleTimeChange,
      handlePuntoSalidaChange,
      handleLongitudChange,
      handleDuracionChange,
      handleIntegerInputChange,
      handleTipoActividadChange,
      handleIncluidosChange,
      handleDateChange,
      handleDificultadClick,
      handleImageChange,
      handleSeleccionarGuia,
    },
    
    // Configuration handlers
    configHandlers: {
      handleAgregarNuevoTipo,
      handleAgregarNuevoIncluido,
      handleAgregarNuevoPuntoSalida,
    },
    
    // Form operations
    formOperations: {
      handleSubmit,
      resetForm,
      setHorarioInicio,
      setHorarioFin,
    },
  };
};