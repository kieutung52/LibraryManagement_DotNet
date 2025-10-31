// Tệp: ../FrontEnd/src/pages/BookDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { Book } from '../types/typeEntity';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  ArrowLeft, 
  BookOpen, 
  User, 
  Calendar, 
  Hash, 
  FolderOpen, 
  CheckCircle, 
  XCircle,
  AlertTriangle 
} from 'lucide-react';
import { categoryService } from '../services/categoryService';
import { Category } from '../types/typeEntity';

export const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchBook = async () => {
      try {
        setLoading(true);
        const data = await bookService.getBookById(Number(id));
        setBook(data);

        // Fetch category details if categoryID exists
        if (data.categoryID) {
          try {
            const catData = await categoryService.getCategoryById(data.categoryID);
            setCategory(catData);
          } catch (catErr) {
            console.error('Failed to fetch category');
          }
        }
      } catch (err: any) {
        setError(err.message || 'Không tìm thấy sách');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" asChild>
          <Link to="/books">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl">{book.title}</h1>
          <p className="text-muted-foreground">Chi tiết thông tin sách</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Book Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Thông tin sách</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tên sách</label>
                  <p className="text-lg">{book.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tác giả</label>
                  <p className="text-lg flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {book.author}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Năm xuất bản</label>
                  <p className="text-lg flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {book.publicationYear || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ISBN</label>
                  <p className="text-lg flex items-center">
                    <Hash className="w-4 h-4 mr-2" />
                    {book.isbn}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Danh mục</label>
                <div className="flex items-center space-x-2 mt-1">
                  <FolderOpen className="w-4 h-4" />
                  <Badge variant="secondary">{book.categoryName || category?.name || 'N/A'}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{category?.description || ''}</p>
              </div>
            </CardContent>
          </Card>

          {/* Copies List - Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách bản sao</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Placeholder for book copies list</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Availability Status */}
          <Card>
            <CardHeader>
              <CardTitle>Tình trạng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl text-primary mb-2">
                  {book.availableQuantity}
                </div>
                <div className="text-sm text-muted-foreground">Số sách có sẵn</div>
              </div>
              
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl text-muted-foreground mb-2">
                  {book.totalQuantity}
                </div>
                <div className="text-sm text-muted-foreground">Tổng số sách</div>
              </div>

              {book.availableQuantity > 0 ? (
                <Button className="w-full" asChild>
                  <Link to="/borrowings/request">
                    Mượn sách này
                  </Link>
                </Button>
              ) : (
                <Button className="w-full" disabled variant="outline">
                  <XCircle className="w-4 h-4 mr-2" />
                  Hiện không có sẵn
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}