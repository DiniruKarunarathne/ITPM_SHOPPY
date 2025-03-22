import React from "react";

function LoginForm({ email, password, onChange, handleSubmit }) {
  return (
    <section className="flex justify-center items-center min-h-[400px] px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                id="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                onChange={onChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <a href="#" className="text-sm text-red-500 hover:text-red-700">Forgot password?</a>
            </div>
            <div className="relative">
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                id="password"
                name="password"
                value={password}
                placeholder="Enter your password"
                onChange={onChange}
                required
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-200 text-white font-medium rounded-lg text-base px-5 py-3 transition-colors duration-300 ease-in-out"
            >
              Login
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/Register" className="text-red-500 hover:text-red-800 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default LoginForm;