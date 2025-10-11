using LibraryMangement.EnumData;

namespace LibraryMangement.Request;

public class UpdateBorrowingRequest
{
    public BorrowingStatus Status { get; set; }
    public Guid? StaffID { get; set; }
}