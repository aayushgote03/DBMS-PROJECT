'use client'
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";

const LoginPage: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('FINE');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await signIn('credentials', {
        redirect: false,
        identifier,
        loginMethod,
        password,
      });

      if(!!res?.error) {
        console.log(res, "its error");
      
        setError(res.error);
      }
      else if (res?.ok) {
        redirect('/patientinfo');
        console.log(res, "its ok");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="loginMethod"
              className="block text-sm font-medium text-gray-700"
            >
              Login Method
            </label>
            <select
              id="loginMethod"
              value={loginMethod}
              onChange={(e) => setLoginMethod(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
            >
              <option value="email">Email</option>
              <option value="phone">Phone Number</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700"
            >
              {loginMethod === 'email' ? 'Email' : 'Phone Number'}
            </label>
            <input
              type={loginMethod === 'email' ? 'email' : 'tel'}
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={loginMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Log In"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;