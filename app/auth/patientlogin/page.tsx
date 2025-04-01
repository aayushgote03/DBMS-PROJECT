'use client'
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginPage: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
      const res = await signIn('credentials', {
        redirect: false,
        role: 'patient',
        identifier,
        loginMethod,
        password,
      });

      if (res?.error) {
        // Handle different error cases
        switch (res.error) {
          case "CredentialsSignin":
            setError("Invalid email/phone or password");
            break;
          case "AccessDenied":
            setError("Access denied. Please check your credentials.");
            break;
          default:
            setError("An error occurred during login. Please try again.");
        }
      } else if (res?.ok) {
        router.push('/patientinfo');
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          👤 Patient Login
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                ⚠️
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="loginMethod"
              className="block text-sm font-medium text-gray-700"
            >
              Login Method
            </label>
            <select
              id="loginMethod"
              value={loginMethod}
              onChange={(e) => {
                setLoginMethod(e.target.value);
                setError(null); // Clear error on method change
                setIdentifier(""); // Clear identifier on method change
              }}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black transition duration-150 ease-in-out"
            >
              <option value="email">Email</option>
              <option value="phone">Phone Number</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700"
            >
              {loginMethod === 'email' ? '📧 Email' : '📱 Phone Number'}
            </label>
            <input
              type={loginMethod === 'email' ? 'email' : 'tel'}
              id="identifier"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setError(null); // Clear error on input change
              }}
              placeholder={loginMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black transition duration-150 ease-in-out"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              🔒 Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null); // Clear error on input change
              }}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black transition duration-150 ease-in-out"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-blue-500 hover:text-blue-600 hover:underline transition duration-150 ease-in-out">
              Sign up
            </Link>
          </p>
          <Link href="/" className="mt-4 inline-block text-sm text-gray-500 hover:text-gray-600 hover:underline transition duration-150 ease-in-out">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;