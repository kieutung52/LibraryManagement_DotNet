using LibraryMangement.Request;
using LibraryMangement.Response;
using LibraryMangement.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryMangement.Controller;

[ApiController]
[Route("api/[controller]")]
public class BookController : ControllerBase
{
    private readonly IBookService _bookService;

    public BookController(IBookService bookService)
    {
        _bookService = bookService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllBooks()
    {
        var books = await _bookService.GetAllBooksAsync();
        return Ok(ApiResponse<object>.SuccessResponse(books));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBookById(int id)
    {
        var book = await _bookService.GetBookByIdAsync(id);
        if (book == null) return NotFound(ApiResponse<string>.ErrorResponse("Không tìm thấy sách."));
        return Ok(ApiResponse<BookResponse>.SuccessResponse(book));
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> CreateBook(CreateBookRequest request)
    {
        var book = await _bookService.CreateBookAsync(request);
        return CreatedAtAction(nameof(GetBookById), new { id = book.BookID }, 
            ApiResponse<BookResponse>.SuccessResponse(book, "Tạo sách thành công."));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> UpdateBook(int id, UpdateBookRequest request)
    {
        var result = await _bookService.UpdateBookAsync(id, request);
        if (!result.is_successed) return NotFound(ApiResponse<string>.ErrorResponse("Không tìm thấy sách."));
        return Ok(ApiResponse<BooleanResponse>.SuccessResponse(result, "Cập nhật sách thành công."));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var result = await _bookService.DeleteBookAsync(id);
        if (!result.is_successed) return NotFound(ApiResponse<string>.ErrorResponse("Không tìm thấy sách."));
        return Ok(ApiResponse<BooleanResponse>.SuccessResponse(result, "Xóa sách thành công."));
    }
}