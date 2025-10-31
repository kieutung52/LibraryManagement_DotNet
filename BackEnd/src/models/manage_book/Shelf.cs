using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LibraryMangement.EnumData;

namespace LibraryMangement.Models;

public class Shelf : BaseEntity
{
    [Key]
    public int ShelfID { get; set; }
    public string LocationName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ShelfStatus Status { get; set; } = ShelfStatus.EMPTY;
    public int Capacity { get; set; }
    public int CurrentBooks { get; set; }

    public ICollection<BookLocation> BookLocations { get; set; } = new List<BookLocation>();
}

