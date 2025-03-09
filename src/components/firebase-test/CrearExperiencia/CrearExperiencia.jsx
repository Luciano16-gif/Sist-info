// CrearExperiencia.jsx
import React, { useState, useRef } from 'react';
import './CrearExperiencia.css';
import { db, storage } from '../../../firebase-config';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function CrearExperiencia() {
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
  const [incluidosExperiencia, setIncluidosExperiencia] = useState('');
  const [tipoActividad, setTipoActividad] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('../../src/assets/images/AdminLandingPage/CrearExperiencias/SubirImagen.png');
  const fileInputRef = useRef(null);

    const handleAgregar = async () => {
        // 1. Data Validation (moved most validations before image upload)
        if (!nombre || !precio || fechas.length === 0 || !descripcion || !horarioInicio || !horarioFin || !puntoSalida ||
            !longitudRecorrido || !duracionRecorrido || !guiasRequeridos ||
            !minimoUsuarios || !maximoUsuarios || !incluidosExperiencia || !tipoActividad) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        // Time Validation (remains the same)
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


      // User Count Validation (remains mostly the same)
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

        // Min/Max User Comparison (remains the same)
        if (minUsers > maxUsers) {
            alert('El mínimo de usuarios no puede ser mayor que el máximo de usuarios.');
            return;
        }

        // Precio Validation (now handles the '$' prefix)
        if (!/^\d+(\.\d{0,2})?$/.test(precio)) {
            alert('Por favor ingrese un número válido para el precio.');
            return;
        }
        const precioNumerico = parseFloat(precio);
        if (precioNumerico <= 0) {
            alert("El precio debe ser mayor que cero.");
            return;
        }

        // Duracion Recorrido Validation (must be a positive integer - minutes)
        if (!/^\d+$/.test(duracionRecorrido)) {
            alert("Por favor, ingrese un número entero válido para la duración del recorrido (en minutos).");
            return;
        }
        const duracionNumerica = parseInt(duracionRecorrido);
        if (duracionNumerica <= 0) {
          alert("La duración debe ser mayor que cero.");
          return
        }

        // Longitud Recorrido Validation (must be positive number, "km" suffix)
        if (!/^\d+(\.\d*)?$/.test(longitudRecorrido)) {
            alert("Por favor, ingrese un número válido para la longitud del recorrido (en km).");
            return;
        }
        const longitudNumerica = parseFloat(longitudRecorrido);
        if (longitudNumerica <= 0) {
          alert("La longitud debe ser mayor que cero");
          return
        }

        //Guias requeridos validation
        if (parseInt(guiasRequeridos) < 0 || isNaN(parseInt(guiasRequeridos))) {
            alert('Por favor ingrese un número valido y no negativo para los guias requeridos.');
            return;
        }

        try {
            // 2. Upload the image (remains the same)
            let imageUrl = null;
            if (imageFile) {
                const storageRef = ref(storage, `experiences/${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            // 3. Create the data object (MODIFIED to format price, duration, and length)
            const experienciaData = {
                nombre,
                precio: `$${precioNumerico.toFixed(2)}`,
                fechas,
                descripcion,
                horarioInicio,
                horarioFin,
                puntoSalida,
                longitudRecorrido: `${longitudNumerica}km`,
                duracionRecorrido: `${duracionNumerica}min`, // Add "min" suffix
                guiasRequeridos: parseInt(guiasRequeridos),
                minimoUsuarios: minUsers,
                maximoUsuarios: maxUsers,
                incluidosExperiencia,
                tipoActividad,
                imageUrl,
            };


            // 4. Add to Firestore (remains the same)
            const docRef = await addDoc(collection(db, "Experiencias"), experienciaData);
            await setDoc(doc(db, "Experiencias", nombre), experienciaData);

            console.log("Document written with ID: ", docRef.id);

            // 5. Clear the form (remains the same)
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
            setIncluidosExperiencia('');
            setTipoActividad('');
            setImageFile(null);
            setImagePreview('../../src/assets/images/AdminLandingPage/CrearExperiencias/SubirImagen.png');

            // 6. Success message (remains the same)
            alert('Experiencia creada exitosamente!');

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

     // Keep this as is, we just validate the format *before* storing
    const handlePrecioChange = (e) => {
      setPrecio(e.target.value);
    };
    //  Validates integer input (for Duracion Recorrido)
    const handleDuracionChange = (e) => {
        setDuracionRecorrido(e.target.value); //  Set the raw input, validate on submit
    };

    // Validates float input (for Longitud Recorrido)
    const handleLongitudChange = (e) => {
        setLongitudRecorrido(e.target.value);
    };

    const handleIntegerInputChange = (setter) => (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setter(value);
        }
    };


    // --- Date Handling ---
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

    // --- Time Input Handler ---
    const handleTimeChange = (setter) => (e) => {
        let value = e.target.value;
        value = value.replace(/[^0-9:]/g, '');
        value = value.slice(0, 5);
        if (value.length >= 2 && value.indexOf(':') === -1) {
            value = value.slice(0, 2) + ':' + value.slice(2);
        }
        setter(value);
    };

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
                        <div className="campo-crear-experiencia">
                            <label htmlFor="precio">Precio</label>
                            <input type="text" id="precio" value={precio} onChange={handlePrecioChange} />
                        </div>
                        <div className="campo-crear-experiencia">
                            <label htmlFor="fecha">Fecha</label>
                              <div className="date-buttons-container">
                                {renderDateButtons()}
                            </div>
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
                            <input type="text" id="puntoSalida" value={puntoSalida} onChange={(e) => setPuntoSalida(e.target.value)} />
                        </div>
                        <div className="campo-crear-experiencia">
                            <label htmlFor="guiasRequeridos">Guías Requeridos</label>
                            <input type="text" id="guiasRequeridos" value={guiasRequeridos} onChange={handleIntegerInputChange(setGuiasRequeridos)} />
                        </div>
                    </div>

                    <div className='campo-row-crear-experiencia'>
                        <div className="campo-crear-experiencia">
                            <label htmlFor="minimoUsuarios">Mínimo de Usuarios</label>
                            <input type="text" id="minimoUsuarios" value={minimoUsuarios} onChange={handleIntegerInputChange(setMinimoUsuarios)} />
                        </div>

                        <div className="campo-crear-experiencia full-width-input-crear-experiencia">
                            <label htmlFor="incluidosExperiencia">Incluidos en la Experiencia</label>
                            <input type="text" id="incluidosExperiencia" value={incluidosExperiencia} onChange={(e) => setIncluidosExperiencia(e.target.value)} />
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
                        <div className="campo-crear-experiencia">
                            <label htmlFor="tipoActividad">Seleccionar Tipo de Actividad</label>
                            <select id="tipoActividad" value={tipoActividad} onChange={(e) => setTipoActividad(e.target.value)}>
                                <option value="">Seleccione...</option>
                                <option value="senderismo">Senderismo</option>
                                <option value="ciclismo">Ciclismo</option>
                                <option value="kayak">Kayak</option>
                                <option value="cultural">Cultural</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <button className="boton-agregar-crear-experiencia" onClick={handleAgregar}>Agregar</button>
        </div>
    );
}

export default CrearExperiencia;