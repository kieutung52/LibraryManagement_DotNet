using LibraryMangement.Request;
using LibraryMangement.Response;

namespace LibraryMangement.Service;

public interface IShelfService
{
    Task<IEnumerable<ShelfResponse>> GetAllShelvesAsync();
    Task<ShelfResponse?> GetShelfByIdAsync(int id);
    Task<ShelfResponse> CreateShelfAsync(CreateShelfRequest request);
    Task<BooleanResponse> UpdateShelfAsync(int id, UpdateShelfRequest request);
    Task<BooleanResponse> DeleteShelfAsync(int id);
    Task<AddBookToShelfResponse> AddBookToShelfAsync(AddBookToShelfRequest request);
    Task<IEnumerable<BookOnShelfResponse>> GetBooksByShelfAsync(int shelfId);
    Task<RemoveBookFromShelfResponse> RemoveBookFromShelfAsync(int bookLocationId);
}