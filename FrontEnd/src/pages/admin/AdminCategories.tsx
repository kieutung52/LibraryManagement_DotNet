import React, { useEffect, useState, FormEvent } from 'react';
import { categoryService } from '../../services/deployment/categoryService';
import { CategoryResponse } from '../../types/typeEntity';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../../types/typeRequest';

// Modal component (đơn giản)
const Modal = ({ children, onClose }: { children: React.ReactNode, onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-lg">
      <div className="p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">&times;</button>
        {children}
      </div>
    </div>
  </div>
);

// Form Danh mục
const CategoryForm = ({
  category,
  onSubmit,
  onClose
}: {
  category?: CategoryResponse | null,
  onSubmit: (data: CreateCategoryRequest | UpdateCategoryRequest) => Promise<void>,
  onClose: () => void
}) => {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { name, description: description || undefined }; // Gửi undefined nếu rỗng
      await onSubmit(data);
    } catch (err) {
      console.error(err);
      alert(`Lỗi: ${err instanceof Error ? err.message : 'Lỗi không xác định'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">{category ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h2>
      <input type="text" placeholder="Tên danh mục" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded" />
      <textarea placeholder="Mô tả" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded" />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Hủy</button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50">
          {loading ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </form>
  );
};

export const AdminCategories = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleOpenEdit = (category: CategoryResponse) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này? (Nếu danh mục có sách, sẽ bị lỗi)')) {
      try {
        await categoryService.deleteCategory(id);
        await loadData();
      } catch (err: any) {
        alert(`Lỗi: ${err.message}`);
      }
    }
  };

  const handleSubmitForm = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
    if (editingCategory) {
      await categoryService.updateCategory(editingCategory.categoryID, data as UpdateCategoryRequest);
    } else {
      await categoryService.createCategory(data as CreateCategoryRequest);
    }
    await loadData();
    setShowModal(false);
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý Danh mục</h1>
        <button onClick={handleOpenCreate} className="px-4 py-2 bg-black text-white rounded-lg">Thêm danh mục</button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Tên danh mục</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Mô tả</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map(cat => (
              <tr key={cat.categoryID}>
                <td className="p-4">{cat.name}</td>
                <td className="p-4">{cat.description || '-'}</td>
                <td className="p-4">
                  <button onClick={() => handleOpenEdit(cat)} className="text-sm text-blue-600 mr-2">Sửa</button>
                  <button onClick={() => handleDelete(cat.categoryID)} className="text-sm text-red-600">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <CategoryForm
            category={editingCategory}
            onSubmit={handleSubmitForm}
            onClose={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};
