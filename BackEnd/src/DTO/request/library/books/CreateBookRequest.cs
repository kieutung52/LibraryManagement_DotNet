using System.ComponentModel.DataAnnotations;

namespace LibraryMangement.Request;
public class CreateBookRequest
{
    [Required]
    public string ISBN { get; set; } = string.Empty;
    [Required]
    public string Title { get; set; } = string.Empty;
    [Required]
    public string Author { get; set; } = string.Empty;
    public int? CategoryID { get; set; }
    public int? PublicationYear { get; set; }
    [Required, Range(0, int.MaxValue)]
    public int TotalQuantity { get; set; }

    public string Description { get; set; } = string.Empty;
    public string Publisher { get; set; } = string.Empty;
    public string CoverImage { get; set; } = string.Empty;
}