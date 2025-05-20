"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("arbitrator@demo.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  const users = [
    {
      email: "arbitrator@demo.com",
      password: "password123",
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-2">
      <div className="bg-white shadow-md rounded-md p-6 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-[#005186] mb-4">
          Sign In
        </h2>

        {error && (
          <div
            className="mb-3 text-sm text-red-600 bg-red-100 px-3 py-2 rounded border border-red-300"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#fbb04c] text-sm text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#fbb04c] text-sm text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-sm rounded text-white font-medium transition duration-200 hover:opacity-90"
            style={{ backgroundColor: "#fbb04c" }}
          >
            Login
          </button>
        </form>

        {/* Test Accounts */}
        <div className="mt-6 border-t pt-3">
          <h3 className="text-xs font-semibold mb-2 text-gray-700">
            Test Accounts
          </h3>

          <div className="bg-gray-100 rounded p-3 text-xs font-mono text-gray-800 space-y-2">
            <div>
              <span className="font-semibold text-[#005186]">Arbitrator</span>
              <br />
              Email: <code>arbitrator@demo.com</code>
              <br />
              Password: <code>password123</code>
            </div>

            <div>
              <span className="font-semibold text-[#005186]">Claimant</span>
              <br />
              Email: <code>claimant@demo.com</code>
              <br />
              Password: <code>password123</code>
            </div>

            <div>
              <span className="font-semibold text-[#005186]">Respondent</span>
              <br />
              Email: <code>respondent@demo.com</code>
              <br />
              Password: <code>password123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
