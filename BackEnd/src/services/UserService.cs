// File: src/services/UserService.cs
using AutoMapper;
using LibraryMangement.Data;
using LibraryMangement.Request;
using LibraryMangement.Response;
using LibraryMangement.Models;

using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LibraryMangement.Service;

public class UserService : IUserService
{
    private readonly LibraryContext _context;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public UserService(LibraryContext context, IMapper mapper, IConfiguration configuration)
    {
        _context = context;
        _mapper = mapper;
        _configuration = configuration;
    }

    public async Task<AuthenticationResponse?> LoginAsync(LoginRequest model)
    {
        var user = await _context.Accounts.FirstOrDefaultAsync(u => u.Email == model.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.Password))
        {
            return null; // Sai email hoặc mật khẩu
        }

        var token = GenerateJwtToken(user);
        var userResponse = _mapper.Map<UserResponse>(user);

        return new AuthenticationResponse { Token = token, UserDetails = userResponse };
    }

    public async Task<AuthenticationResponse?> RegisterAsync(RegisterRequest model)
    {
        if (await _context.Users.AnyAsync(u => u.Email == model.Email))
        {
            return null; // Email đã tồn tại
        }

        var user = _mapper.Map<User>(model);
        user.Password = BCrypt.Net.BCrypt.HashPassword(model.Password);
        user.Role = "USER"; // Gán role mặc định
        user.AccountID = Guid.NewGuid();

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(user);
        var userResponse = _mapper.Map<UserResponse>(user);

        return new AuthenticationResponse { Token = token, UserDetails = userResponse };
    }

    public async Task<AuthenticationResponse?> RegisterAdmin(RegisterRequest model)
    {
        if (await _context.Admins.AnyAsync(u => u.Email == model.Email))
        {
            return null; // Email đã tồn tại
        }

        var Admin = _mapper.Map<Admin>(model);
        Admin.Password = BCrypt.Net.BCrypt.HashPassword(model.Password);
        Admin.Role = "ADMIN"; // Gán role mặc định
        Admin.AccountID = Guid.NewGuid();

        Admin.StaffCode = Guid.NewGuid();

        _context.Admins.Add(Admin);
        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(Admin);
        var userResponse = _mapper.Map<UserResponse>(Admin);

        return new AuthenticationResponse { Token = token, UserDetails = userResponse };
    }    

    private string GenerateJwtToken(Account account)
    {
        var securityKey = new SymmetricSecurityKey(Convert.FromBase64String(_configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, account.AccountID.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, account.Email),
            new Claim(ClaimTypes.Role, account.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(6),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    
    // Implement CRUD methods
    public async Task<IEnumerable<UserResponse>> GetAllUsersAsync()
    {
        var users = await _context.Accounts.ToListAsync();
        return _mapper.Map<IEnumerable<UserResponse>>(users);
    }

    public async Task<UserResponse?> GetUserByIdAsync(Guid id)
    {
        var user = await _context.Accounts.FindAsync(id);
        var data = _mapper.Map<UserResponse>(user);

        return data;
    }
    
    public async Task<UserResponse?> CreateUserAsync(CreateUserRequest model)
    {
         if (await _context.Accounts.AnyAsync(u => u.Email == model.Email)) return null;
         
         var user = _mapper.Map<User>(model);
         user.Password = BCrypt.Net.BCrypt.HashPassword(model.Password);
         user.Role = "USER";
         
         _context.Users.Add(user);
         await _context.SaveChangesAsync();
         
         return _mapper.Map<UserResponse>(user);
    }
    
    public async Task<BooleanResponse> UpdateUserAsync(Guid id, UpdateUserRequest model)
    {
        var user = await _context.Accounts.FindAsync(id);
        if(user == null) return new BooleanResponse(false);

        _mapper.Map(model, user); // Update fields from model to user
        _context.Accounts.Update(user);
        await _context.SaveChangesAsync();
        return new BooleanResponse(true);
    }
    
    public async Task<BooleanResponse> DeleteUserAsync(Guid id)
    {
        var user = await _context.Accounts.FindAsync(id);
        if(user == null) return new BooleanResponse(false);
        
        _context.Accounts.Remove(user);
        await _context.SaveChangesAsync();
        return new BooleanResponse(true);
    }
}