using LibraryMangement.Request;
using LibraryMangement.Response;
using LibraryMangement.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryMangement.Controller;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "ADMIN")] // <-- CẬP NHẬT (thay vì [Authorize])
public class ShelfController : ControllerBase
{
    private readonly IShelfService _shelfService;

    public ShelfController(IShelfService shelfService)
    {
        _shelfService = shelfService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllShelves()
    {
        var shelves = await _shelfService.GetAllShelvesAsync();
        return Ok(ApiResponse<object>.SuccessResponse(shelves));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetShelfById(int id)
    {
        var shelf = await _shelfService.GetShelfByIdAsync(id);
        if (shelf == null) return NotFound(ApiResponse<string>.ErrorResponse("Không tìm thấy kệ sách."));
        return Ok(ApiResponse<ShelfResponse>.SuccessResponse(shelf));
    }

    [HttpPost]
    public async Task<IActionResult> CreateShelf(CreateShelfRequest request)
    {
        var shelf = await _shelfService.CreateShelfAsync(request);
        return CreatedAtAction(nameof(GetShelfById), new { id = shelf.ShelfID }, 
            ApiResponse<ShelfResponse>.SuccessResponse(shelf, "Tạo kệ sách thành công."));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateShelf(int id, UpdateShelfRequest request)
    {
        var result = await _shelfService.UpdateShelfAsync(id, request);
        if (!result.is_successed) return NotFound(ApiResponse<string>.ErrorResponse("Không tìm thấy kệ sách."));
        return Ok(ApiResponse<BooleanResponse>.SuccessResponse(result, "Cập nhật kệ sách thành công."));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteShelf(int id)
    {
        var result = await _shelfService.DeleteShelfAsync(id);
        if (!result.is_successed) return BadRequest(ApiResponse<string>.ErrorResponse("Không thể xóa kệ đang chứa sách."));
        return Ok(ApiResponse<BooleanResponse>.SuccessResponse(result, "Xóa kệ sách thành công."));
    }

    [HttpPost("add-book")]
    public async Task<IActionResult> AddBookToShelf(AddBookToShelfRequest request)
    {
        var result = await _shelfService.AddBookToShelfAsync(request);
        if (!result.Success) return BadRequest(ApiResponse<AddBookToShelfResponse>.ErrorResponse(result.Message));
        return Ok(ApiResponse<AddBookToShelfResponse>.SuccessResponse(result, result.Message));
    }
}