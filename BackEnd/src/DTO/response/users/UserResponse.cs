using LibraryMangement.EnumData;

namespace LibraryMangement.Response;
public class UserResponse
{
    public string AccountID { get; set; } = string.Empty; // Guid.ToString()
    public string Role { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public AdminData? AdminData { get; set; } // Mapped from Admin fields
    public UserData? UserData { get; set; } // Mapped from User fields
    public string CreatedAt { get; set; } = string.Empty; // ISO DateTime
    public string UpdatedAt { get; set; } = string.Empty; // ISO DateTime
}