namespace LibraryMangement.Response;

public class BookOnShelfResponse
{
    public int BookLocationID { get; set; }
    public int BookID { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ISBN { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public int? PublicationYear { get; set; }
    public string Publisher { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
