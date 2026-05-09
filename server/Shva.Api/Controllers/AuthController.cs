using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Shva.Application.Dtos;
using Shva.Infrastructure;

namespace Shva.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<AppUser> _users;
    private readonly IConfiguration _config;

    public AuthController(UserManager<AppUser> users, IConfiguration config)
    {
        _users = users;
        _config = config;
    }

    [HttpPost("signup")]
    public async Task<ActionResult<AuthResponse>> Signup([FromBody] SignupRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { error = "Email and password required." });

        var user = new AppUser { UserName = request.Email, Email = request.Email };
        var result = await _users.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });
        }

        return Ok(BuildResponse(user));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var user = await _users.FindByEmailAsync(request.Email);
        if (user is null || !await _users.CheckPasswordAsync(user, request.Password))
        {
            return Unauthorized(new { error = "Invalid credentials." });
        }

        return Ok(BuildResponse(user));
    }

    private AuthResponse BuildResponse(AppUser user)
    {
        var key = _config["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key missing");
        var issuer = _config["Jwt:Issuer"] ?? "shva-api";
        var audience = _config["Jwt:Audience"] ?? "shva-client";

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var creds = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds);

        return new AuthResponse(new JwtSecurityTokenHandler().WriteToken(token), user.Email!);
    }
}
