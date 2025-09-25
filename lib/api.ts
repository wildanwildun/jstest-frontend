export const API_URL = "http://localhost:8000/api" // ganti sesuai Laravel kamu

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) throw new Error("Login gagal")

  return res.json() // biasanya { token: "xxx" }
}

export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })

  if (!res.ok) throw new Error("Register gagal")

  return res.json()
}
