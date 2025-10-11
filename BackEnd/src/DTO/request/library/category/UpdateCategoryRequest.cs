using System.ComponentModel.DataAnnotations;
namespace LibraryMangement.Request;

public class UpdateCategoryRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}