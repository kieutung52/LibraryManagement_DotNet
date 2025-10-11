using LibraryMangement.EnumData;

namespace LibraryMangement.Response;

public class BorrowingResponse
{
    public int BorrowingID { get; set; }
    public Guid AccountID { get; set; }
    public Guid? StaffID { get; set; }
    public DateTime BorrowDate { get; set; }
    public BorrowingStatus Status { get; set; }
    public List<BorrowingDetailResponse> Details { get; set; } = new List<BorrowingDetailResponse>();
}