import React, { useState } from 'react';
import './CreateExperience.css';

// Custom hooks
import { useExperienceForm } from '../../hooks/experiences-hooks/useExperienceForm';

// UI Components
import {
  ImageUploader,
  TextInput,
  TextArea,
  TimeInput,
  DateSelector,
  DifficultySelector,
  OptionSelector,
  CheckboxGroup,
  GuideSelector,
  SubmitButton
} from '../ExperienceFormComponent';

/**
 * CreateExperience component - Allows creating new experiences
 */
function CreateExperience() {
  // Setup for new item inputs
  const [nuevoTipoActividad, setNuevoTipoActividad] = useState("");
  const [nuevoIncluido, setNuevoIncluido] = useState("");
  const [nuevoPuntoSalida, setNuevoPuntoSalida] = useState("");
  
  // Use the custom form hook
  const {
    formState,
    configState,
    formHandling,
    handlers,
    configHandlers,
    formOperations
  } = useExperienceForm();
  
  // Success message state
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Handle form submission
  const handleSubmit = async () => {
    const success = await formOperations.handleSubmit();
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000); // Hide after 5 seconds
    }
  };

  return (
    <div className="crear-experiencia-container-crear-experiencia">
      <h1 className="titulo-crear-experiencia">Agregar una nueva Experiencia</h1>
      <p className="subtitulo-crear-experiencia">Expande nuestra lista de servicios y experiencias únicas...</p>

      {/* Success Message */}
      {showSuccess && (
        <div className="success-message">
          ¡Experiencia creada exitosamente!
        </div>
      )}
      
      {/* General Form Error */}
      {formHandling.errors.submit && (
        <div className="error-message">
          {formHandling.errors.submit}
        </div>
      )}

      <div className="form-container-crear-experiencia">
        {/* Image Upload Section */}
        <ImageUploader
          imagePreview={formState.imagePreview}
          onImageChange={handlers.handleImageChange}
          error={formHandling.errors.imagen}
        />

        {/* Form Fields Section */}
        <div className="campos-container-crear-experiencia">
          {/* Basic Information */}
          <TextInput
            id="nombre"
            label="Nombre de la Experiencia"
            value={formState.nombre}
            onChange={handlers.handleNombreChange}
            error={formHandling.errors.nombre}
          />

          <div className="campo-row-crear-experiencia">
            <div className="campo-crear-experiencia campo-crear-experiencia-precio">
              <TextInput
                id="precio"
                label="Precio"
                value={formState.precio}
                onChange={handlers.handlePrecioChange}
                error={formHandling.errors.precio}
              />
            </div>
            
            <DifficultySelector
              difficulty={formState.dificultad}
              onDifficultyChange={handlers.handleDificultadClick}
              error={formHandling.errors.dificultad}
            />
          </div>

          {/* Date Selection */}
          <DateSelector
            selectedDates={formState.fechas}
            onDateChange={handlers.handleDateChange}
            error={formHandling.errors.fechas}
          />

          {/* Description */}
          <TextArea
            id="descripcion"
            label="Descripción"
            value={formState.descripcion}
            onChange={handlers.handleDescripcionChange}
            error={formHandling.errors.descripcion}
          />

          {/* Time Range */}
          <div className='campo-row-crear-experiencia'>
            <TimeInput
              id="horarioInicio"
              label="Horario Inicio"
              value={formState.horarioInicio}
              onChange={handlers.handleTimeChange(formOperations.setHorarioInicio)}
              error={formHandling.errors.horarioInicio}
            />

            <TimeInput
              id="horarioFin"
              label="Horario Fin"
              value={formState.horarioFin}
              onChange={handlers.handleTimeChange(formOperations.setHorarioFin)}
              error={formHandling.errors.horarioFin}
            />
          </div>

          {/* Display shared time range error if any */}
          {formHandling.errors.horario && (
            <div className="form-error">{formHandling.errors.horario}</div>
          )}

          {/* Location and Guides */}
          <div className="campo-row-crear-experiencia">
            <OptionSelector
              id="puntoSalida"
              label="Punto de Salida"
              value={formState.puntoSalida}
              onChange={handlers.handlePuntoSalidaChange}
              options={configState.puntosSalida}
              onAddNew={(nuevoPunto) => configHandlers.handleAgregarNuevoPuntoSalida(nuevoPunto)}
              error={formHandling.errors.puntoSalida}
              newValueState={[nuevoPuntoSalida, setNuevoPuntoSalida]}
              onNewValueChange={(e) => setNuevoPuntoSalida(e.target.value)}
              newValueError={formHandling.errors.nuevoPunto}
            />
            
            <TextInput
              id="guiasRequeridos"
              label="Guías Requeridos"
              value={formState.guiasRequeridos}
              onChange={handlers.handleIntegerInputChange(handlers.setGuiasRequeridos)}
              error={formHandling.errors.guiasRequeridos}
            />
          </div>

          {/* Guide Selection */}
          <GuideSelector
            guiasDisponibles={configState.guiasDisponibles}
            guiasSeleccionados={formState.guiasSeleccionados}
            onChange={handlers.handleSeleccionarGuia}
            error={formHandling.errors.guias}
          />

          {/* User Capacity and Incluidos */}
          <div className='campo-row-crear-experiencia'>
            <TextInput
              id="minimoUsuarios"
              label="Mínimo de Usuarios"
              value={formState.minimoUsuarios}
              onChange={handlers.handleIntegerInputChange(handlers.setMinimoUsuarios)}
              error={formHandling.errors.minimoUsuarios}
            />

            <CheckboxGroup
              label="Incluidos en la Experiencia"
              options={configState.opcionesIncluidos}
              selectedValues={formState.incluidosExperiencia}
              onChange={handlers.handleIncluidosChange}
              onAddNew={(nuevoIncluido) => configHandlers.handleAgregarNuevoIncluido(nuevoIncluido)}
              error={formHandling.errors.incluidosExperiencia}
              newValueState={[nuevoIncluido, setNuevoIncluido]}
              onNewValueChange={(e) => setNuevoIncluido(e.target.value)}
              newValueError={formHandling.errors.nuevoIncluido}
              containerClassName="campo-incluidos-experiencia"
              itemClassName="incluido-option"
              idPrefix="incluido"
            />
          </div>

          {/* Display shared user limits error if any */}
          {formHandling.errors.usuarios && (
            <div className="form-error">{formHandling.errors.usuarios}</div>
          )}

          {/* Maximum Users and Route Length */}
          <div className="campo-row-crear-experiencia">
            <TextInput
              id="maximoUsuarios"
              label="Máximo de Usuarios"
              value={formState.maximoUsuarios}
              onChange={handlers.handleIntegerInputChange(handlers.setMaximoUsuarios)}
              error={formHandling.errors.maximoUsuarios}
            />
            
            <TextInput
              id="longitudRecorrido"
              label="Longitud de Recorrido (km)"
              value={formState.longitudRecorrido}
              onChange={handlers.handleLongitudChange}
              error={formHandling.errors.longitudRecorrido}
            />
          </div>

          {/* Duration and Activity Type */}
          <div className="campo-row-crear-experiencia">
            <TextInput
              id="duracionRecorrido"
              label="Duración de Recorrido (minutos)"
              value={formState.duracionRecorrido}
              onChange={handlers.handleDuracionChange}
              error={formHandling.errors.duracionRecorrido}
            />
            
            <OptionSelector
              id="tipoActividad"
              label="Tipo de Actividad"
              value={formState.tipoActividad}
              onChange={handlers.handleTipoActividadChange}
              options={configState.tiposActividad}
              onAddNew={(nuevoTipo) => configHandlers.handleAgregarNuevoTipo(nuevoTipo)}
              error={formHandling.errors.tipoActividad}
              newValueState={[nuevoTipoActividad, setNuevoTipoActividad]}
              onNewValueChange={(e) => setNuevoTipoActividad(e.target.value)}
              newValueError={formHandling.errors.nuevoTipo}
              containerClassName="campo-tipo-actividad"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <SubmitButton 
        onClick={handleSubmit}
        isSubmitting={formHandling.isSubmitting}
      />
    </div>
  );
}

export default CreateExperience;