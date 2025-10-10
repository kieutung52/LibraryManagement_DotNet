using System.ComponentModel.DataAnnotations;

namespace LibraryMangement.Request;
public class UpdateUserRequest
{
    [Required]
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; 
    // Thêm các trường khác cần cập nhật
}