import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/header';


const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password
      });

      setMessage(response.data.message);
      setError(null);

      // You can save token to localStorage here
      // localStorage.setItem('token', response.data.token);
    } catch (err: unknown) {
 setMessage(null);
 if (axios.isAxiosError(err)) {
 setError(err.response?.data?.message || 'Login failed');
      } else {
 setError('An unexpected error occurred');
      }
    }
  };

    return (
        <div className="h-[100vh] flex flex-col bg-[url('/auth-bg.jpg')] bg-cover bg-center bg-no-repeat">
            <Header/>
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            id="email"
            type="email"
            title="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            id="password"
            type="password"
            title="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
              </div>
              <p>Don't have and account? <span><a href="/register" className="text-blue-600 hover:underline">Register</a></span></p>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
        >
          Login
        </button>
      </form>

      {message && <p className="mt-4 text-green-500">{message}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
            </div>
  );
};

export default LoginPage;