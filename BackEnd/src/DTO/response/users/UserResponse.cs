using LibraryMangement.Models;

namespace LibraryMangement.Response;
public class UserResponse
{
    public Guid AccountID { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;

    public Guid? StaffCode { get; set; }
}