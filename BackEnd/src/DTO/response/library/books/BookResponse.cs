namespace LibraryMangement.Response;

public class BookResponse
{
    public int BookID { get; set; }
    public string ISBN { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public int? CategoryID { get; set; }
    public string? CategoryName { get; set; }
    public int? PublicationYear { get; set; }
    public int TotalQuantity { get; set; }
    public int AvailableQuantity { get; set; }
}