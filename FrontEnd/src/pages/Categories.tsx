import { FormEvent, useEffect, useState } from 'react'
import { categoriesService } from '../services/categories'
import { Category } from '../types/category'

export default function Categories() {
  const [items, setItems] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const load = async () => {
    const cats = await categoriesService.getAll()
    setItems(cats)
  }

  useEffect(() => { load() }, [])

  const add = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    await categoriesService.add({ name, description })
    setName(''); setDescription('')
    load()
  }

  const remove = async (id: number) => {
    if (!confirm('Xóa danh mục này?')) return
    await categoriesService.remove(id)
    load()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Danh mục sách</h1>
        <p className="text-gray-500">Khám phá và quản lý thể loại sách</p>
      </div>

      <form onSubmit={add} className="bg-white rounded-xl shadow-md p-6 grid md:grid-cols-3 gap-4">
        <input
          className="p-3 border rounded-lg bg-gray-100 focus:ring-black focus:border-black"
          placeholder="Tên danh mục"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="p-3 border rounded-lg bg-gray-100 focus:ring-black focus:border-black md:col-span-2"
          placeholder="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="md:col-start-3 bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg">
          Thêm danh mục
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(cat => (
          <div key={cat.id} className="p-6 bg-white border border-gray-200 rounded-xl shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{cat.name}</h3>
              <p className="text-gray-600 mb-4">{cat.description}</p>
              <p className="text-sm font-medium text-gray-500">Số lượng đầu sách: {cat.bookCount ?? 0}</p>
            </div>
            <div className="pt-4">
              <button
                onClick={() => remove(cat.id)}
                className="w-full text-center py-2 rounded-lg font-medium bg-gray-100 text-black hover:bg-gray-200 transition-colors"
              >
                Xóa danh mục
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
