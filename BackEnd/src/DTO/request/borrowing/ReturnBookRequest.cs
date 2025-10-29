namespace LibraryMangement.Request;

public class ReturnBookRequest
{
    public int borrowingDetailId { get; set; }
    public string ISBN { get; set; } = string.Empty;
}