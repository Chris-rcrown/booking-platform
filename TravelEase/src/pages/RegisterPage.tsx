import React, { useState } from 'react';
import axios, { AxiosError } from 'axios'; // Import AxiosError type
import Header from '../components/header';


const API_BASE = import.meta.env.VITE_API_BASE_URL;

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE}/api/auth/register`, {
        email,
        password,
      });
      setMessage(response.data.message);
      setError(null);
    } catch (err) {
      setMessage(null);
      let msg = 'Registration failed';
      if (err instanceof AxiosError && err.response) {
        msg = err.response.data?.message || err.message;
      }
      setError(msg);
    }
  }; // Removed the 'as any' here

    return (
        <div className="h-[100vh] flex flex-col bg-[url('/auth-bg.jpg')] bg-cover bg-center bg-no-repeat">
            <Header/>
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
            title="Enter your email"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
            title="Enter your password"
            placeholder="Enter your password"
          />
        </div>
        <p>
          Already have an account?{' '}
          <span>
            <a href="/login" className="text-blue-600 hover:underline">Login</a>
          </span>
        </p>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
        >
          Register
        </button>
      </form>

      {message && <p className="mt-4 text-green-500">{message}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
    </div>
  );
};

export default RegisterPage;