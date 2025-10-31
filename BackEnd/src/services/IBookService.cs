using LibraryMangement.Request;
using LibraryMangement.Response;

namespace LibraryMangement.Service;

public interface IBookService
{
    Task<IEnumerable<BookResponse>> GetAllBooksAsync();
    Task<BookResponse?> GetBookByIdAsync(int id);
    Task<BookResponse> CreateBookAsync(CreateBookRequest request);
    Task<BooleanResponse> UpdateBookAsync(int id, UpdateBookRequest request);
    Task<BooleanResponse> DeleteBookAsync(int id);
}