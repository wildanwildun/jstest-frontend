"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import FormInput from "@/components/FormInput"
import Button from "@/components/Button"
import { register } from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(name, email, password)
      router.push("/login")
    } catch (err) {
      setError("Register gagal")
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-6">Register</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <FormInput label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <FormInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit">Register</Button>
        </form>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        <p className="mt-4 text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  )
}
