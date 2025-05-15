'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) router.push('/calendar');
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@demo.com' && password === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/calendar');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: '#005186' }}>
          Login
        </h2>

        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
        )}

        <div className="mb-4">
          <label className="block text-sm mb-1 text-black">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded text-black placeholder-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@demo.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1 text-black">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded text-black placeholder-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin123"
          />
        </div>

        <button
            type="submit"
            className="w-full text-white py-2 rounded transition"
            style={{ backgroundColor: '#fbb04c' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#dd8611')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fbb04c')}
            >
            Login
        </button>

      </form>
    </div>
  );
}
