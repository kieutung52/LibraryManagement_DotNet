using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryMangement.Models;

public class Book : BaseEntity
{
    [Key]
    public int BookID { get; set; }
    public string ISBN { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;

    public int? CategoryID { get; set; }
    public Category? Category { get; set; }

    public int? PublicationYear { get; set; }
    public int TotalQuantity { get; set; }
    public int AvailableQuantity { get; set; }
    public int BorrowedCount { get; set; }

    public ICollection<BookLocation> BookLocations { get; set; } = new List<BookLocation>();
    public ICollection<BorrowingDetail> BorrowingDetails { get; set; } = new List<BorrowingDetail>();
}
