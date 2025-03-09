// CrearExperiencia.jsx
import React, { useState, useRef } from 'react';
import './CrearExperiencia.css';
import { db, storage } from '../../../firebase-config';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function CrearExperiencia() {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [fechas, setFechas] = useState([]); // Use an array for multiple dates
  const [descripcion, setDescripcion] = useState('');
  const [horario, setHorario] = useState('');
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
        // 1. Data Validation
        if (!nombre || !precio || fechas.length === 0 || !descripcion || !horario || !puntoSalida ||
            !longitudRecorrido || !duracionRecorrido || !guiasRequeridos ||
            !minimoUsuarios || !maximoUsuarios || !incluidosExperiencia || !tipoActividad) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        if (isNaN(parseFloat(precio)) || parseFloat(precio) <= 0) {
            alert('Por favor ingrese un número valido y mayor que 0 para el precio.');
            return;
        }
        if (isNaN(parseInt(minimoUsuarios)) || parseInt(minimoUsuarios) <= 0) {
            alert('Por favor ingrese un número valido y mayor que 0 para el minimo de usuarios.');
            return;
        }
        if (isNaN(parseInt(maximoUsuarios)) || parseInt(maximoUsuarios) <= 0) {
            alert('Por favor ingrese un número valido y mayor que 0 para el maximo de usuarios.');
            return;
        }
        if (parseInt(minimoUsuarios) > parseInt(maximoUsuarios)) {
            alert('El minimo de usuarios no puede ser mayor que el máximo.');
            return;
        }

        if (isNaN(parseInt(guiasRequeridos)) || parseInt(guiasRequeridos) < 0) {
            alert('Por favor ingrese un número valido y no negativo para los guias requeridos.');
            return;
        }

        if (isNaN(parseFloat(longitudRecorrido)) || parseFloat(longitudRecorrido) < 0) {
            alert('Por favor ingrese un número valido no negativo para la longitud del recorrido.');
            return;
        }
        if (isNaN(parseFloat(duracionRecorrido)) || parseFloat(duracionRecorrido) < 0) {
            alert('Por favor ingrese un número valido no negativo para la duración del recorrido.');
            return;
        }

        try {
            // 2. Upload the image
            let imageUrl = null;
            if (imageFile) {
                const storageRef = ref(storage, `experiences/${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            // 3. Create the data object
            const experienciaData = {
                nombre,
                precio: parseFloat(precio),
                fechas,  // Store the array of dates
                descripcion,
                horario,
                puntoSalida,
                longitudRecorrido: parseFloat(longitudRecorrido),
                duracionRecorrido: parseFloat(duracionRecorrido),
                guiasRequeridos: parseInt(guiasRequeridos),
                minimoUsuarios: parseInt(minimoUsuarios),
                maximoUsuarios: parseInt(maximoUsuarios),
                incluidosExperiencia,
                tipoActividad,
                imageUrl,
            };

            // 4. Add to Firestore
            const docRef = await addDoc(collection(db, "Experiencias"), experienciaData);
            await setDoc(doc(db, "Experiencias", nombre), experienciaData); // Also add with doc name = nombre

            console.log("Document written with ID: ", docRef.id);

            // 5. Clear the form
             setNombre('');
            setPrecio('');
            setFechas([]); // Clear the dates array
            setDescripcion('');
            setHorario('');
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

            // 6. Success message
            alert('Experiencia creada exitosamente!');

        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error al crear la experiencia.  Por favor, inténtelo de nuevo.");
        }
    };

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
        const value = e.target.value;
        if (/^(\d+(\.\d{0,2})?)?$/.test(value)) {
            setPrecio(value);
        }
    };

    const handleIntegerInputChange = (setter) => (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setter(value);
        }
    };

    const handleFloatInputChange = (setter) => (e) => {
        const value = e.target.value;
        if (/^(\d+(\.\d*)?)?$/.test(value)) {
            setter(value);
        }
    };

    // --- Date Handling ---
    const handleDateChange = (date) => {
      // Check if the date is already selected
      if (fechas.includes(date)) {
          // If it's selected, remove it (toggle off)
          setFechas(fechas.filter(d => d !== date));
      } else {
          // If it's not selected, add it (toggle on)
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
                            <label htmlFor="horario">Horario</label>
                            <input type="text" id="horario" value={horario} onChange={(e) => setHorario(e.target.value)} />
                        </div>

                        <div className="campo-crear-experiencia">
                            <label> - </label>
                            <input type="text" disabled />
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
                            <label htmlFor="longitudRecorrido">Longitud de Recorrido</label>
                            <input type="text" id="longitudRecorrido" value={longitudRecorrido} onChange={handleFloatInputChange(setLongitudRecorrido)} />
                        </div>
                    </div>

                    <div className="campo-row-crear-experiencia">
                        <div className="campo-crear-experiencia">
                            <label htmlFor="duracionRecorrido">Duración de Recorrido (aprox.)</label>
                            <input type="text" id="duracionRecorrido" value={duracionRecorrido} onChange={handleFloatInputChange(setDuracionRecorrido)} />
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

//wawa
export default CrearExperiencia;