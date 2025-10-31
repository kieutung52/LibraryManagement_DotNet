using LibraryMangement.EnumData;
using System.Text.Json.Serialization;

namespace LibraryMangement.Response;

public class BorrowingDetailResponse
{
    public int BorrowingDetailID { get; set; }
    public int BookID { get; set; }
    public string BookTitle { get; set; } = string.Empty;
    public int QuantityBook { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? ReturnDate { get; set; }
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public BorrowingDetailStatus Status { get; set; }
}