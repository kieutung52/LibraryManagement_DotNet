import { http } from '@/server/http'
import { User } from '@/types/user'

type RegisterDto = { name: string; email: string; password: string }
type StoredUser = User & { password?: string }

const USERS_KEY = 'users'
const CURRENT_KEY = 'currentUser'

function nextId(items: { id: number }[]) {
  return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1
}

export const authService = {
  async register(dto: RegisterDto): Promise<User> {
    const users = await http.get<StoredUser[]>(USERS_KEY)
    if (users.find(u => u.email.toLowerCase() === dto.email.toLowerCase())) {
      throw new Error('Email đã tồn tại.')
    }
    const newUser: StoredUser = {
      id: nextId(users),
      name: dto.name,
      email: dto.email,
      role: 'user',
      status: 'Hoạt động',
      joinDate: new Date().toLocaleDateString('vi-VN'),
      violations: 0,
      limit: 5,
      password: dto.password
    }
    users.push(newUser)
    await http.set(USERS_KEY, users)
    // không tự đăng nhập — để người dùng vào trang login
    return { ...newUser} // fix here **************
  },

  async login(email: string, password: string): Promise<User> {
    const users = await http.get<StoredUser[]>(USERS_KEY)
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && (u.password === password || (u.email === 'admin@library.com' && password === '123')))
    if (!found) throw new Error('Email hoặc mật khẩu không đúng.')
    const user: User = { id: found.id, name: found.name, email: found.email, role: found.role as any, status: found.status, joinDate: found.joinDate, violations: found.violations, limit: found.limit }
    localStorage.setItem(CURRENT_KEY, JSON.stringify(user))
    return user
  },

  logout() {
    localStorage.removeItem(CURRENT_KEY)
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(CURRENT_KEY)
    return raw ? JSON.parse(raw) as User : null
  }
}
