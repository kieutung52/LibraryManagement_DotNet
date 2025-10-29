using AutoMapper;
using LibraryMangement.Data;
using LibraryMangement.Models;
using LibraryMangement.Request;
using LibraryMangement.Response;

using Microsoft.EntityFrameworkCore;

namespace LibraryMangement.Service;

public class BookService : IBookService
{
    private readonly LibraryContext _context;
    private readonly IMapper _mapper;

    public BookService(LibraryContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<BookResponse> CreateBookAsync(CreateBookRequest request)
    {
        var book = _mapper.Map<Book>(request);
        // Khi tạo sách mới, số lượng có sẵn = tổng số lượng
        book.AvailableQuantity = request.TotalQuantity;
        
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        
        // Load category để response có tên
        await _context.Entry(book).Reference(b => b.Category).LoadAsync();
        
        return _mapper.Map<BookResponse>(book);
    }

    public async Task<BooleanResponse> DeleteBookAsync(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return new BooleanResponse(false);

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();
        return new BooleanResponse(true);
    }

    public async Task<IEnumerable<BookResponse>> GetAllBooksAsync()
    {
        var books = await _context.Books
            .Include(b => b.Category) // Lấy kèm thông tin Category
            .ToListAsync();
        return _mapper.Map<IEnumerable<BookResponse>>(books);
    }

    public async Task<BookResponse?> GetBookByIdAsync(int id)
    {
        var book = await _context.Books
            .Include(b => b.Category)
            .FirstOrDefaultAsync(b => b.BookID == id);
        
        return book == null ? null : _mapper.Map<BookResponse>(book);
    }

    public async Task<BooleanResponse> UpdateBookAsync(int id, UpdateBookRequest request)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return new BooleanResponse(false);

        _mapper.Map(request, book);
        _context.Books.Update(book);
        await _context.SaveChangesAsync();
        return new BooleanResponse(true);
    }
}