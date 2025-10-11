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
public class DebugController : ControllerBase
{
    [HttpGet("token-details")]
    [Authorize]
    public IActionResult GetTokenDetails()
    {
        var claimsInfo = User.Claims.Select(c => new
        {
            Type = c.Type,
            Value = c.Value
        }).ToList();

        return Ok(claimsInfo);
    }
}