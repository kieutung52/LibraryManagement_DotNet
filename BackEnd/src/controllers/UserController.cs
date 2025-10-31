using System.IdentityModel.Tokens.Jwt;
using LibraryMangement.Request;
using LibraryMangement.Response;
using LibraryMangement.Service;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryMangement.Controller;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest model)
    {
        var result = await _userService.RegisterAsync(model);
        if (result == null)
        {
            return BadRequest(ApiResponse<string>.ErrorResponse("Email đã tồn tại."));
        }
        return Ok(ApiResponse<AuthenticationResponse>.SuccessResponse(result, "Đăng ký thành công."));
    }

    [HttpPost("register-admin")]
    public async Task<IActionResult> RegisterAD(RegisterRequest model)
    {
        var result = await _userService.RegisterAdmin(model);
        if (result == null)
        {
            return BadRequest(ApiResponse<string>.ErrorResponse("Email đã tồn tại."));
        }
        return Ok(ApiResponse<AuthenticationResponse>.SuccessResponse(result, "Đăng ký thành công."));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest model)
    {
        var result = await _userService.LoginAsync(model);
        if (result == null)
        {
            return Unauthorized(ApiResponse<string>.ErrorResponse("Email hoặc mật khẩu không chính xác."));
        }
        return Ok(ApiResponse<AuthenticationResponse>.SuccessResponse(result, "Đăng nhập thành công."));
    }

    [HttpGet]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(ApiResponse<object>.SuccessResponse(users));
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> GetUserById(Guid id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null) return NotFound(ApiResponse<string>.ErrorResponse("Không tìm thấy người dùng."));

        return Ok(ApiResponse<UserResponse>.SuccessResponse(user));
    }

    [HttpGet("my-profile")]
    [Authorize]
    public async Task<IActionResult> MyProfile()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || string.IsNullOrEmpty(userIdClaim.Value))
        {
            return Unauthorized(ApiResponse<string>.ErrorResponse("Không tìm thấy thông tin người dùng trong token."));
        }

        if (!Guid.TryParse(userIdClaim.Value, out Guid currentUserId))
        {
            return Unauthorized(ApiResponse<string>.ErrorResponse("ID người dùng không hợp lệ."));
        }

        var user = await _userService.GetUserByIdAsync(currentUserId);
        if (user == null) return NotFound(ApiResponse<string>.ErrorResponse("Không tìm thấy người dùng."));
        return Ok(ApiResponse<UserResponse>.SuccessResponse(user));
    }
    
    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> CreateUser(CreateUserRequest model)
    {
        
        var newUser = await _userService.CreateUserAsync(model);
        if(newUser == null) return BadRequest(ApiResponse<string>.ErrorResponse("Email đã tồn tại."));
        
        return CreatedAtAction(nameof(GetUserById), new { id = newUser.AccountID }, ApiResponse<UserResponse>.SuccessResponse(newUser));
    }
    
    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN")] // <-- CẬP NHẬT (thay vì [Authorize])
    public async Task<IActionResult> UpdateUser(Guid id, UpdateUserRequest model)
    {
        BooleanResponse success = await _userService.UpdateUserAsync(id, model);
        if(!success.is_successed) return NotFound(ApiResponse<BooleanResponse>.ErrorResponse("Không tìm thấy người dùng."));
        
        return Ok(ApiResponse<BooleanResponse>.SuccessResponse(success,"Cập nhật thành công."));
    }
    
    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        BooleanResponse success = await _userService.DeleteUserAsync(id);
        if(!success.is_successed) return NotFound(ApiResponse<BooleanResponse>.ErrorResponse("Không tìm thấy người dùng."));
        
        return Ok(ApiResponse<BooleanResponse>.SuccessResponse(success,"Xóa người dùng thành công."));
    }
}