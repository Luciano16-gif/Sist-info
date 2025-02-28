import React from "react";
import EnterUserNameButton from "./EnterUserNameButton";
import EnterUserLastNameButton from "./EnterUserLastNameButton";
import EnterUserEmailButton from "./EnterUserEmailButton";
import "./styles.css";

const UserInputButtons = () => {
  return (
    <div className="buttons-container">
      <EnterUserNameButton placeholder="Ingresa tu nombre" />
      <EnterUserLastNameButton placeholder="Ingresa tu apellido" />
      <EnterUserEmailButton placeholder="Ingresa tu correo electrónico" />
    </div>
  );
};

export default UserInputButtons;