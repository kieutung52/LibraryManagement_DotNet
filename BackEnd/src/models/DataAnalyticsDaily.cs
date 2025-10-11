using System.ComponentModel.DataAnnotations;

namespace LibraryMangement.Models;

public class DataAnalyticsDaily : BaseEntity
{
    [Key]
    public int DataAnalyticsID { get; set; }
    public DateTime ReportDate { get; set; }

    public int CountBorrowings { get; set; }
    public int CountUsersViolations { get; set; }
    public int CountUsersVisited { get; set; }
    public int CountUserBack { get; set; }
    public int CountBorrowingsToExpire { get; set; }
    public int CountBorrowingsRequestPending { get; set; }
}