using LibraryMangement.EnumData;

namespace LibraryMangement.Models;

public class Admin : Account
{
    public int? StaffCode { get; set; }
    public StaffPosition? Position { get; set; } = StaffPosition.LIBRARIAN;
}