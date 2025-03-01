

import React from 'react';
import EnterUserNameButton from '../../components/Buttons/EnterUserNameButton';
import EnterUserLastNameButton from '../../components/Buttons/EnterUserLastNameButton';
import EnterUserEmailButton from '../../components/Buttons/EnterUserEmailButton';

const Login_Page = () => {
  return (
    <div className="tests-container">
      <div className="buttons-container">
        <EnterUserNameButton placeholder="Ingresa tu nombre" />
        <EnterUserLastNameButton placeholder="Ingresa tu apellido" />
        <EnterUserEmailButton placeholder="Ingresa tu correo electrónico" />
      </div>
      {/* Otros elementos de la página */  }
    </div>
  );
};

export default Login_Page; 