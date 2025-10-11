using LibraryMangement.EnumData;

namespace LibraryMangement.Response;

public class ShelfResponse
{
    public int ShelfID { get; set; }
    public string LocationName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ShelfStatus Status { get; set; } = ShelfStatus.EMPTY;
    public int Capacity { get; set; }
}