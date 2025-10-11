namespace LibraryMangement.Response;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public required T Data { get; set; }

    // response success
    public static ApiResponse<T> SuccessResponse(T data, string message = "Thao tác thành công.")
    {
        return new ApiResponse<T> { Success = true, Data = data, Message = message };
    }

    // response error
    public static ApiResponse<T> ErrorResponse(string message)
    {
        return new ApiResponse<T> { Success = false, Data = default!, Message = message };
    }
}