using System.ComponentModel.DataAnnotations;

namespace LibraryMangement.Request;

public class CreateBorrowingRequest
{
    [Required]
    public Guid AccountID { get; set; }
    
    [Required, MinLength(1)]
    public List<BorrowingBookRequest> Books { get; set; } = new List<BorrowingBookRequest>();
}

public class BorrowingBookRequest
{
    [Required]
    public int BookID { get; set; }
    
    [Required, Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}