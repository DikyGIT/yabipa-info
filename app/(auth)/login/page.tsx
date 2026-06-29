"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Username atau password salah");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1">
      <div className="lg:block hidden">
        <Image
          src="/images/login-img.webp"
          alt="login"
          width={600}
          height={500}
          loading="eager"
          className="w-auto h-auto"
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/images/logo.webp"
          alt="logo"
          width={50}
          height={50}
          className="w-auto h-auto"
        />
        <h1 className="text-4xl font-bold mb-10 mt-5">Masuk</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 lg:w-auto w-full"
        >
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="Masukkan Username"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="Masukkan Password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-900 hover:cursor-pointer disabled:opacity-50"
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
