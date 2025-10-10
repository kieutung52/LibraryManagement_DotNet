using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LibraryMangement.EnumData;

namespace LibraryMangement.Models;

public class Borrowing : BaseEntity
{
    [Key]
    public int BorrowingID { get; set; }

    public Guid AccountID { get; set; }
    public Account Account { get; set; } = null!; // borrower

    public Guid? StaffID { get; set; }
    public Admin? Staff { get; set; }

    public DateTime BorrowDate { get; set; }
    public BorrowingStatus Status { get; set; } = BorrowingStatus.PENDING;

    public ICollection<BorrowingDetail> Details { get; set; } = new List<BorrowingDetail>();
}
