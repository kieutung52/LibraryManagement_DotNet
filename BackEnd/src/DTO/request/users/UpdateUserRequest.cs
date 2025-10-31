using System.ComponentModel.DataAnnotations;
using LibraryMangement.EnumData;
using LibraryMangement.Response;

namespace LibraryMangement.Request;
public class UpdateUserRequest
{
    [Required]
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public AccountStatus? Status { get; set; } 
    public AdminData? AdminData { get; set; } // Mapped from Admin fields
    public UserData? UserData { get; set; }
}