// CrearExperiencia.jsx (ACTUALIZADO - Aprobación de Guía y Admin)

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CrearExperiencia.css';
import { db } from '../../../firebase-config';
import { collection, addDoc, doc, setDoc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import storageService from '../../../cloudinary-services/storage-service';
import { useAuth } from '../../../components/contexts/AuthContext'; // Importa el contexto de autenticación

function CrearExperiencia() {
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Obtiene el usuario actual desde el contexto de autenticación
    const [hasPermission, setHasPermission] = useState(false);
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
    const fileInputRef = useRef(null);
    const [dificultad, setDificultad] = useState(0);
    const [tiposActividad, setTiposActividad] = useState([]);
    const [nuevoTipoActividad, setNuevoTipoActividad] = useState("");
    const [opcionesIncluidos, setOpcionesIncluidos] = useState([]);
    const [nuevoIncluido, setNuevoIncluido] = useState("");
    const [puntosSalida, setPuntosSalida] = useState([]);
    const [nuevoPuntoSalida, setNuevoPuntoSalida] = useState("");
    const [guiasSeleccionados, setGuiasSeleccionados] = useState([]);
    const [guiasDisponibles, setGuiasDisponibles] = useState([]);

    useEffect(() => {
        const checkPermission = async () => {
            if (currentUser) {
                try {
                    const userDocRef = doc(db, "lista-de-usuarios", currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        // Verifica si el usuario es "Admin" o "Guia"
                        setHasPermission(userData.userType === 'Admin' || userData.userType === 'Guia');
                    } else {
                        setHasPermission(false);
                    }
                } catch (error) {
                    console.error("Error checking user permissions:", error);
                    setHasPermission(false);
                }
            } else {
                setHasPermission(false);
            }
        };

        checkPermission();
    }, [currentUser]);

    // --- Firestore Interaction for Activity Types ---
    useEffect(() => {
        const fetchTiposActividad = async () => {
            try {
                const docRef = doc(db, "Configuraciones de Experiencias", "Tipo de actividad");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setTiposActividad(docSnap.data().tipos);
                } else {
                    console.log("No such document!");
                    await setDoc(docRef, { tipos: [] });
                    setTiposActividad([]);
                }
            } catch (error) {
                console.error("Error fetching activity types:", error);
            }
        };

        fetchTiposActividad();
    }, []);

    const handleAgregarNuevoTipo = async () => {
        const nuevoTipo = nuevoTipoActividad.trim();
        if (!nuevoTipo) {
            alert("Por favor, ingrese un tipo de actividad.");
            return;
        }
        const nuevoTipoLower = nuevoTipo.toLowerCase();
        if (tiposActividad.map(tipo => tipo.toLowerCase()).includes(nuevoTipoLower)) {
            alert("Este tipo de actividad ya existe.");
            return;
        }
        try {
            const docRef = doc(db, "Configuraciones de Experiencias", "Tipo de actividad");
            const updatedTipos = [...tiposActividad, nuevoTipo];
            await updateDoc(docRef, { tipos: updatedTipos });
            setTiposActividad(updatedTipos);
            setNuevoTipoActividad("");
        } catch (error) {
            console.error("Error adding activity type:", error);
            alert("Error al agregar el tipo de actividad. Inténtelo de nuevo.");
        }
    };

    // --- Firestore Interaction for "Incluidos" Options ---
    useEffect(() => {
        const fetchIncluidos = async () => {
            try {
                const docRef = doc(db, "Configuraciones de Experiencias", "Incluidos de la Experiencia");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setOpcionesIncluidos(docSnap.data().incluidos);
                } else {
                    console.log("No 'Incluidos' document!");
                    await setDoc(docRef, { incluidos: [] });
                    setOpcionesIncluidos([]);
                }
            } catch (error) {
                console.error("Error fetching 'Incluidos':", error);
            }
        };

        fetchIncluidos();
    }, []);

    const handleAgregarNuevoIncluido = async () => {
        const nuevoIncluidoTrim = nuevoIncluido.trim();
        if (!nuevoIncluidoTrim) {
            alert("Por favor, ingrese un elemento a incluir.");
            return;
        }
        const nuevoIncluidoLower = nuevoIncluidoTrim.toLowerCase();
        if (opcionesIncluidos.map(inc => inc.toLowerCase()).includes(nuevoIncluidoLower)) {
            alert("Este elemento ya existe en la lista de incluidos.");
            return;
        }

        try {
            const docRef = doc(db, "Configuraciones de Experiencias", "Incluidos de la Experiencia");
            const updatedIncluidos = [...opcionesIncluidos, nuevoIncluidoTrim];
            await updateDoc(docRef, { incluidos: updatedIncluidos });
            setOpcionesIncluidos(updatedIncluidos);
            setNuevoIncluido("");
        } catch (error) {
            console.error("Error adding 'Incluido':", error);
            alert("Error al agregar el elemento. Inténtelo de nuevo.");
        }
    };

    // --- Firestore Interaction for "Puntos de Salida" ---
    useEffect(() => {
        const fetchPuntosSalida = async () => {
            try {
                const docRef = doc(db, "Configuraciones de Experiencias", "Puntos de Salida");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPuntosSalida(docSnap.data().puntos);
                } else {
                    console.log("No 'Puntos de Salida' document!");
                    await setDoc(docRef, { puntos: [] });
                    setPuntosSalida([]);
                }
            } catch (error) {
                console.error("Error fetching 'Puntos de Salida':", error);
            }
        };

        fetchPuntosSalida();
    }, []);

    const handleAgregarNuevoPuntoSalida = async () => {
        const nuevoPuntoTrim = nuevoPuntoSalida.trim();
        if (!nuevoPuntoTrim) {
            alert("Por favor, ingrese un punto de salida.");
            return;
        }
        const nuevoPuntoLower = nuevoPuntoTrim.toLowerCase();

        if (puntosSalida.map(punto => punto.toLowerCase()).includes(nuevoPuntoLower)) {
            alert("Este punto de salida ya existe.");
            return;
        }

        try {
            const docRef = doc(db, "Configuraciones de Experiencias", "Puntos de Salida");
            const updatedPuntos = [...puntosSalida, nuevoPuntoTrim];
            await updateDoc(docRef, { puntos: updatedPuntos });
            setPuntosSalida(updatedPuntos);
            setNuevoPuntoSalida("");
        } catch (error) {
            console.error("Error adding 'Punto de Salida':", error);
            alert("Error al agregar el punto de salida. Inténtelo de nuevo.");
        }
    };

    const handleAgregar = async () => {
        if (!hasPermission) {
            alert("No tienes permisos para crear experiencias.");
            return;
        }

        // 1. Data Validation
        if (!nombre || !precio || fechas.length === 0 || !descripcion || !horarioInicio || !horarioFin || !puntoSalida ||
            !longitudRecorrido || !duracionRecorrido || !guiasRequeridos ||
            !minimoUsuarios || !maximoUsuarios || incluidosExperiencia.length === 0 || !tipoActividad || !dificultad) { //incluidosExperiencia should be > 0
            alert('Por favor, complete todos los campos.');
            return;
        }

        // Time Validation
        if (!/^\d{2}:\d{2}$/.test(horarioInicio) || !/^\d{2}:\d{2}$/.test(horarioFin)) {
            alert('Por favor, ingrese horarios válidos en formato HH:MM.');
            return;
        }

        const [startHours, startMinutes] = horarioInicio.split(':').map(Number);
        const [endHours, endMinutes] = horarioFin.split(':').map(Number);

        if (startHours < 0 || startHours > 23 || startMinutes < 0 || startMinutes > 59 ||
            endHours < 0 || endHours > 23 || endMinutes < 0 || endMinutes > 59) {
            alert("Por favor, ingrese horas y minutos válidos (horas 0-23, minutos 0-59).");
            return;
        }

        if (startHours > endHours || (startHours === endHours && startMinutes >= endMinutes)) {
            alert('La hora de finalización debe ser posterior a la hora de inicio.');
            return;
        }

        const minUsers = parseInt(minimoUsuarios);
        const maxUsers = parseInt(maximoUsuarios);

        if (isNaN(minUsers) || minUsers <= 0) {
            alert('Por favor, ingrese un número válido y mayor que 0 para el mínimo de usuarios.');
            return;
        }
        if (isNaN(maxUsers) || maxUsers <= 0) {
            alert('Por favor, ingrese un número válido y mayor que 0 para el máximo de usuarios.');
            return;
        }

        if (minUsers > maxUsers) {
            alert('El mínimo de usuarios no puede ser mayor que el máximo de usuarios.');
            return;
        }

        if (!/^\d+(\.\d{0,2})?$/.test(precio)) {
            alert('Por favor ingrese un número válido para el precio.');
            return;
        }
        const precioNumerico = parseFloat(precio);
        if (precioNumerico <= 0) {
            alert("El precio debe ser mayor que cero.");
            return;
        }

        if (!/^\d+$/.test(duracionRecorrido)) {
            alert("Por favor, ingrese un número entero válido para la duración del recorrido (en minutos).");
            return;
        }
        const duracionNumerica = parseInt(duracionRecorrido);
        if (duracionNumerica <= 0) {
            alert("La duración debe ser mayor que cero.");
            return;
        }

        if (!/^\d+(\.\d*)?$/.test(longitudRecorrido)) {
            alert("Por favor, ingrese un número válido para la longitud del recorrido (en km).");
            return;
        }
        const longitudNumerica = parseFloat(longitudRecorrido);
        if (longitudNumerica <= 0) {
            alert("La longitud debe ser mayor que cero");
            return;
        }

        if (parseInt(guiasRequeridos) < 0 || isNaN(parseInt(guiasRequeridos))) {
            alert('Por favor ingrese un número valido y no negativo para los guias requeridos.');
            return;
        }

        //Validar que se hayan escogido guías o que el número de guías escogidos sea igual al número de guías requerido
        if (guiasSeleccionados.length !== parseInt(guiasRequeridos)) {
            alert('La cantidad de guías seleccionados debe ser igual a la cantidad de guías requeridos.');
            return;
        }

        try {
            // 2. Subir la imagen a Cloudinary usando storageService
            let imageUrl = null;
            let publicId = null; //  Guardaremos también el publicId
            if (imageFile) {
                const uploadResult = await storageService.uploadFile(`experiences`, imageFile); // Usa storageService
                imageUrl = uploadResult.downloadURL;
                publicId = uploadResult.publicId; //  Guarda el publicId
            }

            // 3. Create the data object
            const experienciaData = {
                nombre,
                precio: precioNumerico,
                fechas,
                descripcion,
                horarioInicio,
                horarioFin,
                puntoSalida,
                longitudRecorrido: longitudNumerica,
                duracionRecorrido: duracionNumerica,
                guiasRequeridos: parseInt(guiasRequeridos),
                guias: guiasSeleccionados, //  Añadir guías seleccionados
                minimoUsuarios: minUsers,
                maximoUsuarios: maxUsers,
                incluidosExperiencia,  // Already an array
                tipoActividad,
                imageUrl, // URL de Cloudinary
                publicId,  //  Guarda el publicId en Firestore
                dificultad,
                status: 'pending', // Estado inicial para las experiencias creadas por guías
                createdBy: currentUser.uid, // ID del usuario que crea la experiencia
            };

            // Determinar si el usuario es Admin o Guía
            const userDocRef = doc(db, "lista-de-usuarios", currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            const userData = userDocSnap.data();

            if (userData.userType === 'Admin') {
                // Si es Admin, crear la experiencia directamente
                const docRef = doc(db, "Experiencias", nombre); // Usar nombre como ID
                await setDoc(docRef, experienciaData);
                alert('Experiencia creada con éxito');
            } else if (userData.userType === 'Guia') {
                // Si es Guía, guardar en una colección "Propuestas de Experiencias" para aprobación
                await addDoc(collection(db, "Propuestas de Experiencias"), experienciaData);
                alert('La solicitud ha sido enviada');
            }

            // 5. Clear the form
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
            setIncluidosExperiencia([]); // Clear the array
            setTipoActividad('');
            setImageFile(null);
            setImagePreview('../../src/assets/images/AdminLandingPage/CrearExperiencias/SubirImagen.png');
            setDificultad(0);
            setGuiasSeleccionados([]); // Limpiar guías seleccionados

        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error al crear la experiencia.  Por favor, inténtelo de nuevo.");
        }
    };

    // --- Handler Functions ---

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
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

    const handlePrecioChange = (e) => {
        setPrecio(e.target.value);
    };
    const handleDuracionChange = (e) => {
        setDuracionRecorrido(e.target.value);
    };

    const handleLongitudChange = (e) => {
        setLongitudRecorrido(e.target.value);
    };

    const handleIntegerInputChange = (setter) => (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setter(value);
        }
    };

    const handleDateChange = (date) => {
        if (fechas.includes(date)) {
            setFechas(fechas.filter(d => d !== date));
        } else {
            setFechas([...fechas, date]);
        }
    };

    const renderDateButtons = () => {
        const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        return days.map((day) => (
            <button
                key={day}
                type="button"
                className={`date-button ${fechas.includes(day) ? 'selected' : ''}`}
                onClick={() => handleDateChange(day)}
            >
                {day}
            </button>
        ));
    };

    const handleTimeChange = (setter) => (e) => {
        let value = e.target.value;
        value = value.replace(/[^0-9:]/g, '');
        value = value.slice(0, 5);
        if (value.length >= 2 && value.indexOf(':') === -1) {
            value = value.slice(0, 2) + ':' + value.slice(2);
        }
        setter(value);
    };

    const handleDificultadClick = (level) => {
        if (dificultad === level && dificultad === 1) {
            setDificultad(0);
        }
        else {
            setDificultad(level);
        }
    };

    const renderDifficultyCircles = () => {
        const circles = [];
        for (let i = 1; i <= 5; i++) {
            circles.push(
                <div
                    key={i}
                    className={`difficulty-circle ${i <= dificultad ? 'selected' : ''}`}
                    onClick={() => handleDificultadClick(i)}
                ></div>
            );
        }
        return circles;
    };


    // --- Incluidos Handling (Multiple Selection) ---

    const handleIncluidosChange = (option) => {
        if (incluidosExperiencia.includes(option)) {
            setIncluidosExperiencia(incluidosExperiencia.filter((item) => item !== option));
        } else {
            setIncluidosExperiencia([...incluidosExperiencia, option]);
        }
    };


    // --- NUEVO: Obtener y manejar guías ---

    useEffect(() => {
        const fetchGuias = async () => {
            try {
                const guiasQuery = query(collection(db, "lista-de-usuarios"), where("userType", "==", "Guia"));
                const querySnapshot = await getDocs(guiasQuery);
                const guiasData = [];
                querySnapshot.forEach((doc) => {
                    //  Podrías querer más datos del guía, como el nombre, etc.
                    guiasData.push({ id: doc.id, ...doc.data() });
                });
                setGuiasDisponibles(guiasData);
            } catch (error) {
                console.error("Error fetching guias:", error);
            }
        };

        fetchGuias();
    }, []);


    const handleSeleccionarGuia = (guia) => {
        if (guiasSeleccionados.some((g) => g.id === guia.id)) {
            setGuiasSeleccionados(guiasSeleccionados.filter((g) => g.id !== guia.id));
        } else {
            setGuiasSeleccionados([...guiasSeleccionados, guia]);
        }
    };

    if (!hasPermission) {
        return (
            <div className="crear-experiencia-container-crear-experiencia">
                <h1 className="titulo-crear-experiencia">Acceso Denegado</h1>
                <p className="subtitulo-crear-experiencia">No tienes permisos para crear experiencias.</p>
            </div>
        );
    }

    return (
        <div className="crear-experiencia-container-crear-experiencia">
            <h1 className="titulo-crear-experiencia">Agregar una nueva Experiencia</h1>
            <p className="subtitulo-crear-experiencia">Expande nuestra lista de servicios y experiencias únicas...</p>

            <div className="form-container-crear-experiencia">
                <div className="imagen-experiencia-container-crear-experiencia">
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                    <div className="imagen-placeholder-crear-experiencia" onClick={handleImageClick} role="button" aria-label="Upload image">
                        <img src={imagePreview} alt="Upload Placeholder" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>

                <div className="campos-container-crear-experiencia">
                    <div className="campo-crear-experiencia">
                        <label htmlFor="nombre">Nombre de la Experiencia</label>
                        <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </div>

                    <div className="campo-row-crear-experiencia">
                        <div className="campo-crear-experiencia campo-crear-experiencia-precio">
                            <label htmlFor="precio">Precio</label>
                            <input type="text" id="precio" value={precio} onChange={handlePrecioChange} />
                        </div>
                        <div className="campo-crear-experiencia campo-crear-experiencia-dificultad">
                            <label>Dificultad</label>
                            <div className="difficulty-container">
                                {renderDifficultyCircles()}
                            </div>
                        </div>
                    </div>
                    <div className="campo-crear-experiencia">
                        <label htmlFor="fecha">Fecha</label>
                        <div className="date-buttons-container">
                            {renderDateButtons()}
                        </div>
                    </div>

                    <div className="campo-crear-experiencia">
                        <label htmlFor="descripcion">Descripción</label>
                        <input type="text" id="descripcion" className="descripcion-input-crear-experiencia" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                    </div>
                    <div className='campo-row-crear-experiencia'>
                        <div className="campo-crear-experiencia">
                            <label htmlFor="horarioInicio">Horario Inicio</label>
                            <input
                                type="text"
                                id="horarioInicio"
                                value={horarioInicio}
                                onChange={handleTimeChange(setHorarioInicio)}
                                maxLength="5"
                            />
                        </div>

                        <div className="campo-crear-experiencia">
                            <label htmlFor="horarioFin">Horario Fin</label>
                            <input
                                type="text"
                                id="horarioFin"
                                value={horarioFin}
                                onChange={handleTimeChange(setHorarioFin)}
                                maxLength="5"
                            />
                        </div>
                    </div>

                    <div className="campo-row-crear-experiencia">
                        <div className="campo-crear-experiencia">
                            <label htmlFor="puntoSalida">Punto de Salida</label>
                            <select
                                id="puntoSalida"
                                value={puntoSalida}
                                onChange={(e) => setPuntoSalida(e.target.value)}
                            >
                                <option value="">Seleccione...</option>
                                {puntosSalida.map((punto) => (
                                    <option key={punto} value={punto}>
                                        {punto}
                                    </option>
                                ))}
                            </select>
                            <div className="add-activity-container">
                                <input
                                    type="text"
                                    placeholder="Nuevo punto..."
                                    value={nuevoPuntoSalida}
                                    onChange={(e) => setNuevoPuntoSalida(e.target.value)}
                                    className="nuevo-tipo-input"
                                />
                                <button type="button" onClick={handleAgregarNuevoPuntoSalida} className="add-activity-button">
                                    Agregar
                                </button>
                            </div>
                        </div>
                        <div className="campo-crear-experiencia">
                            <label htmlFor="guiasRequeridos">Guías Requeridos</label>
                            <input type="text" id="guiasRequeridos" value={guiasRequeridos} onChange={handleIntegerInputChange(setGuiasRequeridos)} />
                        </div>
                    </div>
                    {/* Sección de Selección de Guías */}
                    <div className="campo-crear-experiencia">
                        <label>Seleccionar Guías:</label>
                        <div className="guias-seleccion-container">
                            {guiasDisponibles.map((guia) => (
                                <div key={guia.id} className="guia-item">
                                    <input
                                        type="checkbox"
                                        id={`guia-${guia.id}`}
                                        checked={guiasSeleccionados.some((g) => g.id === guia.id)}
                                        onChange={() => handleSeleccionarGuia(guia)}
                                    />
                                    <label htmlFor={`guia-${guia.id}`}>
                                        {/* Aquí, muestra el nombre del guía si lo tienes, o el ID */}
                                        {guia.name || guia.email || guia.id}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='campo-row-crear-experiencia'>
                        <div className="campo-crear-experiencia">
                            <label htmlFor="minimoUsuarios">Mínimo de Usuarios</label>
                            <input type="text" id="minimoUsuarios" value={minimoUsuarios} onChange={handleIntegerInputChange(setMinimoUsuarios)} />
                        </div>

                        <div className="campo-crear-experiencia campo-incluidos-experiencia">
                            <label>Incluidos en la Experiencia</label>
                            <div className="incluidos-options-container">
                                {opcionesIncluidos.map((incluido) => (
                                    <div key={incluido} className="incluido-option">
                                        <input
                                            type="checkbox"
                                            id={`incluido-${incluido}`}
                                            value={incluido}
                                            checked={incluidosExperiencia.includes(incluido)}
                                            onChange={() => handleIncluidosChange(incluido)}
                                        />
                                        <label htmlFor={`incluido-${incluido}`}>{incluido}</label>
                                    </div>
                                ))}
                            </div>

                            <div className="add-activity-container">
                                <input
                                    type="text"
                                    placeholder="Nuevo Item..."
                                    value={nuevoIncluido}
                                    onChange={(e) => setNuevoIncluido(e.target.value)}
                                    className="nuevo-tipo-input"
                                />
                                <button
                                    type="button"
                                    onClick={handleAgregarNuevoIncluido}
                                    className="add-activity-button"
                                >
                                    Agregar
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="campo-row-crear-experiencia">
                        <div className="campo-crear-experiencia">
                            <label htmlFor="maximoUsuarios">Máximo de Usuarios</label>
                            <input type="text" id="maximoUsuarios" value={maximoUsuarios} onChange={handleIntegerInputChange(setMaximoUsuarios)} />
                        </div>
                        <div className="campo-crear-experiencia">
                            <label htmlFor="longitudRecorrido">Longitud de Recorrido (km)</label>
                            <input type="text" id="longitudRecorrido" value={longitudRecorrido} onChange={handleLongitudChange} />
                        </div>
                    </div>

                    <div className="campo-row-crear-experiencia">
                        <div className="campo-crear-experiencia">
                            <label htmlFor="duracionRecorrido">Duración de Recorrido (minutos)</label>
                            <input type="text" id="duracionRecorrido" value={duracionRecorrido} onChange={handleDuracionChange} />
                        </div>
                        <div className="campo-crear-experiencia campo-tipo-actividad">
                            <label htmlFor="tipoActividad">Seleccionar Tipo de Actividad</label>
                            <select id="tipoActividad" value={tipoActividad} onChange={(e) => setTipoActividad(e.target.value)}>
                                <option value="">Seleccione...</option>
                                {tiposActividad.map((tipo) => (
                                    <option key={tipo} value={tipo}>
                                        {tipo}
                                    </option>
                                ))}
                            </select>
                            <div className="add-activity-container">
                                <input
                                    type="text"
                                    placeholder="Nuevo tipo..."
                                    value={nuevoTipoActividad}
                                    onChange={(e) => setNuevoTipoActividad(e.target.value)}
                                    className="nuevo-tipo-input"
                                />
                                <button type="button" onClick={handleAgregarNuevoTipo} className="add-activity-button">
                                    Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button className="boton-agregar-crear-experiencia" onClick={handleAgregar}>Agregar</button>
        </div>
    );
}

export default CrearExperiencia;