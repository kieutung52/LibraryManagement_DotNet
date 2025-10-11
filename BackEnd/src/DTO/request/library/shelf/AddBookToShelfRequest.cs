using System.ComponentModel.DataAnnotations;
namespace LibraryMangement.Request;
public class AddBookToShelfRequest
{
    [Required]
    public int BookID { get; set; }
    [Required]
    public int ShelfID { get; set; }
}