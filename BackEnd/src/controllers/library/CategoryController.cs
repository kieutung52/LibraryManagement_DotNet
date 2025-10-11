using LibraryMangement.Request;
using LibraryMangement.Response;
using LibraryMangement.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryMangement.Controller;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoryController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCategories()
    {
        var categories = await _categoryService.GetAllCategoriesAsync();
        return Ok(ApiResponse<object>.SuccessResponse(categories));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCategoryById(int id)
    {
        var category = await _categoryService.GetCategoryByIdAsync(id);
        if (category == null) return NotFound(ApiResponse<string>.ErrorResponse("Không tìm thấy danh mục."));
        return Ok(ApiResponse<CategoryResponse>.SuccessResponse(category));
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> CreateCategory(CreateCategoryRequest request)
    {
        var category = await _categoryService.CreateCategoryAsync(request);
        return CreatedAtAction(nameof(GetCategoryById), new { id = category.CategoryID }, 
            ApiResponse<CategoryResponse>.SuccessResponse(category, "Tạo danh mục thành công."));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> UpdateCategory(int id, UpdateCategoryRequest request)
    {
        var result = await _categoryService.UpdateCategoryAsync(id, request);
        if (!result.is_successed) return NotFound(ApiResponse<string>.ErrorResponse("Không tìm thấy danh mục."));
        return Ok(ApiResponse<BooleanResponse>.SuccessResponse(result, "Cập nhật danh mục thành công."));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var result = await _categoryService.DeleteCategoryAsync(id);
        if (!result.is_successed) return BadRequest(ApiResponse<string>.ErrorResponse("Không thể xóa danh mục đang chứa sách."));
        return Ok(ApiResponse<BooleanResponse>.SuccessResponse(result, "Xóa danh mục thành công."));
    }
}