using System.ComponentModel.DataAnnotations;
using LibraryMangement.EnumData;

namespace LibraryMangement.Request;
public class UpdateUserRequest
{
    [Required]
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public AccountStatus? Status { get; set; } 
}