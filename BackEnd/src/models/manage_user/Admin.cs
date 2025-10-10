using LibraryMangement.EnumData;

namespace LibraryMangement.Models;

public class Admin : Account
{
    public Guid? StaffCode { get; set; }
    public StaffPosition? Position { get; set; } = StaffPosition.LIBRARIAN;
}