"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import FormInput from "@/components/FormInput"
import Button from "@/components/Button"
import { login } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = await login(email, password)
      // console.log(data.access_token)

      localStorage.setItem("token", data.access_token)
      router.push("/dashboard")
    } catch (err) {
      setError("Email atau password salah")
    }
  }


  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <FormInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit">Login</Button>
        </form>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        <p className="mt-4 text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  )
}
