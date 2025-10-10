using LibraryMangement.Request;
using LibraryMangement.Response;

namespace LibraryMangement.Service;

public interface IUserService
{
    Task<AuthenticationResponse?> RegisterAsync(RegisterRequest model);
    Task<AuthenticationResponse?> LoginAsync(LoginRequest model);
    Task<AuthenticationResponse?> RegisterAdmin(RegisterRequest model);
    Task<IEnumerable<UserResponse>> GetAllUsersAsync();
    Task<UserResponse?> GetUserByIdAsync(Guid id);
    Task<UserResponse?> CreateUserAsync(CreateUserRequest model);
    Task<BooleanResponse> UpdateUserAsync(Guid id, UpdateUserRequest model);
    Task<BooleanResponse> DeleteUserAsync(Guid id);
}