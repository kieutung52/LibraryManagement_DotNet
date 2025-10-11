namespace LibraryMangement.Response;

public class CategoryResponse
{
    public int CategoryID { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}