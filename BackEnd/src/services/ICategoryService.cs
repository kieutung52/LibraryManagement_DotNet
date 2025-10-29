using LibraryMangement.Request;
using LibraryMangement.Response;

namespace LibraryMangement.Service;

public interface ICategoryService
{
    Task<IEnumerable<CategoryResponse>> GetAllCategoriesAsync();
    Task<CategoryResponse?> GetCategoryByIdAsync(int id);
    Task<CategoryResponse> CreateCategoryAsync(CreateCategoryRequest request);
    Task<BooleanResponse> UpdateCategoryAsync(int id, UpdateCategoryRequest request);
    Task<BooleanResponse> DeleteCategoryAsync(int id);
}