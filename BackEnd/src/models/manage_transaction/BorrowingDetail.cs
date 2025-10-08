using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LibraryMangement.EnumData;

namespace LibraryMangement.Models;

public class BorrowingDetail : BaseEntity
{
    [Key]
    public int BorrowingDetailID { get; set; }

    public int BorrowingID { get; set; }
    public Borrowing Borrowing { get; set; } = null!;

    public int BookID { get; set; }
    public Book Book { get; set; } = null!;

    [Range(1, int.MaxValue, ErrorMessage = "QuantityBook must be at least 1")]
    public int QuantityBook { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? ReturnDate { get; set; }
    public BorrowingDetailStatus Status { get; set; } = BorrowingDetailStatus.BORROWING;
}

