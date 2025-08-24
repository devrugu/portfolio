"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); // Clear previous errors

    const username = event.currentTarget.username.value;
    const password = event.currentTarget.password.value;

    const result = await signIn("credentials", {
      redirect: false, // We will handle the redirect manually
      username,
      password,
    });

    if (result?.ok) {
      // On successful login, redirect to the admin dashboard
      router.push("/admin");
    } else {
      // On failed login, show an error message
      setError("Invalid username or password.");
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-8">Admin Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        <div>
          <label className="block text-on-background mb-1" htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-on-background mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-accent text-on-primary font-bold py-2 px-4 rounded-lg hover:bg-accent-hover transition-colors"
        >
          Log In
        </button>
      </form>
    </div>
  );
}