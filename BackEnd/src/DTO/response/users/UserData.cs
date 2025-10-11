namespace LibraryMangement.Response;

public class UserData
{
    public int? LimitRenew { get; set; }
    public int? CountRenew { get; set; }
    public int? LimitBorrow { get; set; }
    public int? CountBorrow { get; set; }
    public int? CountViolations { get; set; }
}