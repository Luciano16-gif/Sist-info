import React, { useState } from 'react';

let placeholderImage = "https://play.google.com/store/apps/details?id=com.WhyMe.Munk";

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-green-300 via-green-400 to-green-500 p-4">
      <div className="relative w-full max-w-5xl mx-auto my-4 lg:my-8">
        {/* Container with responsive layout */}
        <div className="flex flex-col lg:flex-row w-full relative min-h-[500px] lg:h-[700px]">
          {/* Left Side - Register Form */}
          <div className={`w-full justify-center content-center lg:w-1/2 bg-white p-4 lg:p-6 shadow-2xl rounded-xl lg:rounded-r-none mb-4 lg:mb-0 transition-all duration-500 ease-in-out ${isRegistering ? 'scale-100 opacity-100 lg:translate-y-0' : 'scale-95 opacity-0 lg:translate-y-0 hidden lg:block'}`}>
            <div className="lg:mt-[-50px]">
              <div className="mb-6">
                <img src={placeholderImage} alt="Logo" className="h-10 rounded-full mx-auto" />
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
          </div>

          {/* Center - Sliding Content Panel */}
          <div className={`
            w-full lg:w-1/2 lg:absolute lg:z-30 lg:top-0 lg:h-full bg-gradient-to-br from-green-400 via-green-500 to-green-600 p-4 lg:p-8 
            transition-all duration-500 ease-in-out rounded-xl
            ${isRegistering ? 'lg:translate-x-full lg:rounded-l-none order-first lg:order-none' : 'lg:rounded-r-none order-first lg:order-none'}`}>

            <div className="relative h-full flex flex-col justify-center py-8 lg:py-0 sm:content-center">
              {/* Mobile Toggle Button - Only visible on mobile */}
              <div className="text-center mb-6 lg:hidden">
                <button
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="px-6 py-2 border-2 border-white text-white rounded-lg active:bg-white active:text-green-500 transition-colors"
                >
                  {isRegistering ? "Already have an account? Log in" : "Need an account? Sign up"}
                </button>
              </div>

              {/* Welcome/Sign Up Text - Desktop Only */}
              <div className="hidden lg:block">
                <div className={`lg:absolute h-full mt-[-145px] inset-x-0 transition-all duration-500 ease-in-out transform ${isRegistering ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-white text-center lg:text-left">Welcome Back!</h2>
                  <p className="text-base lg:text-lg text-white mb-8 lg:mb-24 text-center lg:text-left">
                    To keep connected with us please login with your personal info
                  </p>
                </div>
                
                <div className={`lg:absolute h-full mt-[-145px] inset-x-0 transition-all duration-500 ease-in-out transform ${!isRegistering ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-white text-center lg:text-left">We are more than just a company</h2>
                  <p className="text-base lg:text-lg text-white mb-8 lg:mb-24 text-center lg:text-left">
                    Join our community of innovators and entrepreneurs. Together, we can make a difference while building something extraordinary.
                  </p>
                </div>
              </div>
              
              {/* Desktop Toggle Button */}
              <div className="hidden lg:block text-center lg:absolute lg:bottom-8 lg:left-0 lg:right-0">
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
          <div className={`w-full justify-center content-center lg:w-1/2 bg-white p-4 lg:p-6 shadow-2xl rounded-xl lg:rounded-l-none transition-all duration-500 ease-in-out ${!isRegistering ? 'scale-100 opacity-100 lg:translate-y-0' : 'scale-95 opacity-0 lg:translate-y-0 hidden lg:block'}`}>
            <div className="lg:mt-[-50px]">
              <div className="mb-6">
                <img src={placeholderImage} alt="Logo" className="h-10 rounded-full mx-auto" />
                <h2 className="text-xl lg:text-2xl text-center font-bold mt-3">We are BATMAN</h2>
              </div>
              <h3 className="text-base lg:text-lg mb-4 text-center lg:text-left">Please login to your account</h3>
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
                <a href="#" className="text-gray-500 hover:text-green-600 text-sm">Forgot password?</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;