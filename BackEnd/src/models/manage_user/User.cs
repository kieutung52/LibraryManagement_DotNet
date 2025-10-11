namespace LibraryMangement.Models;

public class User : Account
{
    public int LimitRenew { get; set; } = 3;
    public int CountRenew { get; set; } = 0;
    public int LimitBorrow { get; set; } = 5;
    public int CountBorrow { get; set; } = 0;
    public int CountViolations { get; set; } = 0;
}