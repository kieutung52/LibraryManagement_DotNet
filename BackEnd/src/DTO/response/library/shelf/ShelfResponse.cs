using LibraryMangement.EnumData;

namespace LibraryMangement.Response;

public class ShelfResponse
{
    public int ShelfID { get; set; }
    public string LocationName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ShelfStatus Status { get; set; }
    public int Capacity { get; set; }
    public int CurrentBooks { get; set; } // Computed in service
    public string CreatedAt { get; set; } = string.Empty;
    public string UpdatedAt { get; set; } = string.Empty;
}