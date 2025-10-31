namespace LibraryMangement.Response;

public class BookResponse
{
    public int BookID { get; set; }
    public string ISBN { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public int CategoryID { get; set; }
    public string CategoryName { get; set; } = string.Empty; // From Category.Name
    public int? PublicationYear { get; set; }
    public int TotalQuantity { get; set; }
    public int AvailableQuantity { get; set; }
    public int BorrowedCount { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Publisher { get; set; } = string.Empty;
    public string CoverImage { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;
    public string UpdatedAt { get; set; } = string.Empty;
}