import React, { useEffect, useState } from 'react';
import { categoryService } from '../services/deployment/categoryService';
import { CategoryResponse } from '../types/typeEntity';

export const Categories = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
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
    fetchCategories();
  }, []);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Danh mục</h1>
      <div className="space-y-4">
        {categories.map(cat => (
          <div key={cat.categoryID} className="p-4 bg-white rounded-xl shadow-md">
            <h3 className="text-lg font-bold">{cat.name}</h3>
            <p className="text-sm text-gray-600">{cat.description || 'Không có mô tả'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
