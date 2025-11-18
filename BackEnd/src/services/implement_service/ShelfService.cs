using AutoMapper;
using LibraryMangement.Data;
using LibraryMangement.EnumData;
using LibraryMangement.Models;
using LibraryMangement.Request;
using LibraryMangement.Response;
using Microsoft.EntityFrameworkCore;

namespace LibraryMangement.Service;

public class ShelfService : IShelfService
{
    private readonly LibraryContext _context;
    private readonly IMapper _mapper;

    public ShelfService(LibraryContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ShelfResponse>> GetAllShelvesAsync()
    {
        var shelves = await _context.Shelves.ToListAsync();
        // Đồng bộ lại số lượng sách thực tế trên từng kệ
        foreach (var shelf in shelves)
        {
            await UpdateShelfStatus(shelf);
            _context.Shelves.Update(shelf);
        }
        await _context.SaveChangesAsync();
        return _mapper.Map<IEnumerable<ShelfResponse>>(shelves);
    }

    public async Task<ShelfResponse?> GetShelfByIdAsync(int id)
    {
        var shelf = await _context.Shelves.FindAsync(id);
        return shelf == null ? null : _mapper.Map<ShelfResponse>(shelf);
    }

    public async Task<ShelfResponse> CreateShelfAsync(CreateShelfRequest request)
    {
        var shelf = _mapper.Map<Shelf>(request);
        _context.Shelves.Add(shelf);
        await _context.SaveChangesAsync();
        return _mapper.Map<ShelfResponse>(shelf);
    }

    public async Task<BooleanResponse> UpdateShelfAsync(int id, UpdateShelfRequest request)
    {
        var shelf = await _context.Shelves.FindAsync(id);
        if (shelf == null) return new BooleanResponse(false);

        _mapper.Map(request, shelf);
        await UpdateShelfStatus(shelf);
        _context.Shelves.Update(shelf);
        await _context.SaveChangesAsync();
        return new BooleanResponse(true);
    }
    
    public async Task<BooleanResponse> DeleteShelfAsync(int id)
    {
        var shelf = await _context.Shelves.FindAsync(id);
        if (shelf == null) return new BooleanResponse(false);

        // Check if shelf has books
        var hasBooks = await _context.BookLocations.AnyAsync(bl => bl.ShelfID == id);
        if (hasBooks) return new BooleanResponse(false);

        _context.Shelves.Remove(shelf);
        await _context.SaveChangesAsync();
        return new BooleanResponse(true);
    }

    public async Task<AddBookToShelfResponse> AddBookToShelfAsync(AddBookToShelfRequest request)
    {
        var book = await _context.Books.FindAsync(request.BookID);
        var shelf = await _context.Shelves.FindAsync(request.ShelfID);

        if (book == null || shelf == null)
        {
            return new AddBookToShelfResponse 
            { 
                Success = false, 
                Message = "Sách hoặc kệ không tồn tại." 
            };
        }

        // Kiểm tra số sách hiện tại
        var currentBooks = await _context.BookLocations.CountAsync(bl => bl.ShelfID == request.ShelfID);
        if (currentBooks >= shelf.Capacity)
        {
            return new AddBookToShelfResponse 
            { 
                Success = false, 
                Message = "Kệ đã đầy." 
            };
        }

        // Kiểm tra sách đã có trên kệ chưa
        var existingLocation = await _context.BookLocations
            .FirstOrDefaultAsync(bl => bl.BookID == request.BookID && bl.ShelfID == request.ShelfID);

        if (existingLocation != null)
        {
            return new AddBookToShelfResponse 
            { 
                Success = false, 
                Message = "Sách đã có trên kệ này." 
            };
        }

        // Thêm bookLocation và lưu thay đổi
        var bookLocation = new BookLocation
        {
            BookID = request.BookID,
            ShelfID = request.ShelfID
        };
        _context.BookLocations.Add(bookLocation);
        await _context.SaveChangesAsync();


        // Cập nhật lại số lượng sách trên kệ (CurrentBooks) và trạng thái kệ bằng cách đếm lại thực tế
        await UpdateShelfStatus(shelf);
        _context.Shelves.Update(shelf);
        await _context.SaveChangesAsync();

        return new AddBookToShelfResponse
        {
            Success = true,
            Message = "Thêm sách vào kệ thành công."
        };
    }

    private async Task UpdateShelfStatus(Shelf shelf)
    {
        var bookCount = await _context.BookLocations.CountAsync(bl => bl.ShelfID == shelf.ShelfID);
        
        shelf.CurrentBooks = bookCount;
        
        if (bookCount == 0)
            shelf.Status = ShelfStatus.EMPTY;
        else if (bookCount >= shelf.Capacity)
            shelf.Status = ShelfStatus.FULL;
        else
            shelf.Status = ShelfStatus.OCCUPIED;
    }

    public async Task<IEnumerable<BookOnShelfResponse>> GetBooksByShelfAsync(int shelfId)
    {
        var shelf = await _context.Shelves.FindAsync(shelfId);
        if (shelf == null)
            return Enumerable.Empty<BookOnShelfResponse>();

        var books = await _context.BookLocations
            .Where(bl => bl.ShelfID == shelfId)
            .Include(bl => bl.Book)
            .ThenInclude(b => b.Category)
            .Select(bl => new BookOnShelfResponse
            {
                BookLocationID = bl.BookLocationID,
                BookID = bl.BookID,
                Title = bl.Book.Title,
                ISBN = bl.Book.ISBN,
                Author = bl.Book.Author,
                CategoryName = bl.Book.Category != null ? bl.Book.Category.Name : "Chưa phân loại",
                PublicationYear = bl.Book.PublicationYear,
                Publisher = bl.Book.Publisher,
                Description = bl.Book.Description
            })
            .ToListAsync();

        return books;
    }

    public async Task<RemoveBookFromShelfResponse> RemoveBookFromShelfAsync(int bookLocationId)
    {
        var bookLocation = await _context.BookLocations.FindAsync(bookLocationId);
        if (bookLocation == null)
        {
            return new RemoveBookFromShelfResponse { Success = false, Message = "Vị trí sách không tồn tại." };
        }

        var shelf = await _context.Shelves.FindAsync(bookLocation.ShelfID);

        // Xóa sách khỏi kệ
        _context.BookLocations.Remove(bookLocation);

        if (shelf != null)
        {
            // Cập nhật trạng thái kệ
            await UpdateShelfStatus(shelf);
            _context.Shelves.Update(shelf);
        }

        // Lưu thay đổi vào DB
        await _context.SaveChangesAsync();

        return new RemoveBookFromShelfResponse { Success = true, Message = "Xóa sách khỏi kệ thành công." };
    }

}