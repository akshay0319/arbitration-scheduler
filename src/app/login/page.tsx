"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const users = [
    {
      email: "admin@demo.com",
      password: "admin123",
      role: "admin",
    },
    {
      email: "claimant@demo.com",
      password: "password123",
      role: "claimant",
    },
    {
      email: "respondent@demo.com",
      password: "password123",
      role: "respondent",
    },
  ];

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", foundUser.email);
      localStorage.setItem("userRole", foundUser.role);
      router.push("/calendar");
    } else {
      setError("Invalid credentials");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#005186]">
          Login
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 px-3 py-2 rounded border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm mb-1 text-black">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded text-black placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@demo.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-1 text-black">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded text-black placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded text-white"
            style={{ backgroundColor: "#fbb04c", color: "#005186" }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
