using AutoMapper;
using LibraryMangement.Data;
using LibraryMangement.Models;
using LibraryMangement.Request;
using LibraryMangement.Response;
using Microsoft.EntityFrameworkCore;

namespace LibraryMangement.Service;

public class CategoryService : ICategoryService
{
    private readonly LibraryContext _context;
    private readonly IMapper _mapper;

    public CategoryService(LibraryContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CategoryResponse>> GetAllCategoriesAsync()
    {
        var categories = await _context.Categories.ToListAsync();
        return _mapper.Map<IEnumerable<CategoryResponse>>(categories);
    }

    public async Task<CategoryResponse?> GetCategoryByIdAsync(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        return category == null ? null : _mapper.Map<CategoryResponse>(category);
    }

    public async Task<CategoryResponse> CreateCategoryAsync(CreateCategoryRequest request)
    {
        var category = _mapper.Map<Category>(request);
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return _mapper.Map<CategoryResponse>(category);
    }

    public async Task<BooleanResponse> UpdateCategoryAsync(int id, UpdateCategoryRequest request)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return new BooleanResponse(false);

        _mapper.Map(request, category);
        _context.Categories.Update(category);
        await _context.SaveChangesAsync();
        return new BooleanResponse(true);
    }

    public async Task<BooleanResponse> DeleteCategoryAsync(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return new BooleanResponse(false);

        // Check if category has books
        var hasBooks = await _context.Books.AnyAsync(b => b.CategoryID == id);
        if (hasBooks) return new BooleanResponse(false);

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return new BooleanResponse(true);
    }
}