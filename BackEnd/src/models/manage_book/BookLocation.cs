using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryMangement.Models;

public class BookLocation : BaseEntity
{
    [Key]
    public int BookLocationID { get; set; }

    public int BookID { get; set; }
    public Book Book { get; set; } = null!;

    public int ShelfID { get; set; }
    public Shelf Shelf { get; set; } = null!;
}
