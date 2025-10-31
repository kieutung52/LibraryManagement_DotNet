using LibraryMangement.EnumData;

namespace LibraryMangement.Response;

public class BorrowingResponse
{
    public int BorrowingID { get; set; }
    public string AccountID { get; set; } = string.Empty;
    public Guid? StaffID { get; set; }
    public DateTime BorrowDate { get; set; }
    public BorrowingStatus Status { get; set; }
    public List<BorrowingDetailResponse> Details { get; set; } = new List<BorrowingDetailResponse>();
    public string CreatedAt { get; set; } = string.Empty;
    public string UpdatedAt { get; set; } = string.Empty;
}