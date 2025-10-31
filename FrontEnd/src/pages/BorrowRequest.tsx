
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { bookService } from '../services/bookService';
import { borrowingService } from '../services/borrowingService';

import { categoryService } from '../services/categoryService'; 
import { Book, Category } from '../types/typeEntity';
import { BorrowingBookRequest, CreateBorrowingRequest } from '../types/typeRequest';
import { toast } from 'sonner';


import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';


import {
  Search,
  BookOpen,
  User,
  Calendar,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  XCircle,
  CheckCircle,
  PlusCircle,
  MinusCircle,
} from 'lucide-react';

export function BorrowRequest() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  
  
  const [cart, setCart] = useState<Map<number, BorrowingBookRequest>>(new Map());
  const [submitting, setSubmitting] = useState(false);

  
  const borrowLimit = useMemo(() => user?.userData?.limitBorrow ?? 5, [user]);

  
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để mượn sách');
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksData, categoriesData] = await Promise.all([
          bookService.getAllBooks(),
          categoryService.getAllCategories(), 
        ]);
        setAllBooks(booksData);
        setCategories(categoriesData);
      } catch (err: any) {
        setError(err.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  
  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('categoryId') || 'all';
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 12; 

  const filteredBooks = useMemo(() => {
    let books = allBooks;
    if (search) {
      books = books.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (categoryId && categoryId !== 'all') {
      books = books.filter(book => book.categoryID === parseInt(categoryId));
    }
    return books;
  }, [allBooks, search, categoryId]);

  const total = filteredBooks.length;
  const totalPages = Math.ceil(total / pageSize);

  const displayedBooks = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredBooks.slice(startIndex, startIndex + pageSize);
  }, [filteredBooks, page, pageSize]);

  
  const handleSearch = (value: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      value ? newParams.set('search', value) : newParams.delete('search');
      newParams.set('page', '1');
      return newParams;
    });
  };

  const handleCategoryFilter = (value: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      value && value !== 'all' ? newParams.set('categoryId', value) : newParams.delete('categoryId');
      newParams.set('page', '1');
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

  

  const handleAddToCart = (book: Book) => {
    if (cart.size >= borrowLimit) {
      toast.error(`Bạn chỉ có thể chọn tối đa ${borrowLimit} tựa sách khác nhau.`);
      return;
    }
    if (book.availableQuantity < 1) {
      toast.error("Sách này đã hết hàng.");
      return;
    }
    
    
    setCart(prevCart => {
      const newCart = new Map(prevCart);
      newCart.set(book.bookID, { bookID: book.bookID, quantity: 1 });
      return newCart;
    });
    toast.success(`Đã thêm "${book.title}" vào yêu cầu mượn.`);
  };

  const handleRemoveFromCart = (bookID: number) => {
    setCart(prevCart => {
      const newCart = new Map(prevCart);
      newCart.delete(bookID);
      return newCart;
    });
  };

  const handleQuantityChange = (bookID: number, newQuantityStr: string) => {
    const bookData = allBooks.find(b => b.bookID === bookID);
    if (!bookData) return;

    let newQuantity = parseInt(newQuantityStr) || 1; 

    if (newQuantity < 1) {
      newQuantity = 1;
    }

    if (newQuantity > bookData.availableQuantity) {
      newQuantity = bookData.availableQuantity;
      toast.info(`Số lượng sách "${bookData.title}" còn lại không đủ (Còn: ${bookData.availableQuantity})`);
    }

    setCart(prevCart => {
      const newCart = new Map(prevCart);
      const currentItem = newCart.get(bookID);
      if (currentItem) {
        newCart.set(bookID, { ...currentItem, quantity: newQuantity });
      }
      return newCart;
    });
  };
  
  
  
  const handleSubmit = async () => {
    if (!user) {
      toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      return;
    }
    if (cart.size === 0) {
      toast.error("Vui lòng chọn ít nhất một cuốn sách.");
      return;
    }

    const booksToRequest: BorrowingBookRequest[] = [...cart.values()];

    
    for (const item of booksToRequest) {
      if (item.quantity < 1) {
        toast.error("Số lượng mượn phải lớn hơn 0.");
        return;
      }
      const bookData = allBooks.find(b => b.bookID === item.bookID);
      if (item.quantity > (bookData?.availableQuantity ?? 0)) {
         toast.error(`Sách "${bookData?.title}" không đủ số lượng.`);
         return;
      }
    }
    
    const request: CreateBorrowingRequest = {
      accountID: user.accountID,
      books: booksToRequest,
    };

    setSubmitting(true);
    try {
      await borrowingService.createBorrowing(request);
      toast.success("Yêu cầu mượn sách đã được gửi thành công!");
      setCart(new Map()); 
      navigate('/my-borrowings'); 
    } catch (err: any) {
      toast.error(err.message || 'Không thể gửi yêu cầu mượn sách');
    } finally {
      setSubmitting(false);
    }
  };

  
  const selectedBooksData = useMemo(() => {
    return [...cart.values()].map(item => {
      const bookDetails = allBooks.find(b => b.bookID === item.bookID);
      return {
        ...item,
        details: bookDetails, 
      };
    }).filter(item => item.details); 
  }, [cart, allBooks]);

  
  
  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      <div className="text-center">
        <h1 className="text-3xl mb-2">Tạo yêu cầu mượn sách</h1>
        <p className="text-muted-foreground">Tìm kiếm và chọn sách bạn muốn mượn</p>
      </div>

      {/* Thông tin giới hạn mượn */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl text-primary mb-1">{borrowLimit}</div>
              <div className="text-sm text-muted-foreground">Giới hạn tựa sách</div>
            </div>
            <div>
              <div className="text-2xl text-primary mb-1">{cart.size}</div>
              <div className="text-sm text-muted-foreground">Đã chọn</div>
            </div>
            <div>
              <div className="text-2xl text-muted-foreground mb-1">
                {borrowLimit - cart.size}
              </div>
              <div className="text-sm text-muted-foreground">Còn lại</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* === CỘT BÊN TRÁI: DANH SÁCH SÁCH === */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filter */}
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

          {/* Book List Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader><Skeleton className="h-4 w-3/4" /></CardHeader>
                  <CardContent><Skeleton className="h-16 w-full" /></CardContent>
                </Card>
              ))}
            </div>
          ) : displayedBooks.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg mb-2">Không tìm thấy sách</h3>
                <p className="text-muted-foreground">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedBooks.map((book) => {
                const isInCart = cart.has(book.bookID);
                const isAvailable = book.availableQuantity > 0;
                const limitReached = cart.size >= borrowLimit;

                return (
                  <Card key={book.bookID} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-base">{book.title}</CardTitle>
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
                      <div className="text-sm">
                        <span className="text-muted-foreground">Còn lại: </span>
                        <span className={isAvailable ? 'text-green-600' : 'text-red-600'}>
                          {book.availableQuantity}/{book.totalQuantity}
                        </span>
                      </div>
                      
                      {/* Nút Thêm/Xóa */}
                      {isInCart ? (
                        <Button variant="outline" size="sm" className="w-full" onClick={() => handleRemoveFromCart(book.bookID)}>
                          <MinusCircle className="w-4 h-4 mr-2" />
                          Xóa khỏi yêu cầu
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="w-full" 
                          onClick={() => handleAddToCart(book)}
                          disabled={!isAvailable || limitReached}
                        >
                          <PlusCircle className="w-4 h-4 mr-2" />
                          { !isAvailable ? "Đã hết sách" : (limitReached ? "Đã đạt giới hạn" : "Thêm vào yêu cầu") }
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {total > 0 ? (page - 1) * pageSize + 1 : 0}-{Math.min(page * pageSize, total)} / {total} sách
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm">Trang {page} / {totalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* === CỘT BÊN PHẢI: GIỎ HÀNG (CART) === */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Yêu cầu mượn</span>
              </CardTitle>
              <CardDescription>
                {cart.size} tựa sách đã chọn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedBooksData.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Chưa chọn sách nào
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {selectedBooksData.map((item) => (
                    <div key={item.bookID} className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <h5 className="line-clamp-2 text-sm font-medium leading-snug">
                          {item.details?.title}
                        </h5>
                        <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => handleRemoveFromCart(item.bookID)}>
                          <XCircle className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.details?.author}</p>
                      <div className="flex items-center justify-between">
                         <label htmlFor={`qty-${item.bookID}`} className="text-sm">Số lượng:</label>
                         <Input
                           id={`qty-${item.bookID}`}
                           type="number"
                           value={item.quantity}
                           onChange={(e) => handleQuantityChange(item.bookID, e.target.value)}
                           min={1}
                           max={item.details?.availableQuantity}
                           className="w-20 h-8"
                         />
                      </div>
                       <div className="text-xs text-muted-foreground text-right">
                         (Có sẵn: {item.details?.availableQuantity})
                       </div>
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              <Button
                onClick={handleSubmit}
                disabled={cart.size === 0 || submitting}
                className="w-full"
              >
                {submitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Đang gửi...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Gửi yêu cầu mượn</span>
                  </div>
                )}
              </Button>
              <div className="text-xs text-muted-foreground text-center">
                Yêu cầu sẽ được xem xét và phê duyệt
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}