using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shva.Application;
using Shva.Application.Dtos;

namespace Shva.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _service;

    public TransactionsController(ITransactionService service) => _service = service;

    [HttpPost]
    public async Task<ActionResult<TransactionResponseDto>> Submit([FromBody] TransactionRequestDto request, CancellationToken ct)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        try
        {
            var result = await _service.SubmitAsync(userId, request, ct);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("approved")]
    public async Task<ActionResult<IReadOnlyList<TransactionResponseDto>>> GetApproved(CancellationToken ct)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var list = await _service.GetApprovedAsync(userId, ct);
        return Ok(list);
    }
}
