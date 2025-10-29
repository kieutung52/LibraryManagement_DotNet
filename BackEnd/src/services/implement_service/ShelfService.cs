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
            return new AddBookToShelfResponse { Success = false, Message = "Sách hoặc kệ không tồn tại." };
        }

        // Check if shelf has capacity
        var currentBooks = await _context.BookLocations.CountAsync(bl => bl.ShelfID == request.ShelfID);
        if (currentBooks >= shelf.Capacity)
        {
            return new AddBookToShelfResponse { Success = false, Message = "Kệ đã đầy." };
        }

        // Check if book is already on this shelf
        var existingLocation = await _context.BookLocations
            .FirstOrDefaultAsync(bl => bl.BookID == request.BookID && bl.ShelfID == request.ShelfID);
        
        if (existingLocation != null)
        {
            return new AddBookToShelfResponse { Success = false, Message = "Sách đã có trên kệ này." };
        }

        var bookLocation = new BookLocation
        {
            BookID = request.BookID,
            ShelfID = request.ShelfID
        };

        _context.BookLocations.Add(bookLocation);
        await UpdateShelfStatus(shelf);
        await _context.SaveChangesAsync();

        return new AddBookToShelfResponse { Success = true, Message = "Thêm sách vào kệ thành công." };
    }

    private async Task UpdateShelfStatus(Shelf shelf)
    {
        var bookCount = await _context.BookLocations.CountAsync(bl => bl.ShelfID == shelf.ShelfID);
        
        if (bookCount == 0)
            shelf.Status = ShelfStatus.EMPTY;
        else if (bookCount >= shelf.Capacity)
            shelf.Status = ShelfStatus.FULL;
        else
            shelf.Status = ShelfStatus.OCCUPIED;
    }
}