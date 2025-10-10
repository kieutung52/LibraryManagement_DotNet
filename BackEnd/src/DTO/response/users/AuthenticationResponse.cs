namespace LibraryMangement.Response;
public class AuthenticationResponse
{
    public string Token { get; set; } = string.Empty;
    public UserResponse? UserDetails { get; set; }
}