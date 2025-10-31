using LibraryMangement.EnumData;

namespace LibraryMangement.Response;
public class UserResponse
{
    public string AccountID { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public AdminData? AdminData { get; set; }
    public UserData? UserData { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
    public string UpdatedAt { get; set; } = string.Empty;
}