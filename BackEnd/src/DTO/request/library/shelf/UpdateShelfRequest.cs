namespace LibraryMangement.Request;

public class UpdateShelfRequest
{
    public string LocationName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = string.Empty;
    public int Capacity { get; set; }
}