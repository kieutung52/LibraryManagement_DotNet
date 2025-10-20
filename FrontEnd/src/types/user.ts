export type Role = 'admin' | 'user'

export type User = {
  id: number
  name: string
  email: string
  role: Role
  status?: string
  joinDate?: string
  violations?: number
  limit?: number
}
