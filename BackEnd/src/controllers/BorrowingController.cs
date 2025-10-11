using LibraryMangement.Models;
using LibraryMangement.Request;
using LibraryMangement.Response;
using LibraryMangement.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LibraryMangement.Controller;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BorrowingController : ControllerBase
{
    private readonly IBorrowingService _borrowingService;
    private readonly IUserService _userService;

    public BorrowingController(IBorrowingService borrowingService,IUserService userService)
    {
        _borrowingService = borrowingService;
        _userService = userService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateBorrowingRequest(CreateBorrowingRequest request)
    {
        try
        {
            var borrowing = await _borrowingService.CreateBorrowingRequestAsync(request);
            return Ok(ApiResponse<BorrowingResponse>.SuccessResponse(borrowing, "Tạo yêu cầu mượn sách thành công."));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));
        }
    }

    [HttpPut("{id}/cancel")]
    public async Task<IActionResult> CancelBorrowingRequest(int id)
    {
        var accountId = GetCurrentAccountId();
        if (accountId == null)
            return Unauthorized(ApiResponse<string>.ErrorResponse("Không xác định được người dùng."));

        var result = await _borrowingService.CancelBorrowingRequestAsync(id, accountId.Value);
        if (!result.is_successed)
            return BadRequest(ApiResponse<string>.ErrorResponse("Không thể hủy yêu cầu mượn sách."));

        return Ok(ApiResponse<BooleanResponse>.SuccessResponse(result, "Hủy yêu cầu mượn sách thành công."));
    }

    [HttpPut("{id}/approve")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> ApproveBorrowingRequest(int id)
    {
        var staffId = await GetCurrentStaffIdAsync();
        if (staffId == null)
            return Unauthorized(ApiResponse<string>.ErrorResponse("Không xác định được nhân viên."));

        var result = await _borrowingService.ApproveBorrowingRequestAsync(id, staffId.Value);
        if (!result.is_successed)
            return BadRequest(ApiResponse<string>.ErrorResponse("Không thể duyệt yêu cầu mượn sách."));

        return Ok(ApiResponse<BooleanResponse>.SuccessResponse(result, "Duyệt yêu cầu mượn sách thành công."));
    }

    [HttpPut("{id}/reject")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> RejectBorrowingRequest(int id)
    {
        var staffId = await GetCurrentStaffIdAsync();
        if (staffId == null)
            return Unauthorized(ApiResponse<string>.ErrorResponse("Không xác định được nhân viên."));

        var result = await _borrowingService.RejectBorrowingRequestAsync(id, staffId.Value);
        if (!result.is_successed)
            return BadRequest(ApiResponse<string>.ErrorResponse("Không thể từ chối yêu cầu mượn sách."));

        return Ok(ApiResponse<BooleanResponse>.SuccessResponse(result, "Từ chối yêu cầu mượn sách thành công."));
    }

    [HttpPut("renew")]
    public async Task<IActionResult> RenewBorrowingDetail(RenewBorrowingRequest request)
    {
        var accountId = GetCurrentAccountId();
        if (accountId == null)
            return Unauthorized(ApiResponse<string>.ErrorResponse("Không xác định được người dùng."));

        var result = await _borrowingService.RenewBorrowingDetailAsync(request, accountId.Value);
        if (!result.is_successed)
            return BadRequest(ApiResponse<string>.ErrorResponse("Không thể gia hạn mượn sách."));

        return Ok(ApiResponse<BooleanResponse>.SuccessResponse(result, "Gia hạn mượn sách thành công."));
    }

    [HttpPut("return/{borrowingDetailId}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> ReturnBook(int borrowingDetailId)
    {
        var staffId = await GetCurrentStaffIdAsync();
        if (staffId == null)
            return Unauthorized(ApiResponse<string>.ErrorResponse("Không xác định được nhân viên."));

        var result = await _borrowingService.ReturnBookAsync(borrowingDetailId, staffId.Value);
        if (!result.is_successed)
            return BadRequest(ApiResponse<string>.ErrorResponse("Không thể trả sách."));

        return Ok(ApiResponse<BooleanResponse>.SuccessResponse(result, "Trả sách thành công."));
    }

    [HttpGet("my-borrowings")]
    public async Task<IActionResult> GetMyBorrowings()
    {
        var accountId = GetCurrentAccountId();
        if (accountId == null)
            return Unauthorized(ApiResponse<string>.ErrorResponse("Không xác định được người dùng."));

        var borrowings = await _borrowingService.GetBorrowingsByAccountAsync(accountId.Value);
        return Ok(ApiResponse<object>.SuccessResponse(borrowings));
    }

    [HttpGet]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> GetAllBorrowings()
    {
        var borrowings = await _borrowingService.GetAllBorrowingsAsync();
        return Ok(ApiResponse<object>.SuccessResponse(borrowings));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBorrowingById(int id)
    {
        var borrowing = await _borrowingService.GetBorrowingByIdAsync(id);
        if (borrowing == null)
            return NotFound(ApiResponse<string>.ErrorResponse("Không tìm thấy yêu cầu mượn sách."));

        // Check if current user is owner or admin
        var accountId = GetCurrentAccountId();
        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        if (accountId != borrowing.AccountID && role != "ADMIN")
            return Forbid();

        return Ok(ApiResponse<BorrowingResponse>.SuccessResponse(borrowing));
    }

    private Guid? GetCurrentAccountId()
    {
        var accountIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        
        if (accountIdClaim == null || !Guid.TryParse(accountIdClaim.Value, out Guid accountId))
        {
            return null;
        }

        return accountId;
    }

    private async Task<Guid?> GetCurrentStaffIdAsync()
    {
        var accountIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (accountIdClaim == null || !Guid.TryParse(accountIdClaim.Value, out Guid accountId))
        {
            return null;
        }

        var adminUser = await _userService.GetUserByIdAsync(accountId);

        if (adminUser == null || adminUser.Role != "ADMIN")
        {
            return null;
        }

        return adminUser.AdminData == null ? null : adminUser.AdminData.StaffCode;
    }
}