using LibraryMangement.Response;
using LibraryMangement.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryMangement.Controller;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "ADMIN")]
public class AdminController : ControllerBase
{
    private readonly DataAnalysisService _dataAnalysisService;

    public AdminController(DataAnalysisService dataAnalysisService)
    {
        _dataAnalysisService = dataAnalysisService;
    }

    [HttpGet("analytics/today")]
    public async Task<IActionResult> GetTodayAnalytics()
    {
        var analytics = await _dataAnalysisService.GetTodayAnalyticsAsync();
        return Ok(ApiResponse<object>.SuccessResponse(analytics));
    }

    [HttpGet("analytics/borrowing-stats")]
    public async Task<IActionResult> GetBorrowingStats([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        var stats = await _dataAnalysisService.GetBorrowingStatsAsync(startDate, endDate);
        return Ok(ApiResponse<object>.SuccessResponse(stats));
    }
}