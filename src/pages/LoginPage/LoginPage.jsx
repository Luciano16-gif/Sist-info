import React, { useState } from 'react';

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-green-300 via-green-400 to-green-500">
      <div className="relative flex w-full max-w-5xl mx-auto my-8">
        {/* Left Side - Register Form */}
        <div className="w-1/2 justify-center content-center bg-white p-6 shadow-2xl rounded-xl">
          <div className={`transition-all duration-500 ease-in-out transform ${isRegistering ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} mt-[-50px]`}>
            <div className="mb-6">
              <img src="https://play-lh.googleusercontent.com/VzwzCxyHai3poLa-gV8Jpd-JickpjK9XYUi43fyK6RqPbInBr3S2rRsbraNhKVs8TbA" alt="Logo" className="h-10 rounded-full" />
              <h2 className="text-2xl text-center font-bold mt-3">Create new account</h2>
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
        <div className={`absolute z-50 top-0 w-1/2 h-full bg-gradient-to-br from-green-400 via-green-500 to-green-600 p-8 transition-all duration-500 ease-in-out rounded-xl ${isRegistering ? 'translate-x-full' : ''}`}>
          <div className="relative h-full flex flex-col justify-center">
            {/* Welcome Text */}
            <div className={`absolute inset-x-0 transition-all duration-500 ease-in-out transform ${isRegistering ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
              <h2 className="text-3xl font-bold mb-4 text-white">Welcome Back!</h2>
              <p className="text-lg text-white mb-24">
                To keep connected with us please login with your personal info
              </p>
            </div>
            
            {/* Sign Up Text */}
            <div className={`absolute inset-x-0 transition-all duration-500 ease-in-out transform ${!isRegistering ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
              <h2 className="text-3xl font-bold mb-4 text-white">We are more than just a company</h2>
              <p className="text-lg text-white mb-24">
                Join our community of innovators and entrepreneurs. Together, we can make a difference while building something extraordinary.
              </p>
            </div>
            
            {/* Button */}
            <div className="absolute bottom-8 left-0 right-0">
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
        <div className="w-1/2 justify-center content-center z-20 bg-white p-6 shadow-2xl rounded-xl">
          <div className={`transition-all duration-500 ease-in-out transform ${!isRegistering ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} mt-[-50px]`}>
            <div className="mb-6">
                <img src="https://play-lh.googleusercontent.com/VzwzCxyHai3poLa-gV8Jpd-JickpjK9XYUi43fyK6RqPbInBr3S2rRsbraNhKVs8TbA" alt="Logo" className="h-10 rounded-full" />
              <h2 className="text-2xl text-center font-bold mt-3">We are BATMAN</h2>
            </div>
            <h3 className="text-lg mb-4">Please login to your account</h3>
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
  );
};

export default LoginPage;