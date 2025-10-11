using System.ComponentModel.DataAnnotations;
namespace LibraryMangement.Request;
public class CreateShelfRequest
{
    [Required]
    public string LocationName { get; set; } = string.Empty;
    public string? Description { get; set; }
    [Required, Range(1, int.MaxValue)]
    public int Capacity { get; set; }
}