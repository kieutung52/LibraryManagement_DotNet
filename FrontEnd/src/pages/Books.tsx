import React, { useEffect, useState, useMemo } from 'react'; // Thêm useMemo
import { useSearchParams, Link } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { Book } from '../types/typeEntity';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Search, BookOpen, User, Calendar, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { categoryService } from '../services/categoryService';
import { Category } from '../types/typeEntity';

export const Books = () => {
  const [allBooks, setAllBooks] = useState<Book[]>([]); 
  const [categories, setCategories] = useState<Category[]>([]); 
  const [searchParams, setSearchParams] = useSearchParams(); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 

  // Đọc các tham số từ URL
  const search = searchParams.get('search') || ''; 
  const categoryId = searchParams.get('categoryId') || 'all'; 
  const page = parseInt(searchParams.get('page') || '1'); 
  const pageSize = 20; // Giữ nguyên
  
  // Xóa: const total = allBooks.length; (Đây là lỗi logic)

  // useEffect để tải dữ liệu ban đầu (Không đổi)
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await bookService.getAllBooks(); 
        setAllBooks(data); 
      } catch (err: any) {
        setError(err.message || 'Không thể tải sách'); 
      } finally {
        setLoading(false); 
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories(); 
        setCategories(data); 
      } catch (err) {
        console.error('Failed to fetch categories'); 
      }
    };

    fetchBooks();
    fetchCategories();
  }, []); 

  // Xóa: useEffect 
  
  // === SỬA LOGIC: Dùng useMemo để tính toán danh sách đã lọc ===
  // Việc này giúp tối ưu, chỉ tính toán lại khi allBooks, search, hoặc categoryId thay đổi
  const filteredBooks = useMemo(() => {
    let books = allBooks;

    // 1. Lọc theo tìm kiếm
    if (search) { 
      books = books.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 2. Lọc theo danh mục
    if (categoryId && categoryId !== 'all') { 
      books = books.filter(book => book.categoryID === parseInt(categoryId));
    }
    
    return books;
  }, [allBooks, search, categoryId]); // Phụ thuộc

  // === SỬA LOGIC: Tính toán phân trang dựa trên filteredBooks ===
  
  // 1. Sửa lỗi `total`: Phải tính total dựa trên số sách đã lọc
  const total = filteredBooks.length;
  
  // 2. Tính totalPages dựa trên total mới
  const totalPages = Math.ceil(total / pageSize); 

  // 3. Dùng useMemo để lấy danh sách hiển thị (đã phân trang)
  const displayedBooks = useMemo(() => {
    const startIndex = (page - 1) * pageSize; 
    const endIndex = startIndex + pageSize;
    return filteredBooks.slice(startIndex, endIndex); 
  }, [filteredBooks, page, pageSize]); // Phụ thuộc

  // Các hàm xử lý sự kiện (Không đổi)
  const handleSearch = (value: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value) {
        newParams.set('search', value);
      } else {
        newParams.delete('search');
      }
      newParams.set('page', '1'); // Reset về trang 1 khi tìm kiếm
      return newParams;
    });
  }; 

  const handleCategoryFilter = (value: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value && value !== 'all') {
        newParams.set('categoryId', value);
      } else {
        newParams.delete('categoryId');
      }
      newParams.set('page', '1'); // Reset về trang 1 khi lọc
      return newParams;
    });
  }; 

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', newPage.toString());
      return newParams;
    });
  }; 

  // Xóa: Logic tính toán `displayedBooks`  ở đây vì đã chuyển lên useMemo

  return (
    <div className="space-y-6"> 
      <div className="text-center">
        <h1 className="text-3xl mb-2">Danh sách sách</h1>
        <p className="text-muted-foreground">Khám phá thư viện sách phong phú</p>
      </div>

      {/* Search and Filter (Không đổi) */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" /> 
              <Input
                placeholder="Tìm kiếm sách theo tên hoặc tác giả..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              /> 
            </div>
            <Select value={categoryId} onValueChange={handleCategoryFilter}> 
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent> 
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.categoryID} value={category.categoryID.toString()}> 
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert (Không đổi) */}
      {error && (
        <Alert variant="destructive"> 
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Books Grid */}
      {loading ? (
        // Skeleton (Không đổi)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> 
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : displayedBooks.length === 0 ? ( // Sửa: Dùng displayedBooks
        // Không tìm thấy sách (Không đổi)
        <Card> 
          <CardContent className="pt-6 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg mb-2">Không tìm thấy sách</h3>
            <p className="text-muted-foreground">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </CardContent>
        </Card>
      ) : (
        // Hiển thị sách (Sửa: dùng displayedBooks)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedBooks.map((book) => (
            <Card key={book.bookID} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2 text-base">
                  {book.title}
                </CardTitle>
                <CardDescription className="flex items-center space-x-2">
                  <User className="w-3 h-3" />
                  <span className="line-clamp-1">{book.author}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3 text-muted-foreground" /> 
                    <span className="text-sm text-muted-foreground">{book.publicationYear || 'N/A'}</span> 
                  </div>
                  <Badge variant="secondary">{book.categoryName || 'N/A'}</Badge> 
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Còn lại: </span>
                    <span className={book.availableQuantity > 0 ? 'text-green-600' : 'text-red-600'}> 
                      {book.availableQuantity}/{book.totalQuantity}
                    </span>
                  </div>
                  <Button size="sm" asChild>
                    <Link to={`/books/${book.bookID}`}> 
                      Xem chi tiết
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination (Sửa: Dùng `total` đã sửa lỗi) */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {/* Sửa: Thêm logic_
                 kiểm tra 'total > 0' để tránh hiển thị "1-0" */}
                Hiển thị {total > 0 ? (page - 1) * pageSize + 1 : 0}-{Math.min(page * pageSize, total)} trong tổng số {total} sách 
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1} 
                >
                  <ChevronLeft className="w-4 h-4" /> 
                  Trước
                </Button>
                
                {/* Logic tạo nút phân trang (Không đổi) */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => { 
                    const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i; 
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handlePageChange(pageNum)} 
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)} 
                  disabled={page >= totalPages} 
                >
                  Sau
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}