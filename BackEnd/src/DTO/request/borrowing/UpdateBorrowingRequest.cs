using LibraryMangement.EnumData;
using System.Text.Json.Serialization;

namespace LibraryMangement.Request;

public class UpdateBorrowingRequest
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public BorrowingStatus Status { get; set; }
    public Guid? StaffID { get; set; }
}