import React, { useState } from "react";
import "./styles.css"; // Importa los estilos específicos del botón

const lastNames = [];

const EnterUserLastNameButton = ({ placeholder = "Ingresa tu apellido" }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [inputValue, setInputValue] = useState(""); // Estado para el texto ingresado

  const handleClick = (event) => {
    event.stopPropagation(); // Evita que el clic se propague
    setIsClicked(!isClicked);
    if (!isClicked) {
      setInputValue(""); // Vacía el campo de entrada al activar el botón
    }
  };

  const handleOutsideClick = (event) => {
    setIsClicked(false); // Restablece el estado del botón
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value); // Actualiza el estado con el texto ingresado
  };

  const handleKeyUp = (event) => {
    if (event.key === "Enter") {
      lastNames.push(inputValue);
      console.log("Valor ingresado por LastName:", inputValue); // Imprime el valor en la consola
      console.log("Array de lastNames:", lastNames);
      setInputValue(""); // Resetea el campo de entrada
    }
  };

  return (
    <>
      <div className="custom-button" onClick={handleClick}>
        <div className="background"></div>
        {isClicked ? (
          // Muestra el campo de entrada cuando el botón está activo
          <input
            type="text"
            className="input-text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp} // Cambia a onKeyUp
            autoFocus // Asegura que el campo de entrada tenga foco automáticamente
          />
        ) : (
          // Muestra el texto estático cuando el botón no está activo
          <div className={`text ${isClicked ? "clicked" : ""}`}>{placeholder}</div>
        )}
      </div>
      {/* Div para detectar clics fuera del botón */}
      {isClicked && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 999, // Asegúrate de que esté por encima de otros elementos
            backgroundColor: "rgba(0, 0, 0, 0)", // Transparente pero interactivo
          }}
          onClick={handleOutsideClick}
        ></div>
      )}
    </>
  );
};

export default EnterUserLastNameButton;