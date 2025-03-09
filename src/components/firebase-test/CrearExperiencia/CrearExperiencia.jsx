// CrearExperiencia.jsx
import React, { useState, useRef } from 'react';
import './CrearExperiencia.css';

function CrearExperiencia() {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [fecha, setFecha] = useState('');
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
  const [imageFile, setImageFile] = useState(null); // Store the selected image file
  const [imagePreview, setImagePreview] = useState('../../src/assets/images/AdminLandingPage/CrearExperiencias/SubirImagen.png'); // Store the image preview URL
  const fileInputRef = useRef(null); // Ref to the hidden file input


  const handleAgregar = () => {
    // Handle the "Agregar" action
    console.log({
      nombre,
      precio,
      fecha,
      descripcion,
      horario,
      puntoSalida,
      longitudRecorrido,
      duracionRecorrido,
      guiasRequeridos,
      minimoUsuarios,
      maximoUsuarios,
      incluidosExperiencia,
      tipoActividad,
      imageFile, // Include imageFile in the data
    });

     // *** IMPORTANT: Data Sending to Backend ***
     // In a real application, you'd send this data to your backend API here,
     // likely using a POST request with fetch() or a library like axios.
     //  The imageFile would be sent as part of a FormData object.

     // Example (using fetch and FormData):

     const formData = new FormData();
     formData.append('nombre', nombre);
     formData.append('precio', precio);
     formData.append('fecha', fecha);
     formData.append('descripcion', descripcion);
     formData.append('horario', horario);
     formData.append('puntoSalida', puntoSalida);
     formData.append('longitudRecorrido', longitudRecorrido);
     formData.append('duracionRecorrido', duracionRecorrido);
     formData.append('guiasRequeridos', guiasRequeridos);
     formData.append('minimoUsuarios', minimoUsuarios);
     formData.append('maximoUsuarios', maximoUsuarios);
     formData.append('incluidosExperiencia', incluidosExperiencia);
     formData.append('tipoActividad', tipoActividad);
    if (imageFile) {  // Only append if an image was selected.
        formData.append('imagen', imageFile); // 'imagen' is the field name the backend expects
    }


    /*  fetch('YOUR_BACKEND_API_ENDPOINT', {
       method: 'POST',
       body: formData,  // No need for headers like 'Content-Type' when using FormData
     })
     .then(response => {
         if (!response.ok) {
             throw new Error('Network response was not ok');
         }
         return response.json(); //  Parse JSON response, or response.text() if it's text
     })
     .then(data => {
         console.log('Success:', data);
         // Handle success (e.g., show a success message, redirect, etc.)
     })
     .catch(error => {
         console.error('Error:', error);
         // Handle errors (e.g., show an error message)
     });  */
  };



    const handleImageClick = () => {
        fileInputRef.current.click(); // Programmatically click the hidden file input
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0]; // Get the selected file

        if (file) {
            setImageFile(file); // Store the file object

            // Create a preview URL for the image
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            // Handle case where user cancels file selection
            setImageFile(null);
            setImagePreview('../../src/assets/images/AdminLandingPage/CrearExperiencias/SubirImagen.png'); // Reset to default
        }
    };


  return (
    <div className="crear-experiencia-container-crear-experiencia">
      <h1 className="titulo-crear-experiencia">Agregar una nueva Experiencia</h1>
      <p className="subtitulo-crear-experiencia">Expande nuestra lista de servicios y experiencias únicas...</p>

        <div className="form-container-crear-experiencia">
          <div className="imagen-experiencia-container-crear-experiencia">
             {/* Hidden file input */}
            <input
              type="file"
              accept="image/*" // Accept only image files
              style={{ display: 'none' }} // Hide the input element
              ref={fileInputRef}
              onChange={handleImageChange}
            />

            {/* Clickable image area */}
            <div
              className="imagen-placeholder-crear-experiencia"
              onClick={handleImageClick}
              role="button"
              aria-label="Upload image"
            >
                <img src={imagePreview} alt="Upload Placeholder" style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
            </div>
          </div>

          <div className="campos-container-crear-experiencia">
            {/* ... (rest of your input fields remain the same) ... */}
            <div className="campo-crear-experiencia">
              <label htmlFor="nombre">Nombre de la Experiencia</label>
              <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>

            <div className="campo-row-crear-experiencia">
              <div className="campo-crear-experiencia">
                <label htmlFor="precio">Precio</label>
                <input type="text" id="precio" value={precio} onChange={(e) => setPrecio(e.target.value)} />
              </div>
              <div className="campo-crear-experiencia">
                <label htmlFor="fecha">Fecha</label>
                <input type="text" id="fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} />
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
                        {/*  Using "-" as a placeholder*/}
                      <label> - </label>
                      <input type="text"  disabled />
                  </div>
              </div>

            <div className="campo-row-crear-experiencia">
              <div className="campo-crear-experiencia">
                <label htmlFor="puntoSalida">Punto de Salida</label>
                <input type="text" id="puntoSalida" value={puntoSalida} onChange={(e) => setPuntoSalida(e.target.value)} />
              </div>
              <div className="campo-crear-experiencia">
                <label htmlFor="guiasRequeridos">Guías Requeridos</label>
                <input type="text" id="guiasRequeridos" value={guiasRequeridos} onChange={(e) => setGuiasRequeridos(e.target.value)} />
              </div>
              </div>

            <div className='campo-row-crear-experiencia'>
                <div className="campo-crear-experiencia">
                  <label htmlFor="minimoUsuarios">Mínimo de Usuarios</label>
                  <input type="text" id="minimoUsuarios" value={minimoUsuarios} onChange={(e) => setMinimoUsuarios(e.target.value)} />
                </div>

              <div className="campo-crear-experiencia full-width-input-crear-experiencia">
                <label htmlFor="incluidosExperiencia">Incluidos en la Experiencia</label>
                <input type="text" id="incluidosExperiencia" value={incluidosExperiencia} onChange={(e) => setIncluidosExperiencia(e.target.value)} />
              </div>
            </div>


            <div className="campo-row-crear-experiencia">
              <div className="campo-crear-experiencia">
                  <label htmlFor="maximoUsuarios">Máximo de Usuarios</label>
                  <input type="text" id="maximoUsuarios" value={maximoUsuarios} onChange={(e) => setMaximoUsuarios(e.target.value)} />
              </div>
              <div className="campo-crear-experiencia">
                <label htmlFor="longitudRecorrido">Longitud de Recorrido</label>
                <input type="text" id="longitudRecorrido" value={longitudRecorrido} onChange={(e) => setLongitudRecorrido(e.target.value)} />
              </div>

            </div>
            <div className="campo-row-crear-experiencia">

                <div className="campo-crear-experiencia">
                    <label htmlFor="duracionRecorrido">Duración de Recorrido (aprox.)</label>
                    <input type="text" id="duracionRecorrido" value={duracionRecorrido} onChange={(e) => setDuracionRecorrido(e.target.value)} />
                </div>
              <div className="campo-crear-experiencia">
                  <label htmlFor="tipoActividad">Seleccionar Tipo de Actividad</label>
                  <select id="tipoActividad" value={tipoActividad} onChange={(e) => setTipoActividad(e.target.value)}>
                      <option value="">Seleccione...</option>
                      <option value="senderismo">Senderismo</option>
                      <option value="ciclismo">Ciclismo</option>
                      <option value="kayak">Kayak</option>
                      <option value="cultural">Cultural</option>
                      {/* Add more options as needed */}
                  </select>
              </div>
              </div>
          </div>
          </div> {/* Moved button outside form-container */}
        <button className="boton-agregar-crear-experiencia" onClick={handleAgregar}>Agregar</button>

    </div>
  );
}

export default CrearExperiencia;