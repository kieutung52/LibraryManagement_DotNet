import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import { bookService } from '../../services/bookService'; 
import { categoryService } from '../../services/categoryService'; 
import { Book, Category } from '../../types/typeEntity'; 
import { CreateBookRequest, UpdateBookRequest } from '../../types/typeRequest';

export function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]); 
  const [categories, setCategories] = useState<Category[]>([]); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedCategory, setSelectedCategory] = useState<string>('all'); 
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const [editingBook, setEditingBook] = useState<Book | null>(null); 
  
  // State cho form
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    categoryID: 0, // Sửa: Xóa categoryName, chỉ dùng categoryID
    description: '',
    totalQuantity: 1,
    availableQuantity: 1,
    publicationYear: new Date().getFullYear(),
    publisher: '',
    coverImage: '',
  });

  useEffect(() => {
    loadBooks(); 
    loadCategories(); 
  }, []);

  const loadBooks = async () => {
    try {
      const response = await bookService.getAllBooks(); 
      setBooks(response); 
    } catch (error) {
      toast.error('Không thể tải danh sách sách'); 
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAllCategories(); 
      setCategories(response); 
    } catch (error) {
      toast.error('Không thể tải danh sách danh mục'); 
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm); 
    const matchesCategory = selectedCategory === 'all' || book.categoryID.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      categoryID: 0,
      description: '',
      totalQuantity: 1,
      availableQuantity: 1,
      publicationYear: new Date().getFullYear(),
      publisher: '',
      coverImage: '',
    });
    setEditingBook(null); 
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book); 
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      categoryID: book.categoryID,
      description: book.description,
      totalQuantity: book.totalQuantity,
      availableQuantity: book.availableQuantity,
      publicationYear: book.publicationYear,
      publisher: book.publisher,
      coverImage: book.coverImage,
    });
    setIsDialogOpen(true); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    try {
      if (editingBook) {
        const updateData: UpdateBookRequest = {
          title: formData.title,
          author: formData.author,
          categoryID: formData.categoryID === 0 ? null : formData.categoryID, 
          publicationYear: formData.publicationYear,
          totalQuantity: formData.totalQuantity,
          availableQuantity: formData.availableQuantity,
        };
        await bookService.updateBook(editingBook.bookID as number, updateData); 
        toast.success('Cập nhật sách thành công'); 
      } else {
        // Tuân theo CreateBookRequest DTO 
        const createData: CreateBookRequest = {
          isbn: formData.isbn,
          title: formData.title,
          author: formData.author,
          categoryID: formData.categoryID === 0 ? null : formData.categoryID, 
          publicationYear: formData.publicationYear,
          totalQuantity: formData.totalQuantity,
        };
        await bookService.createBook(createData); 
        toast.success('Thêm sách thành công'); 
      }
      
      loadBooks(); 
      setIsDialogOpen(false); 
      resetForm(); 
    } catch (error) {
      toast.error(editingBook ? 'Không thể cập nhật sách' : 'Không thể thêm sách'); 
    }
  };

  const handleDelete = async (bookId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sách này?')) return; 
    
    try {
      await bookService.deleteBook(bookId); 
      toast.success('Xóa sách thành công'); 
      loadBooks(); 
    } catch (error) {
      toast.error('Không thể xóa sách'); 
    }
  };

  const getStatusBadge = (available: number, total: number) => {
    if (available === 0) {
      return <Badge variant="destructive">Hết sách</Badge>; 
    } else if (available < total * 0.3) {
      return <Badge variant="secondary">Sắp hết</Badge>; 
    } else {
      return <Badge variant="default">Còn sách</Badge>; 
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Quản lý sách</h1>
          <p className="text-muted-foreground">Quản lý toàn bộ sách trong thư viện</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}> 
              <Plus className="w-4 h-4 mr-2" />
              Thêm sách mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBook ? 'Chỉnh sửa sách' : 'Thêm sách mới'} 
              </DialogTitle>
              <DialogDescription>
                {editingBook ? 'Cập nhật thông tin sách' : 'Thêm sách mới vào thư viện'} 
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4"> 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tên sách *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author">Tác giả *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })} 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN *</Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} 
                    required
                    // Sửa: Chỉ cho phép sửa ISBN khi thêm mới
                    disabled={!!editingBook} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Danh mục *</Label>
                  <Select
                    value={formData.categoryID.toString()} 
                    onValueChange={(value: string) => setFormData({ ...formData, categoryID: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0" disabled>Chọn danh mục</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.categoryID} value={category.categoryID.toString()}> 
                          {category.name} 
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="publisher">Nhà xuất bản</Label>
                  <Input
                    id="publisher"
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="publishedYear">Năm xuất bản</Label>
                  <Input
                    id="publishedYear"
                    type="number"
                    min="1000" 
                    max={new Date().getFullYear()} 
                    value={formData.publicationYear}
                    onChange={(e) => setFormData({ ...formData, publicationYear: parseInt(e.target.value) || 0 })} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="totalCopies">Tổng số bản</Label>
                  <Input
                    id="totalCopies"
                    type="number"
                    min="1" 
                    value={formData.totalQuantity} 
                    onChange={(e) => {
                      const total = parseInt(e.target.value) || 0; 
                      setFormData({ 
                        ...formData, 
                        totalQuantity: total,
                        availableQuantity: Math.min(formData.availableQuantity, total) 
                      });
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="availableCopies">Số bản có sẵn</Label>
                  <Input
                    id="availableCopies"
                    type="number"
                    min="0" 
                    max={formData.totalQuantity} 
                    value={formData.availableQuantity} 
                    onChange={(e) => setFormData({ ...formData, availableQuantity: parseInt(e.target.value) || 0 })} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coverImage">URL ảnh bìa</Label>
                <Input
                  id="coverImage"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })} 
                  placeholder="https://example.com/cover.jpg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}> 
                  Hủy
                </Button>
                <Button type="submit"> 
                  {editingBook ? 'Cập nhật' : 'Thêm sách'} 
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách sách</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4"> 
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên sách, tác giả hoặc ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-9"
              />
            </div>
            {/* Sửa: Bộ lọc danh mục theo ID */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}> 
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Chọn danh mục" /> 
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem> 
                {categories.map(category => (
                  // Sửa: value phải là categoryID (dưới dạng string)
                  <SelectItem key={category.categoryID} value={category.categoryID.toString()}> 
                    {category.name} 
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên sách</TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground"> 
                      Không tìm thấy sách nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBooks.map((book) => {
                    // Tìm category name từ list categories đã tải
                    const category = categories.find(c => c.categoryID === book.categoryID); 
                    return (
                      <TableRow key={book.bookID}> 
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {book.coverImage && (
                              <img
                                src={book.coverImage} 
                                alt={book.title}
                                className="w-10 h-12 object-cover rounded" 
                              />
                            )}
                            <div>
                              <div>{book.title}</div> 
                              <div className="text-sm text-muted-foreground">
                                {book.publisher} • {book.publicationYear} 
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{book.author}</TableCell> 
                        <TableCell className="font-mono text-sm">{book.isbn}</TableCell> 
                        <TableCell>
                          <Badge variant="outline">
                            {/* Sửa: Hiển thị category.name tìm được */}
                            {category?.name || 'Không có'} 
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(book.availableQuantity, book.totalQuantity)} 
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Có sẵn: {book.availableQuantity}</div> 
                            <div className="text-muted-foreground">Tổng: {book.totalQuantity}</div> 
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="icon" 
                              onClick={() => handleEdit(book)} 
                            >
                              <Edit className="w-4 h-4" /> 
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon" 
                              onClick={() => handleDelete(book.bookID)} 
                              className="text-destructive hover:text-destructive" 
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}