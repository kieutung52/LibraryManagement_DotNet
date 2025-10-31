using LibraryMangement.EnumData;
using System.Text.Json.Serialization;

namespace LibraryMangement.Response;

public class BorrowingResponse
{
    public int BorrowingID { get; set; }
    public string AccountID { get; set; } = string.Empty;
    public Guid? StaffID { get; set; }
    public DateTime BorrowDate { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public BorrowingStatus Status { get; set; }
    public List<BorrowingDetailResponse> Details { get; set; } = new List<BorrowingDetailResponse>();
    public string CreatedAt { get; set; } = string.Empty;
    public string UpdatedAt { get; set; } = string.Empty;
}