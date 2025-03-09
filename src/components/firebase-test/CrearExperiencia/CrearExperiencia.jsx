// CrearExperiencia.jsx
import React, { useState, useRef } from 'react';
import './CrearExperiencia.css';
import { db, storage } from '../../../firebase-config'; // Import your Firebase configuration
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


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


    const handleAgregar = async () => {  // Make the function async
        // 1. Data Validation (Important!):  Always validate user input on the server-side as well,
        //    but client-side validation provides a better user experience.
        if (!nombre || !precio || !fecha || !descripcion || !horario || !puntoSalida ||
            !longitudRecorrido || !duracionRecorrido || !guiasRequeridos ||
            !minimoUsuarios || !maximoUsuarios || !incluidosExperiencia || !tipoActividad) {
            alert('Por favor, complete todos los campos.'); // Basic validation, replace with a better UI
            return;
        }

        if (isNaN(parseFloat(precio)) || parseFloat(precio) <=0)
        {
            alert('Por favor ingrese un número valido y mayor que 0 para el precio.');
            return;
        }
        if (isNaN(parseInt(minimoUsuarios)) || parseInt(minimoUsuarios) <=0)
        {
            alert('Por favor ingrese un número valido y mayor que 0 para el minimo de usuarios.');
            return;
        }
        if (isNaN(parseInt(maximoUsuarios)) || parseInt(maximoUsuarios) <=0)
        {
            alert('Por favor ingrese un número valido y mayor que 0 para el maximo de usuarios.');
            return;
        }
        if (parseInt(minimoUsuarios) > parseInt(maximoUsuarios))
        {
            alert('El minimo de usuarios no puede ser mayor que el máximo.');
            return;
        }

        if (isNaN(parseInt(guiasRequeridos)) || parseInt(guiasRequeridos) <0)
        {
            alert('Por favor ingrese un número valido y no negativo para los guias requeridos.');
            return;
        }

        if (isNaN(parseFloat(longitudRecorrido)) || parseFloat(longitudRecorrido) <0)
        {
            alert('Por favor ingrese un número valido no negativo para la longitud del recorrido.');
            return;
        }
        if (isNaN(parseFloat(duracionRecorrido)) || parseFloat(duracionRecorrido) <0)
        {
            alert('Por favor ingrese un número valido no negativo para la duración del recorrido.');
            return;
        }
        try {
            // 2. Upload the image to Firebase Storage (if an image was selected)
            let imageUrl = null; // Initialize imageUrl
            if (imageFile) {
                const storageRef = ref(storage, `experiences/${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            // 3. Create the data object to be saved in Firestore.
            const experienciaData = {
                nombre,
                precio: parseFloat(precio), // Convert to number, VERY IMPORTANT
                fecha,
                descripcion,
                horario,
                puntoSalida,
                longitudRecorrido: parseFloat(longitudRecorrido), //Convert to number
                duracionRecorrido: parseFloat(duracionRecorrido), //Convert to number
                guiasRequeridos: parseInt(guiasRequeridos),  //Convert to number
                minimoUsuarios: parseInt(minimoUsuarios),     //Convert to number
                maximoUsuarios: parseInt(maximoUsuarios),     //Convert to number
                incluidosExperiencia,
                tipoActividad,
                imageUrl,  //  Include image URL, can be null.  Firestore handles nulls well.
            };

            // 4. Add a new document with a generated ID to the "Experiencias" collection
            const docRef = await addDoc(collection(db, "Experiencias"), experienciaData);
             // *and* create a doc with the name of the experience
            await setDoc(doc(db, "Experiencias", nombre), experienciaData);

            console.log("Document written with ID: ", docRef.id);

            // 5.  Clear the form (reset state)
            setNombre('');
            setPrecio('');
            setFecha('');
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

            // 6.  (Optional) Show a success message to the user.  Consider using a more sophisticated
            //     notification method than alert().
            alert('Experiencia creada exitosamente!');

        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error al crear la experiencia.  Por favor, inténtelo de nuevo."); // Show error to user
        }
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