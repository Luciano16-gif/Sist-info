import React, { useState } from 'react';

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const placeholderImage = "https://play-lh.googleusercontent.com/VzwzCxyHai3poLa-gV8Jpd-JickpjK9XYUi43fyK6RqPbInBr3S2rRsbraNhKVs8TbA";

  return (
    <div className="flex w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-green-300 via-green-400 to-green-500 p-4">
      <div className="relative w-full max-w-5xl mx-auto my-4 lg:my-8">
        {/* Container with responsive layout */}
        <div className="relative flex flex-col lg:flex-row w-full min-h-[500px] lg:h-[700px]">
          
          {/* Left Side - Register Form */}
          <div
            className={`w-full lg:w-1/2 absolute lg:relative top-0 left-0 z-10 bg-white p-6 shadow-2xl rounded-xl lg:rounded-r-none
              transform transition-all duration-500 ease-in-out
              ${isRegistering 
                ? "translate-x-0 opacity-100 scale-100" 
                : "translate-x-[-120%] opacity-0 scale-95 lg:translate-x-0 lg:opacity-100 lg:scale-100"}`}
          >
            <div className="h-full relative">
              {/* En pantallas grandes, centra verticalmente con posicionamiento absoluto */}
              <div className="lg:absolute inset-x-0 lg:top-1/2 lg:transform lg:-translate-y-1/2">
                <div className="mb-6">
                  <img src={placeholderImage} alt="Logo" className="h-10 w-10 rounded-full mx-auto" />
                  <h2 className="text-xl lg:text-2xl text-center font-bold mt-3">Create new account</h2>
                </div>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400"
                  />
                  <button className="w-full p-2.5 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all">
                    SIGN UP
                  </button>
                </form>
              </div>
              {/* Botón de toggle para móviles (sin posicionamiento absoluto) */}
              <div className="mt-6 text-center lg:hidden">
                <p className="text-gray-500 mb-2">Already have an account?</p>
                <button
                  onClick={() => setIsRegistering(false)}
                  className="w-full max-w-xs mx-auto px-6 py-2 border-2 border-green-400 text-green-400 rounded-lg hover:bg-green-400 hover:text-white transition-colors"
                >
                  Log in
                </button>
              </div>
            </div>
          </div>

          {/* Center - Sliding Content Panel (Desktop Only) */}
          <div
            className={`hidden lg:block w-full lg:w-1/2 lg:absolute lg:z-20 lg:top-0 lg:h-full 
              bg-gradient-to-br from-green-400 via-green-500 to-green-600 p-8 rounded-xl
              transition-all duration-500 ease-in-out
              ${isRegistering ? "lg:translate-x-full lg:rounded-l-none" : "lg:rounded-r-none"}`}
          >
            <div className="relative h-full flex flex-col justify-center">
              <div className="relative h-full">
                {/* El panel central ya se centrará verticalmente en lg */}
                <div
                  className={`absolute inset-x-0 lg:top-1/2 lg:transform lg:-translate-y-1/2 transition-all duration-500 ease-in-out
                    ${isRegistering ? "-translate-y-1/2 opacity-100" : "-translate-y-[150%] opacity-0"}`}
                >
                  <h2 className="text-3xl font-bold mb-4 text-white">Welcome Back!</h2>
                  <p className="text-lg text-white mb-24">
                    To keep connected with us please login with your personal info
                  </p>
                </div>
                <div
                  className={`absolute inset-x-0 lg:top-1/2 lg:transform lg:-translate-y-1/2 transition-all duration-500 ease-in-out
                    ${!isRegistering ? "-translate-y-1/2 opacity-100" : "translate-y-[150%] opacity-0"}`}
                >
                  <h2 className="text-3xl font-bold mb-4 text-white">
                    We are more than just a company
                  </h2>
                  <p className="text-lg text-white mb-24">
                    Join our community of innovators and entrepreneurs. Together, we can
                    make a difference while building something extraordinary.
                  </p>
                </div>
              </div>
              <div className="text-center absolute bottom-8 left-0 right-0">
                <button
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="px-6 py-2 border-2 border-white text-white rounded-lg hover:bg-white hover:text-green-500 transition-colors"
                >
                  {isRegistering ? "LOG IN" : "SIGN UP"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div
            className={`w-full lg:w-1/2 absolute lg:relative top-0 right-0 z-10 bg-white p-6 shadow-2xl rounded-xl lg:rounded-l-none
              transform transition-all duration-500 ease-in-out
              ${!isRegistering 
                ? "translate-x-0 opacity-100 scale-100" 
                : "translate-x-[120%] opacity-0 scale-95 lg:translate-x-0 lg:opacity-100 lg:scale-100"}`}
          >
            <div className="h-full relative">
              {/* En lg, centra verticalmente el contenido */}
              <div className="lg:absolute inset-x-0 lg:top-1/2 lg:transform lg:-translate-y-1/2">
                <div className="mb-6">
                  <img src={placeholderImage} alt="Logo" className="h-10 w-10 rounded-full mx-auto" />
                  <h2 className="text-xl lg:text-2xl text-center font-bold mt-3">Welcome Back</h2>
                </div>
                <h3 className="text-base lg:text-lg mb-4 text-center text-gray-600">
                  Please login to your account
                </h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400"
                  />
                  <button className="w-full p-2.5 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all">
                    LOG IN
                  </button>
                </form>
                <p className="mt-3 text-center">
                  <a href="#" className="text-gray-500 hover:text-green-600 text-sm">
                    Forgot password?
                  </a>
                </p>
              </div>
              {/* Botón para móviles */}
              <div className="mt-6 text-center lg:hidden">
                <p className="text-gray-500 mb-2">Need an account?</p>
                <button
                  onClick={() => setIsRegistering(true)}
                  className="w-full max-w-xs mx-auto px-6 py-2 border-2 border-green-400 text-green-400 rounded-lg hover:bg-green-400 hover:text-white transition-colors"
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
