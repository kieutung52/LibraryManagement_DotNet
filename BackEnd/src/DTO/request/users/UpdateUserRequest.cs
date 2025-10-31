using System.ComponentModel.DataAnnotations;
using LibraryMangement.EnumData;
using LibraryMangement.Response;
using System.Text.Json.Serialization;

namespace LibraryMangement.Request;
public class UpdateUserRequest
{
    [Required]
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public AccountStatus? Status { get; set; } 
    public AdminData? AdminData { get; set; }
    public UserData? UserData { get; set; }
}