using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LibraryMangement.EnumData;

namespace LibraryMangement.Models;

public class Borrowing : BaseEntity
{
    [Key]
    public int BorrowingID { get; set; }

    public int AccountID { get; set; }
    public Account Account { get; set; } = null!; // borrower

    public string? StaffID { get; set; }
    public Admin? Admin { get; set; }

    public DateTime BorrowDate { get; set; }
    public BorrowingStatus Status { get; set; } = BorrowingStatus.PENDING;

    public ICollection<BorrowingDetail> Details { get; set; } = new List<BorrowingDetail>();
}
