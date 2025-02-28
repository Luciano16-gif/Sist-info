import React, { useState } from "react";
import "./styles.css";

const names = [];

const EnterUserNameButton = ({ placeholder = "Ingresa tu nombre" }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleClick = (event) => {
    event.stopPropagation();
    setIsClicked(!isClicked);
    if (!isClicked) {
      setInputValue("");
    }
  };

  const handleOutsideClick = () => {
    setIsClicked(false);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyUp = (event) => {
    if (event.key === "Enter") {
      names.push(inputValue);
      console.log("Valor ingresado:", inputValue);
      console.log("Array de names:", names);
      setInputValue("");
    }
  };

  return (
    <>
      <div className="custom-button" onClick={handleClick}>
        <div className="background"></div>
        {isClicked ? (
          <input
            type="text"
            className="input-text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
            autoFocus
          />
        ) : (
          <div className={`text ${isClicked ? "clicked" : ""}`}>{placeholder}</div>
        )}
      </div>
      {isClicked && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 999,
            backgroundColor: "rgba(0, 0, 0, 0)",
          }}
          onClick={handleOutsideClick}
        ></div>
      )}
    </>
  );
};

export default EnterUserNameButton;