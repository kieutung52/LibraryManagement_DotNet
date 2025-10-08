using LibraryMangement.EnumData;

namespace LibraryMangement.Models;

public class Admin : Account
{
    public string? StaffCode { get; set; }
    public StaffPosition? Position { get; set; } = StaffPosition.LIBRARIAN;
}