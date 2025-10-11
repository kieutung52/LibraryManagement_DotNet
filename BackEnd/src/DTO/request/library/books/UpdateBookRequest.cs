using System.ComponentModel.DataAnnotations;

namespace LibraryMangement.Request;
public class UpdateBookRequest
{
    [Required]
    public string Title { get; set; } = string.Empty;
    [Required]
    public string Author { get; set; } = string.Empty;
    public int? CategoryID { get; set; }
    public int? PublicationYear { get; set; }
    [Range(0, int.MaxValue)]
    public int TotalQuantity { get; set; }
    [Range(0, int.MaxValue)]
    public int AvailableQuantity { get; set; }
}