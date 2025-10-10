using System.ComponentModel.DataAnnotations;
using LibraryMangement.EnumData;

namespace LibraryMangement.Models;

public abstract class Account : BaseEntity
{
    [Key]
    public Guid AccountID { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public AccountStatus Status { get; set; } = AccountStatus.ACTIVE;

    public ICollection<Borrowing> Borrowings { get; set; } = new List<Borrowing>();
}