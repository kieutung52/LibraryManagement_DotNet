import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import { Category } from '../types/typeEntity';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { FolderOpen, BookOpen, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        setError((err as Error).message || 'Không thể tải danh mục');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl mb-2">Danh mục sách</h1>
        <p className="text-muted-foreground">Khám phá các thể loại sách khác nhau</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg mb-2">Không có danh mục nào</h3>
            <p className="text-muted-foreground">
              Hiện tại chưa có danh mục sách nào được tạo
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.categoryID} className="hover:shadow-lg transition-shadow group">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FolderOpen className="w-5 h-5 text-primary" />
                  <span>{category.name}</span>
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {category.description || ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  to={`/books?categoryId=${category.categoryID}`}
                  className="inline-flex items-center space-x-2 text-primary hover:underline group-hover:text-primary/80 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Xem sách trong danh mục</span>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Statistics */}
      <Card className="bg-muted/50">
        <CardHeader className="text-center">
          <CardTitle>Thống kê danh mục</CardTitle>
          <CardDescription>
            Tổng quan về các danh mục sách trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl text-primary mb-2">{categories.length}</div>
              <div className="text-muted-foreground">Tổng danh mục</div>
            </div>
            <div>
              <div className="text-3xl text-primary mb-2">1,250+</div>
              <div className="text-muted-foreground">Tổng đầu sách</div>
            </div>
            <div>
              <div className="text-3xl text-primary mb-2">3,500+</div>
              <div className="text-muted-foreground">Tổng bản sao</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}