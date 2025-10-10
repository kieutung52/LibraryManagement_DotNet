namespace LibraryMangement.Response;

public class BooleanResponse
{
    public bool is_successed { get; set; }

    public BooleanResponse() { }

    public BooleanResponse(bool is_successed)
    {
        this.is_successed = is_successed;
     }

}